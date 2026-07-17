import shutil
import uuid
from pathlib import Path

from fastapi import APIRouter, BackgroundTasks, Depends, File, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session

from core.config import settings
from core.deps import get_current_user
from core.limiter import limiter
from db.database import SessionLocal, get_db
from models.document import Document, DocumentStatus
from models.user import User
from schemas.document import DocumentRead
from services.document_processor import process_document

router = APIRouter(prefix="/documents", tags=["documents"])

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".md"}
MAX_UPLOAD_BYTES = 25 * 1024 * 1024


def _run_processing(document_id: int) -> None:
    db = SessionLocal()
    try:
        process_document(db, document_id)
    finally:
        db.close()


def _get_owned_document(db: Session, document_id: int, owner_id: int) -> Document:
    document = db.get(Document, document_id)
    if document is None or document.owner_id != owner_id:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@router.post("", response_model=DocumentRead, status_code=201)
@limiter.limit("10/hour")
def upload_document(
    request: Request,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="File must have a filename")

    suffix = Path(file.filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {suffix or 'unknown'}")

    dest_path = settings.upload_dir / f"{uuid.uuid4().hex}{suffix}"
    with dest_path.open("wb") as out_file:
        shutil.copyfileobj(file.file, out_file)

    size_bytes = dest_path.stat().st_size
    if size_bytes > MAX_UPLOAD_BYTES:
        dest_path.unlink(missing_ok=True)
        raise HTTPException(status_code=400, detail="File exceeds 25MB upload limit")

    document = Document(
        owner_id=current_user.id,
        filename=file.filename,
        file_path=str(dest_path),
        content_type=file.content_type,
        size_bytes=size_bytes,
        status=DocumentStatus.pending,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    background_tasks.add_task(_run_processing, document.id)
    return document


@router.get("", response_model=list[DocumentRead])
def list_documents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return (
        db.query(Document)
        .filter(Document.owner_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )


@router.get("/{document_id}", response_model=DocumentRead)
def get_document(
    document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return _get_owned_document(db, document_id, current_user.id)


@router.delete("/{document_id}", status_code=204)
def delete_document(
    document_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    document = _get_owned_document(db, document_id, current_user.id)
    Path(document.file_path).unlink(missing_ok=True)
    db.delete(document)
    db.commit()
