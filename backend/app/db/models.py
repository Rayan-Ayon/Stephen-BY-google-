from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.db.session import Base


class AIResult(Base):
    __tablename__ = "ai_results"

    id = Column(Integer, primary_key=True, autoincrement=True)
    video_id = Column(String(20), nullable=False, index=True)
    feature_type = Column(String(20), nullable=False)
    payload_json = Column(Text, nullable=False)
    model_used = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        {"mysql_charset": "utf8mb4", "sqlite_autoincrement": True},
    )