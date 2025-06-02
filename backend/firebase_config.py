import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
from pathlib import Path

# Get the path to the service account key
current_dir = Path(__file__).parent
service_account_path = current_dir / "credentials" / "firebase-service-account.json"

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        try:
            # Check if service account file exists
            if service_account_path.exists():
                cred = credentials.Certificate(str(service_account_path))
                firebase_admin.initialize_app(cred)
                print("✅ Firebase initialized with service account")
            else:
                # Fallback to default credentials (for production deployment)
                cred = credentials.ApplicationDefault()
                firebase_admin.initialize_app(cred)
                print("✅ Firebase initialized with default credentials")
        except Exception as e:
            print(f"❌ Error initializing Firebase: {e}")
            raise e
    else:
        print("✅ Firebase already initialized")

def get_firestore_client():
    """Get Firestore client"""
    try:
        initialize_firebase()
        return firestore.client()
    except Exception as e:
        print(f"❌ Error getting Firestore client: {e}")
        raise e

def get_auth_client():
    """Get Firebase Auth client"""
    try:
        initialize_firebase()
        return auth
    except Exception as e:
        print(f"❌ Error getting Auth client: {e}")
        raise e

# For testing connection
def test_firebase_connection():
    """Test Firebase connection"""
    try:
        db = get_firestore_client()
        # Try to access a collection (this will fail gracefully if permissions are wrong)
        collections = db.collections()
        print("✅ Firebase connection successful!")
        return True
    except Exception as e:
        print(f"❌ Firebase connection failed: {e}")
        return False