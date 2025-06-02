import os
import json
import firebase_admin
from firebase_admin import credentials, firestore, auth
import logging

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
def initialize_firebase():
    if not firebase_admin._apps:
        try:
            # Try to get service account from environment variable
            service_account_key = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
            
            if service_account_key:
                # If it's a JSON string, parse it
                if service_account_key.startswith('{'):
                    service_account_info = json.loads(service_account_key)
                    cred = credentials.Certificate(service_account_info)
                else:
                    # If it's a file path
                    cred = credentials.Certificate(service_account_key)
            else:
                # Fallback to default credentials (for local development)
                cred = credentials.ApplicationDefault()
            
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {str(e)}")
            raise e

# Get Firestore client
def get_firestore_client():
    if not firebase_admin._apps:
        initialize_firebase()
    return firestore.client()

# Verify Firebase ID token
async def verify_firebase_token(id_token: str):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        logger.error(f"Token verification failed: {str(e)}")
        return None