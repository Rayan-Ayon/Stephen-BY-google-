import hashlib
import hmac
import logging
import secrets
from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import AuthSession, User

logger = logging.getLogger(__name__)

PBKDF2_ITERATIONS = 200_000
SESSION_TTL_DAYS = 30


def hash_password(password: str) -> str:
    """Hash a password with PBKDF2-HMAC-SHA256 and a per-user random salt."""
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS
    )
    return f"{PBKDF2_ITERATIONS}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
        iterations_str, salt_hex, digest_hex = stored.split("$")
        iterations = int(iterations_str)
        salt = bytes.fromhex(salt_hex)
        expected = bytes.fromhex(digest_hex)
    except (ValueError, TypeError):
        return False
    actual = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, iterations
    )
    return hmac.compare_digest(actual, expected)


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()


async def create_user(db: AsyncSession, email: str, password: str) -> User:
    user = User(email=email, password_hash=hash_password(password))
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(db: AsyncSession, email: str, password: str) -> User | None:
    user = await get_user_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user


async def create_session(db: AsyncSession, email: str) -> AuthSession:
    token = secrets.token_urlsafe(32)
    session = AuthSession(
        token=token,
        user_email=email,
        expires_at=datetime.utcnow() + timedelta(days=SESSION_TTL_DAYS),
    )
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return session


async def validate_token(db: AsyncSession, token: str) -> User | None:
    if not token:
        return None
    result = await db.execute(select(AuthSession).where(AuthSession.token == token))
    session = result.scalars().first()
    if not session:
        return None
    if session.expires_at < datetime.utcnow():
        return None
    return await get_user_by_email(db, session.user_email)


async def revoke_token(db: AsyncSession, token: str) -> bool:
    result = await db.execute(select(AuthSession).where(AuthSession.token == token))
    session = result.scalars().first()
    if not session:
        return False
    await db.delete(session)
    await db.commit()
    return True