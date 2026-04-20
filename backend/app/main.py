from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import videos
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(videos.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
