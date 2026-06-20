import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.api.routes import videos, ai_features, recent_videos
from app.db.session import init_db, backfill_user_email

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database...")
    await init_db()
    logger.info("Database initialized")

    logger.info("Backfilling orphan user_email rows...")
    try:
        await backfill_user_email()
        logger.info("Backfill complete")
    except Exception as e:
        logger.warning(f"Backfill skipped or failed (non-fatal): {e}")

    yield
    logger.info("Shutting down...")


app = FastAPI(title="Stephen API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(videos.router, prefix="/api")
app.include_router(ai_features.router, prefix="/api")
app.include_router(recent_videos.router, prefix="/api")


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}