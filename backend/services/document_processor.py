from pathlib import Path

from sqlalchemy.orm import Session

from models.chunk import DocumentChunk
from models.document import Document, DocumentStatus
from services.chunking import chunk_text, count_tokens
from services.openai_client import embed_texts
from services.text_extraction import extract_text


def process_document(db: Session, document_id: int) -> None:
    document = db.get(Document, document_id)
    if document is None:
        return

    document.status = DocumentStatus.processing
    db.commit()

    try:
        text = extract_text(Path(document.file_path), document.content_type)
        chunks = chunk_text(text)
        if not chunks:
            raise ValueError("No extractable text was found in this document")

        embeddings = embed_texts(chunks)
        for index, (content, embedding) in enumerate(zip(chunks, embeddings)):
            db.add(
                DocumentChunk(
                    document_id=document.id,
                    chunk_index=index,
                    content=content,
                    token_count=count_tokens(content),
                    embedding=embedding,
                )
            )
        document.status = DocumentStatus.ready
        document.error_message = None
    except Exception as exc:
        document.status = DocumentStatus.failed
        document.error_message = str(exc)

    db.commit()
