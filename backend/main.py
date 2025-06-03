from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
import logging
from typing import List, Dict
import uvicorn

# Import our modules
from models import ChatRequest, NewChatRequest, UserCreateRequest
from firebase_config import initialize_firebase
from auth_middleware import get_current_user
import database as db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Firebase
initialize_firebase()

app = FastAPI(title="ChatGPT Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")

client = Groq(api_key=GROQ_API_KEY)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# User endpoints
@app.post("/api/user")
async def create_user(user_request: UserCreateRequest):
    try:
        user_data = user_request.dict()
        success = await db.create_or_update_user(user_data)
        
        if success:
            return {"message": "User created/updated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to create/update user")
    except Exception as e:
        logger.error(f"Error in create_user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/user/{uid}")
async def get_user(uid: str, current_user: dict = Depends(get_current_user)):
    try:
        # Verify user can only access their own data
        if current_user['uid'] != uid:
            raise HTTPException(status_code=403, detail="Access denied")
        
        user = await db.get_user(uid)
        if user:
            return user
        else:
            raise HTTPException(status_code=404, detail="User not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_user: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Chat endpoints
@app.post("/api/chat/new")
async def create_new_chat(request: NewChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        # Verify user can only create chats for themselves
        if current_user['uid'] != request.user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        chat_id = await db.create_chat(request.user_id, request.title)
        
        if chat_id:
            return {"chat_id": chat_id, "message": "Chat created successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to create chat")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in create_new_chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chats/{user_id}")
async def get_user_chats(user_id: str, current_user: dict = Depends(get_current_user)):
    try:
        # Verify user can only access their own chats
        if current_user['uid'] != user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        chats = await db.get_user_chats(user_id)
        return {"chats": chats}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_user_chats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chat/{chat_id}/messages")
async def get_chat_messages(chat_id: str, current_user: dict = Depends(get_current_user)):
    try:
        messages = await db.get_chat_messages(chat_id)
        return {"messages": messages}
    except Exception as e:
        logger.error(f"Error in get_chat_messages: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/chat/{chat_id}")
async def delete_chat(chat_id: str, current_user: dict = Depends(get_current_user)):
    try:
        success = await db.delete_chat(chat_id, current_user['uid'])
        
        if success:
            return {"message": "Chat deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Chat not found or access denied")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in delete_chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Main chat endpoint
@app.post("/api/chat")
async def chat(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    try:
        # Verify user can only chat for themselves
        if current_user['uid'] != request.user_id:
            raise HTTPException(status_code=403, detail="Access denied")
        
        messages = request.messages
        if not messages or not isinstance(messages, list):
            raise HTTPException(status_code=400, detail="Invalid or missing 'messages' in request body")

        # Create new chat if chat_id is not provided
        chat_id = request.chat_id
        if not chat_id:
            # Generate title from first user message
            first_message = next((msg for msg in messages if msg.get("role") == "user"), None)
            title = first_message.get("content", "New Chat")[:50] if first_message else "New Chat"
            chat_id = await db.create_chat(request.user_id, title)
            
            if not chat_id:
                raise HTTPException(status_code=500, detail="Failed to create chat")

        # Save user message
        user_message = messages[-1] if messages and messages[-1].get("role") == "user" else None
        if user_message:
            await db.save_message(chat_id, "user", user_message["content"])

        # Transform messages to Groq-compatible format
        groq_messages: List[Dict[str, str]] = [
            {"role": "system", "content": "You are a helpful assistant."}
        ] + [
            {"role": msg["role"], "content": msg["content"]}
            for msg in messages
            if msg.get("role") in ["user", "assistant"] and isinstance(msg.get("content"), str)
        ]

        try:
            response = client.chat.completions.create(
                model="llama-3.1-70b-versatile",  # Updated to a more stable model
                messages=groq_messages,
                max_tokens=1000,
                temperature=0.7,
                stream=False,
            )
            content = response.choices[0].message.content
            if not content:
                raise HTTPException(status_code=500, detail="Empty response from Groq")
            
            # Save assistant message
            await db.save_message(chat_id, "assistant", content)
            
            return {"content": content, "chat_id": chat_id}
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Groq API error: {str(e)}")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Request processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)