"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { MessageSquare, Sparkles, Shield, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleTryChatGPT = () => {
    if (user) {
      router.push("/chat")
    } else {
      router.push("/login")
    }
  }

  const handleLogin = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">ChatGPT Clone</span>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <Button onClick={() => router.push("/chat")} variant="outline">
              Go to Chat
            </Button>
          ) : (
            <Button onClick={handleLogin} variant="outline">
              Log in
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">Chat with AI</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Experience the power of conversational AI. Get instant answers, creative inspiration, and assistance with
            your daily tasks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={handleTryChatGPT}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              Try ChatGPT
            </Button>
            {!user && (
              <Button onClick={handleLogin} variant="outline" size="lg" className="px-8 py-4 text-lg">
                Log in
              </Button>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Creative Writing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate creative content, stories, and ideas with advanced AI assistance.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Safe & Secure</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your conversations are protected with enterprise-grade security and privacy.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get instant responses and real-time assistance for all your questions.
              </p>
            </div>
          </div>

          {/* Sample Conversation */}
          <div className="mt-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">See it in action</h2>
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-xs">How do I learn React?</div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-2xl px-4 py-3 max-w-md">
                  I'd recommend starting with the official React documentation and building small projects. Would you
                  like me to suggest a learning path?
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
