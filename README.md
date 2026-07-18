# Cortex

A full-stack RAG (Retrieval-Augmented Generation) application — upload documents, chat with them, get cited answers grounded in your own content.

**[Live Demo](#)** · Built by [Mohamed Kassim Sinan](https://github.com/)

![Cortex](https://img.shields.io/badge/status-live-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## What it does

Upload a PDF, Markdown, or text file, and ask questions about it. Cortex chunks the document, embeds it with OpenAI, and retrieves the most relevant passages via vector similarity search to ground the model's answer — with citations back to the exact source chunks used.

If a question falls outside the uploaded documents, the assistant explicitly says so and falls back to general knowledge instead of silently hallucinating or giving a flat "I don't know."

- **Document ingestion** — PDF and text/Markdown upload, async chunking + embedding pipeline with live status (`pending → processing → ready`)
- **Grounded chat** — vector similarity search (pgvector) over document chunks, answers cited back to source passages
- **Transparent fallback** — when context doesn't cover the question, the model says so before answering from general knowledge
- **Per-session isolation** — anonymous, cookie-based sessions keep each visitor's documents and conversations private, no signup required
- **Abuse-resistant by design** — per-session rate limiting on chat and uploads, with clear user-facing messaging when a cap is hit
- **Responsive UI** — full mobile support, including a slide-over navigation drawer for the chat views

## Architecture

```
┌─────────────┐      REST + cookies        ┌──────────────┐       ┌─────────────┐
│   React     │ ───────────────────────▶   │   FastAPI    │──────▶│  PostgreSQL │
│   frontend  │ ◀───────────────────────   │   backend    │◀──────│  + pgvector │
└─────────────┘                            └──────┬───────┘       └─────────────┘
                                                    │
                                                    ▼
                                            ┌──────────────┐
                                            │   OpenAI API │
                                            │ (embeddings +│
                                            │  chat model) │
                                            └──────────────┘
```

**Backend** — FastAPI + SQLAlchemy 2.0, PostgreSQL with the `pgvector` extension for similarity search, Alembic for schema migrations. Documents are chunked, embedded via OpenAI's embeddings API, and stored as vectors; retrieval at query time ranks chunks by cosine similarity before they're fed to the chat model as context.

**Frontend** — React 19 + React Router v8, Tailwind CSS v4. No component library — hand-built UI kept deliberately lean and legible.

**Identity** — no accounts or passwords. Each visitor gets an anonymous, `HttpOnly` session cookie on first request, scoping their documents and conversations without any signup friction.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v8, Tailwind CSS v4, Vite |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic |
| Database | PostgreSQL + pgvector |
| AI | OpenAI (embeddings + chat completion) |
| Rate limiting | slowapi, keyed per session |
| Deployment | Render (backend web service + static site) |

## Notable engineering decisions

- **Grounded-but-honest answers**: the system prompt requires the model to flag when it's answering outside the provided context, rather than either refusing outright or quietly hallucinating — surfaced to the user with a visible disclosure, not hidden in a log.
- **Anonymous sessions over full auth**: for a public-facing demo, a signed session cookie gives real per-user data isolation without the UX cost (or security surface) of an account system — a deliberate scope decision, not an oversight.
- **Session-scoped rate limiting**: keyed off the same session cookie (falling back to IP) so cost exposure on a public deployment stays bounded per visitor rather than global, with a friendly 429 message instead of a silent failure.
- **Cross-origin session cookies**: `SameSite=None; Secure` cookies plus explicit, env-driven CORS origin configuration, since the frontend and backend are deployed as separate services on separate domains.

## Running locally

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your OPENAI_API_KEY and DATABASE_URL
alembic upgrade head
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Requires a PostgreSQL instance with the `pgvector` extension available.

## License

MIT
