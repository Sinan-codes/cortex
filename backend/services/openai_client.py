from functools import lru_cache

from openai import OpenAI

from core.config import settings


@lru_cache
def _get_client() -> OpenAI:
    return OpenAI(api_key=settings.openai_api_key)


FALLBACK_MARKER = "[[GENERAL_KNOWLEDGE]]"
FALLBACK_NOTE = "This isn't covered in your documents, but here's what I know:\n\n"

SYSTEM_PROMPT = (
    "You are a helpful assistant answering questions about the user's uploaded documents. "
    "Answer using the provided context whenever it's relevant. If the context doesn't contain "
    f"the answer, begin your reply with the exact token {FALLBACK_MARKER} and then answer from "
    "your own general knowledge instead."
)


def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    response = _get_client().embeddings.create(model=settings.embedding_model, input=texts)
    return [item.embedding for item in response.data]


def embed_text(text: str) -> list[float]:
    return embed_texts([text])[0]


def generate_answer(
    question: str, context_chunks: list[str], history: list[dict[str, str]]
) -> tuple[str, bool]:
    """Returns (answer, is_grounded). is_grounded is False when the model fell back to
    its own general knowledge rather than the provided document context."""
    context = "\n\n---\n\n".join(context_chunks) or "No relevant context was found."
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    messages.append(
        {
            "role": "user",
            "content": f"Context:\n{context}\n\nQuestion: {question}",
        }
    )
    response = _get_client().chat.completions.create(model=settings.chat_model, messages=messages)
    content = (response.choices[0].message.content or "").strip()

    if content.startswith(FALLBACK_MARKER):
        return FALLBACK_NOTE + content[len(FALLBACK_MARKER):].lstrip(), False
    return content, True
