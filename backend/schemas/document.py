from datetime import datetime

from pydantic import BaseModel, ConfigDict

from models.document import DocumentStatus


class DocumentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    filename: str
    content_type: str | None
    size_bytes: int | None
    status: DocumentStatus
    error_message: str | None
    created_at: datetime
    updated_at: datetime
