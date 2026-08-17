from pydantic import BaseModel, Field


class AuthRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=6, max_length=256)


class AuthResponse(BaseModel):
    email: str
    token: str
    expiresAt: str


class SessionResponse(BaseModel):
    email: str
