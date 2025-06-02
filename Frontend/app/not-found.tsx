"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, Home } from "lucide-react"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <MessageSquare className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={() => router.push("/")} className="w-full bg-blue-600 hover:bg-blue-700">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
          <Button onClick={() => router.back()} variant="outline" className="w-full">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
