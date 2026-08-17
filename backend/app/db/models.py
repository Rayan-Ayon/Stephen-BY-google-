from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(512), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        {"mysql_charset": "utf8mb4", "sqlite_autoincrement": True},
    )


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String(128), nullable=False, unique=True, index=True)
    user_email = Column(String(255), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

    __table_args__ = (
        {"mysql_charset": "utf8mb4", "sqlite_autoincrement": True},
    )


class AIResult(Base):
    __tablename__ = "ai_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    video_id = Column(String(20), nullable=False, index=True)
    feature_type = Column(String(20), nullable=False)
    payload_json = Column(Text, nullable=False)
    model_used = Column(String(50), nullable=False)
    user_email = Column(String(255), nullable=False, index=True, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        {"mysql_charset": "utf8mb4", "sqlite_autoincrement": True},
    )


class RecentVideo(Base):
    __tablename__ = "recent_videos"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_email = Column(String(255), nullable=False, index=True)
    video_id = Column(String(20), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, default="")
    video_url = Column(String(1000), nullable=False)
    thumbnail_url = Column(String(1000), default="")
    content_type = Column(String(20), default="video")
    created_at = Column(DateTime, default=datetime.utcnow)