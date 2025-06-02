"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { mockAuth } from "@/lib/firebase"

interface User {
  uid: string
  email: string
  displayName: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await mockAuth.signInWithEmailAndPassword(email, password)
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await mockAuth.createUserWithEmailAndPassword(email, password)
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setLoading(true)
    try {
      const result = await mockAuth.signInWithPopup()
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      }
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      await mockAuth.signOut()
      setUser(null)
      localStorage.removeItem("user")
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
