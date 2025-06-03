
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // These are placeholder values - user will need to replace with their Firebase config
  apiKey: "AIzaSyDjkOj1IxA5VyuB_0quIVI0oFLuvSmJ5jk",
  authDomain: "convo-6ec96.firebaseapp.com",
  projectId: "convo-6ec96",
  storageBucket: "convo-6ec96.firebasestorage.app",
  messagingSenderId: "279333232061",
  appId: "1:279333232061:web:511814ee0bef0376c706d4",
  measurementId: "G-8KKNTCVJP7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
