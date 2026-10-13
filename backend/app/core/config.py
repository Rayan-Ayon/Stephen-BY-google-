import os
from pathlib import Path
from dotenv import load_dotenv

# Search for .env in current directory, backend/.env, and repo root
_env_candidates = [
    Path(__file__).resolve().parent.parent.parent / ".env",
    Path.cwd() / "backend" / ".env",
    Path.cwd() / ".env",
]
for _candidate in _env_candidates:
    if _candidate.is_file():
        load_dotenv(_candidate)
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "") or os.getenv("GOOGLE_API_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./stephen.db")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
GEMINI_LIVE_MODEL = os.getenv("GEMINI_LIVE_MODEL", "gemini-2.5-flash-native-audio-preview-12-2025")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
SILICONFLOW_API_KEY = os.getenv("SILICONFLOW_API_KEY", "")
SILICONFLOW_EMBEDDING_MODEL = os.getenv("SILICONFLOW_EMBEDDING_MODEL", "Qwen/Qwen3-Embedding-8B")
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY", "")
CHROMA_TENANT = os.getenv("CHROMA_TENANT", "")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")