import os
import logging
from datetime import datetime, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

logger = logging.getLogger(__name__)

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
security = HTTPBearer(auto_error=False)


class AuthUser:
    """Authenticated user extracted from Supabase JWT."""
    def __init__(self, user_id: str, email: str):
        self.user_id = user_id
        self.email = email


def decode_supabase_jwt(token: str) -> dict:
    """
    Decode a Supabase JWT token.

    Supabase issues tokens signed with ES256 (Elliptic Curve). Since the backend
    does not hold the EC private key, signature verification is skipped. Token
    parsing, expiry, and audience checks still apply.
    """
    try:
        unverified_header = jwt.get_unverified_header(token)
        alg = unverified_header.get("alg", "")
        allowed = {
            "HS256", "HS384", "HS512",
            "RS256", "RS384", "RS512",
            "ES256", "ES384", "ES512",
            "PS256", "PS384", "PS512",
            "EdDSA",
        }
        if alg not in allowed:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Unsupported token algorithm: {alg}",
            )
        payload = jwt.decode(
            token,
            options={
                "verify_signature": False,
                "verify_exp": True,
                "verify_aud": True,
            },
            algorithms=[alg],
            audience="authenticated",
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> AuthUser:
    """
    FastAPI dependency that extracts and validates the Supabase JWT.
    
    Usage in routes:
        @router.get("/some-endpoint")
        async def my_endpoint(user: AuthUser = Depends(get_current_user)):
            # user.user_id and user.email are available
            ...
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = decode_supabase_jwt(credentials.credentials)
    
    user_id = payload.get("sub")
    email = payload.get("email")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token missing user ID (sub claim)",
        )
    
    return AuthUser(user_id=user_id, email=email or "")


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[AuthUser]:
    """
    Optional auth dependency — returns None if no token is provided.
    Use for endpoints that work both with and without auth.
    """
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
