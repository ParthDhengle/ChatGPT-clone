// Firebase configuration - replace with your actual config
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
}

// Mock Firebase Auth for demo purposes
export const mockAuth = {
  currentUser: null as any,
  signInWithEmailAndPassword: async (email: string, password: string) => {
    // Mock successful login
    return {
      user: {
        uid: "mock-user-id",
        email: email,
        displayName: email.split("@")[0],
      },
    }
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    // Mock successful signup
    return {
      user: {
        uid: "mock-user-id",
        email: email,
        displayName: email.split("@")[0],
      },
    }
  },
  signInWithPopup: async () => {
    // Mock Google login
    return {
      user: {
        uid: "mock-google-user-id",
        email: "user@gmail.com",
        displayName: "Google User",
      },
    }
  },
  signOut: async () => {
    // Mock sign out
    return Promise.resolve()
  },
  onAuthStateChanged: (callback: (user: any) => void) => {
    // Mock auth state listener
    return () => {}
  },
}
