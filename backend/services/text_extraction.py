from pathlib import Path

from pypdf import PdfReader

TEXT_CONTENT_TYPES = {"text/plain", "text/markdown"}
TEXT_EXTENSIONS = {".txt", ".md"}


class UnsupportedFileType(Exception):
    pass


def extract_text(file_path: Path, content_type: str | None) -> str:
    suffix = file_path.suffix.lower()

    if suffix == ".pdf" or content_type == "application/pdf":
        reader = PdfReader(str(file_path))
        return "\n\n".join(page.extract_text() or "" for page in reader.pages)

    if suffix in TEXT_EXTENSIONS or content_type in TEXT_CONTENT_TYPES:
        return file_path.read_text(encoding="utf-8", errors="ignore")

    raise UnsupportedFileType(f"Unsupported file type: {content_type or suffix}")
