// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjkOj1IxA5VyuB_0quIVI0oFLuvSmJ5jk",
  authDomain: "convo-6ec96.firebaseapp.com",
  projectId: "convo-6ec96",
  storageBucket: "convo-6ec96.firebasestorage.app",
  messagingSenderId: "279333232061",
  appId: "1:279333232061:web:511814ee0bef0376c706d4",
  measurementId: "G-8KKNTCVJP7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export default app;