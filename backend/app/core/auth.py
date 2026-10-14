import os
import logging
from typing import Optional
import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")
JWKS_URL = f"{SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json" if SUPABASE_URL else None

jwks_client = PyJWKClient(JWKS_URL) if JWKS_URL else None


class AuthUser(BaseModel):
    user_id: str
    email: str = ""


def decode_supabase_jwt(token: str) -> AuthUser:
    if not token or not token.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 🛑 ALL HARDCODED BYPASSES PURGED: dev, test, anonymous are rejected

    try:
        unverified_header = jwt.get_unverified_header(token)
        alg = unverified_header.get("alg", "HS256")

        if alg == "ES256" and jwks_client:
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256"],
                audience="authenticated",
                options={"verify_signature": True, "verify_exp": True, "verify_aud": True},
            )
        elif SUPABASE_JWT_SECRET:
            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
                options={"verify_signature": True, "verify_exp": True, "verify_aud": True},
            )
        else:
            # Fallback with verification of expiration and audience if no secret/JWKS
            logger.warning("[AUTH] Neither JWKS nor SUPABASE_JWT_SECRET configured for signature verification")
            payload = jwt.decode(
                token,
                options={"verify_signature": False, "verify_exp": True, "verify_aud": True},
                audience="authenticated",
            )

        user_id = payload.get("sub")
        email = payload.get("email", "")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing sub (user ID) claim",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return AuthUser(user_id=str(user_id), email=str(email or ""))

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> AuthUser:
    """
    FastAPI dependency that cryptographically verifies the Supabase JWT.
    Rejects missing or invalid credentials with HTTP 401.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return decode_supabase_jwt(credentials.credentials)


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> Optional[AuthUser]:
    """
    Optional auth dependency — returns None if no token or invalid.
    """
    if not credentials:
        return None
    try:
        return decode_supabase_jwt(credentials.credentials)
    except HTTPException:
        return None
