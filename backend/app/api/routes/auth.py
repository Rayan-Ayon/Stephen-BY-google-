import logging

from fastapi import APIRouter, HTTPException, Query, status

from app.db.session import async_session_maker
from app.schemas.auth import AuthRequest, AuthResponse, SessionResponse
from app.services import auth_service

logger = logging.getLogger(__name__)
router = APIRouter()


def _normalize_email(email: str) -> str:
    return email.strip().lower()


@router.post("/auth/signup", response_model=AuthResponse)
async def signup(data: AuthRequest):
    email = _normalize_email(data.email)
    async with async_session_maker() as db:
        existing = await auth_service.get_user_by_email(db, email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )
        await auth_service.create_user(db, email, data.password)
        session = await auth_service.create_session(db, email)
        return AuthResponse(
            email=email,
            token=session.token,
            expiresAt=session.expires_at.isoformat(),
        )


@router.post("/auth/login", response_model=AuthResponse)
async def login(data: AuthRequest):
    email = _normalize_email(data.email)
    async with async_session_maker() as db:
        user = await auth_service.authenticate_user(db, email, data.password)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )
        session = await auth_service.create_session(db, email)
        return AuthResponse(
            email=email,
            token=session.token,
            expiresAt=session.expires_at.isoformat(),
        )


@router.post("/auth/logout")
async def logout(token: str = Query(..., description="Session token to revoke")):
    async with async_session_maker() as db:
        await auth_service.revoke_token(db, token)
    return {"ok": True}


@router.get("/auth/session", response_model=SessionResponse)
async def get_session(token: str = Query(..., description="Session token")):
    async with async_session_maker() as db:
        user = await auth_service.validate_token(db, token)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session invalid or expired.",
            )
        return SessionResponse(email=user.email)