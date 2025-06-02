from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class User(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    created_at: datetime
    last_login: datetime

class Message(BaseModel):
    id: Optional[str] = None
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime
    chat_id: str

class Chat(BaseModel):
    id: Optional[str] = None
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: Optional[List[Message]] = []

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    user_id: str
    chat_id: Optional[str] = None

class NewChatRequest(BaseModel):
    user_id: str
    title: str

class UserCreateRequest(BaseModel):
    uid: str
    email: str
    display_name: Optional[str] = None
    photo_url: Optional[str] = None