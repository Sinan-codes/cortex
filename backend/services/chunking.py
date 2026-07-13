import tiktoken

from core.config import settings

_encoding = tiktoken.get_encoding("cl100k_base")


def chunk_text(text: str) -> list[str]:
    tokens = _encoding.encode(text)
    if not tokens:
        return []

    size = settings.chunk_size_tokens
    overlap = settings.chunk_overlap_tokens
    step = size - overlap

    chunks = []
    for start in range(0, len(tokens), step):
        chunk_tokens = tokens[start : start + size]
        chunks.append(_encoding.decode(chunk_tokens))
        if start + size >= len(tokens):
            break
    return chunks


def count_tokens(text: str) -> int:
    return len(_encoding.encode(text))
