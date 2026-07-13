from datetime import datetime

from pydantic import BaseModel, ConfigDict

from models.message import MessageRole


class MessageCreate(BaseModel):
    content: str


class CitationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    chunk_id: int
    document_id: int
    document_filename: str
    chunk_index: int
    content: str
    score: float | None


class MessageRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: MessageRole
    content: str
    created_at: datetime
    citations: list[CitationRead] = []
