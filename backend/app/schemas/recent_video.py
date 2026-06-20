from typing import Optional
from pydantic import BaseModel


class RecentVideoCreate(BaseModel):
    videoId: str
    title: str
    description: str = ""
    videoUrl: str
    thumbnailUrl: str = ""
    contentType: str = "video"
    userEmail: str


class RecentVideoResponse(BaseModel):
    id: int
    videoId: str
    title: str
    description: str
    videoUrl: str
    thumbnailUrl: str
    contentType: str
    createdAt: str
