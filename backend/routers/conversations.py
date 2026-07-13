from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.config import settings
from core.deps import get_current_user
from db.database import get_db
from models.conversation import Conversation
from models.document import Document
from models.chunk import DocumentChunk
from models.message import Message, MessageCitation, MessageRole
from models.user import User
from schemas.conversation import ConversationCreate, ConversationRead
from schemas.message import CitationRead, MessageCreate, MessageRead
from services.openai_client import embed_text, generate_answer

router = APIRouter(prefix="/conversations", tags=["conversations"])

HISTORY_LIMIT = 10


def _get_owned_conversation(db: Session, conversation_id: int, owner_id: int) -> Conversation:
    conversation = db.get(Conversation, conversation_id)
    if conversation is None or conversation.owner_id != owner_id:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


def _to_conversation_read(conversation: Conversation) -> ConversationRead:
    return ConversationRead(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        document_ids=[d.id for d in conversation.documents],
    )


def _to_message_read(message: Message) -> MessageRead:
    citations = [
        CitationRead(
            chunk_id=citation.chunk_id,
            document_id=citation.chunk.document_id,
            document_filename=citation.chunk.document.filename,
            chunk_index=citation.chunk.chunk_index,
            content=citation.chunk.content,
            score=citation.score,
        )
        for citation in message.citations
    ]
    return MessageRead(
        id=message.id,
        role=message.role,
        content=message.content,
        created_at=message.created_at,
        citations=citations,
    )


@router.post("", response_model=ConversationRead, status_code=201)
def create_conversation(
    body: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = []
    if body.document_ids:
        documents = (
            db.query(Document)
            .filter(Document.id.in_(body.document_ids), Document.owner_id == current_user.id)
            .all()
        )
        if len(documents) != len(set(body.document_ids)):
            raise HTTPException(status_code=404, detail="One or more documents not found")

    conversation = Conversation(owner_id=current_user.id, title=body.title, documents=documents)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return _to_conversation_read(conversation)


@router.get("", response_model=list[ConversationRead])
def list_conversations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    conversations = (
        db.query(Conversation)
        .filter(Conversation.owner_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )
    return [_to_conversation_read(c) for c in conversations]


@router.get("/{conversation_id}/messages", response_model=list[MessageRead])
def list_messages(
    conversation_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    conversation = _get_owned_conversation(db, conversation_id, current_user.id)
    return [_to_message_read(m) for m in conversation.messages]


@router.post("/{conversation_id}/messages", response_model=MessageRead, status_code=201)
def send_message(
    conversation_id: int,
    body: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    conversation = _get_owned_conversation(db, conversation_id, current_user.id)

    history = [
        {"role": m.role.value, "content": m.content} for m in conversation.messages[-HISTORY_LIMIT:]
    ]

    user_message = Message(conversation_id=conversation.id, role=MessageRole.user, content=body.content)
    db.add(user_message)

    scoped_document_ids = [d.id for d in conversation.documents]
    query_embedding = embed_text(body.content)
    distance = DocumentChunk.embedding.cosine_distance(query_embedding)

    chunk_query = (
        db.query(DocumentChunk, distance.label("distance"))
        .join(Document, DocumentChunk.document_id == Document.id)
        .filter(Document.owner_id == current_user.id)
    )
    if scoped_document_ids:
        chunk_query = chunk_query.filter(DocumentChunk.document_id.in_(scoped_document_ids))

    top_matches = chunk_query.order_by(distance).limit(settings.retrieval_top_k).all()

    answer = generate_answer(
        question=body.content,
        context_chunks=[chunk.content for chunk, _ in top_matches],
        history=history,
    )

    assistant_message = Message(conversation_id=conversation.id, role=MessageRole.assistant, content=answer)
    assistant_message.citations = [
        MessageCitation(chunk_id=chunk.id, score=1 - dist) for chunk, dist in top_matches
    ]
    db.add(assistant_message)

    conversation.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(assistant_message)
    return _to_message_read(assistant_message)
