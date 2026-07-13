from fastapi import FastAPI

from routers import conversations, documents

app = FastAPI(title="Cortex")

app.include_router(documents.router)
app.include_router(conversations.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}
