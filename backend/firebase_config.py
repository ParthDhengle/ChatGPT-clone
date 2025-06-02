import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
from pathlib import Path
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

logger = logging.getLogger(__name__)

# Get the path to the service account key
current_dir = Path(__file__).parent
service_account_path = current_dir / "credentials" / "firebase-service-account.json"

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    if not firebase_admin._apps:
        try:
            # Check if service account file exists
            if service_account_path.exists():
                print(f"📁 Looking for service account at: {service_account_path}")
                cred = credentials.Certificate(str(service_account_path))
                firebase_admin.initialize_app(cred)
                print("✅ Firebase initialized with service account")
            else:
                print(f"⚠️  Service account file not found at: {service_account_path}")
                print("📁 Current directory:", current_dir)
                print("📁 Expected path:", service_account_path)
                
                # Check if we have environment variables for Firebase
                project_id = os.getenv('FIREBASE_PROJECT_ID')
                if project_id:
                    print(f"🔧 Attempting to use environment variables for project: {project_id}")
                    # Try to initialize with project ID only (for development)
                    firebase_admin.initialize_app(options={'projectId': project_id})
                    print("✅ Firebase initialized with project ID from environment")
                else:
                    raise Exception("No Firebase credentials found. Please add service account file or set FIREBASE_PROJECT_ID")
        except Exception as e:
            print(f"❌ Error initializing Firebase: {e}")
            print("💡 Make sure to:")
            print("   1. Download your Firebase service account key")
            print("   2. Place it at: backend/credentials/firebase-service-account.json")
            print("   3. Or set up Application Default Credentials")
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

async def verify_firebase_token(id_token: str):
    """
    Verify Firebase ID token and return decoded token
    """
    try:
        initialize_firebase()
        # Verify the ID token
        decoded_token = auth.verify_id_token(id_token)
        logger.info(f"Token verified for user: {decoded_token.get('uid')}")
        return decoded_token
    except auth.InvalidIdTokenError:
        logger.error("Invalid ID token")
        return None
    except auth.ExpiredIdTokenError:
        logger.error("Expired ID token")
        return None
    except Exception as e:
        logger.error(f"Error verifying token: {str(e)}")
        return None

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