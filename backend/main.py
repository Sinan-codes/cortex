from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import conversations, documents

app = FastAPI(title="Cortex")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router)
app.include_router(conversations.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
