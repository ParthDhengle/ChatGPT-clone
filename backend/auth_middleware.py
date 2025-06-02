from fastapi import HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_config import verify_firebase_token
import logging

logger = logging.getLogger(__name__)
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Verify Firebase ID token and return user info
    """
    try:
        token = credentials.credentials
        decoded_token = await verify_firebase_token(token)
        
        if not decoded_token:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )
        
        return decoded_token
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Authentication failed"
        )