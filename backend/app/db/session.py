from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import text
from app.core.config import DATABASE_URL

Base = declarative_base()

engine = create_async_engine(DATABASE_URL, echo=False)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_db():
    async with async_session_maker() as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


BACKFILL_TARGET = "ayonburg@gmail.com"


async def _ensure_column(conn, table: str, column: str, col_def: str):
    """Add a column if it doesn't exist (SQLite-safe migration)."""
    try:
        await conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {col_def}"))
        import logging
        logging.getLogger(__name__).info(f"Added column {column} to {table}")
    except Exception:
        pass  # Column already exists


async def backfill_user_email():
    """Migrate tables to add user_email if missing, then claim orphaned rows."""
    tables = ["ai_results", "recent_videos"]
    async with engine.begin() as conn:
        for table in tables:
            await _ensure_column(
                conn, table,
                column="user_email",
                col_def="user_email VARCHAR(255) NOT NULL DEFAULT ''",
            )
            result = await conn.execute(
                text(
                    f"UPDATE {table} SET user_email = :target "
                    f"WHERE user_email = '' OR user_email IS NULL"
                ),
                {"target": BACKFILL_TARGET},
            )
            if result.rowcount > 0:
                import logging
                logging.getLogger(__name__).info(
                    f"Backfilled {result.rowcount} row(s) in {table} → {BACKFILL_TARGET}"
                )