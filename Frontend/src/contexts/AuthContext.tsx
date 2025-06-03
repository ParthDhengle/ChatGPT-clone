
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { apiService } from '../services/api';


interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase user with backend
  const syncUserWithBackend = async (user: User) => {
    try {
      // Get Firebase ID token and store it for API calls
      const token = await user.getIdToken();
      localStorage.setItem('firebase_token', token);
      
      // Sync user data with backend
      await apiService.syncUserWithBackend(user);
    } catch (error) {
      console.error('Error syncing user with backend:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await syncUserWithBackend(result.user);
  };

  const signup = async (email: string, password: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await syncUserWithBackend(result.user);
  };

  const logout = async () => {
    // Clear stored token
    localStorage.removeItem('firebase_token');
    await signOut(auth);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserWithBackend(result.user);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Sync with backend whenever auth state changes
        await syncUserWithBackend(user);
      } else {
        // Clear token when user logs out
        localStorage.removeItem('firebase_token');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loginWithGoogle,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
