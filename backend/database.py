from firebase_config import get_firestore_client
from models import User, Chat, Message
from datetime import datetime
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)
db = get_firestore_client()

# User operations
async def create_or_update_user(user_data: dict) -> bool:
    try:
        user_ref = db.collection('users').document(user_data['uid'])
        user_data['last_login'] = datetime.now()
        
        # Check if user exists
        user_doc = user_ref.get()
        if user_doc.exists:
            # Update last login
            user_ref.update({'last_login': user_data['last_login']})
        else:
            # Create new user
            user_data['created_at'] = user_data['last_login']
            user_ref.set(user_data)
        
        return True
    except Exception as e:
        logger.error(f"Error creating/updating user: {str(e)}")
        return False

async def get_user(uid: str) -> Optional[dict]:
    try:
        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()
        
        if user_doc.exists:
            return user_doc.to_dict()
        return None
    except Exception as e:
        logger.error(f"Error getting user: {str(e)}")
        return None

# Chat operations
async def create_chat(user_id: str, title: str) -> Optional[str]:
    try:
        chat_data = {
            'user_id': user_id,
            'title': title,
            'created_at': datetime.now(),
            'updated_at': datetime.now()
        }
        
        chat_ref = db.collection('chats').add(chat_data)
        return chat_ref[1].id
    except Exception as e:
        logger.error(f"Error creating chat: {str(e)}")
        return None

async def get_user_chats(user_id: str) -> List[dict]:
    try:
        chats_ref = db.collection('chats').where('user_id', '==', user_id).order_by('updated_at', direction='DESCENDING')
        chats = chats_ref.stream()
        
        chat_list = []
        for chat in chats:
            chat_data = chat.to_dict()
            chat_data['id'] = chat.id
            chat_list.append(chat_data)
        
        return chat_list
    except Exception as e:
        logger.error(f"Error getting user chats: {str(e)}")
        return []

async def delete_chat(chat_id: str, user_id: str) -> bool:
    try:
        # Verify chat belongs to user
        chat_ref = db.collection('chats').document(chat_id)
        chat_doc = chat_ref.get()
        
        if not chat_doc.exists:
            return False
        
        chat_data = chat_doc.to_dict()
        if chat_data.get('user_id') != user_id:
            return False
        
        # Delete all messages in the chat
        messages_ref = db.collection('messages').where('chat_id', '==', chat_id)
        messages = messages_ref.stream()
        
        for message in messages:
            message.reference.delete()
        
        # Delete the chat
        chat_ref.delete()
        return True
    except Exception as e:
        logger.error(f"Error deleting chat: {str(e)}")
        return False

# Message operations
async def save_message(chat_id: str, role: str, content: str) -> Optional[str]:
    try:
        message_data = {
            'chat_id': chat_id,
            'role': role,
            'content': content,
            'timestamp': datetime.now()
        }
        
        message_ref = db.collection('messages').add(message_data)
        
        # Update chat's updated_at timestamp
        chat_ref = db.collection('chats').document(chat_id)
        chat_ref.update({'updated_at': datetime.now()})
        
        return message_ref[1].id
    except Exception as e:
        logger.error(f"Error saving message: {str(e)}")
        return None

async def get_chat_messages(chat_id: str) -> List[dict]:
    try:
        messages_ref = db.collection('messages').where('chat_id', '==', chat_id).order_by('timestamp')
        messages = messages_ref.stream()
        
        message_list = []
        for message in messages:
            message_data = message.to_dict()
            message_data['id'] = message.id
            message_list.append(message_data)
        
        return message_list
    except Exception as e:
        logger.error(f"Error getting chat messages: {str(e)}")
        return []

async def update_chat_title(chat_id: str, title: str, user_id: str) -> bool:
    try:
        chat_ref = db.collection('chats').document(chat_id)
        chat_doc = chat_ref.get()
        
        if not chat_doc.exists:
            return False
        
        chat_data = chat_doc.to_dict()
        if chat_data.get('user_id') != user_id:
            return False
        
        chat_ref.update({
            'title': title,
            'updated_at': datetime.now()
        })
        return True
    except Exception as e:
        logger.error(f"Error updating chat title: {str(e)}")
        return False