from functools import lru_cache

from openai import OpenAI

from core.config import settings


@lru_cache
def _get_client() -> OpenAI:
    return OpenAI(api_key=settings.openai_api_key)


SYSTEM_PROMPT = (
    "You are a helpful assistant answering questions about the user's uploaded documents. "
    "Answer only using the provided context. If the context doesn't contain the answer, "
    "say you don't know rather than guessing."
)


def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    response = _get_client().embeddings.create(model=settings.embedding_model, input=texts)
    return [item.embedding for item in response.data]


def embed_text(text: str) -> list[float]:
    return embed_texts([text])[0]


def generate_answer(question: str, context_chunks: list[str], history: list[dict[str, str]]) -> str:
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
    return response.choices[0].message.content or ""
