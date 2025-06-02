"use client"

import type React from "react"
import { Bot } from "lucide-react"

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4 p-6 bg-white dark:bg-gray-900">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
        <Bot className="h-5 w-5 text-white" />
      </div>

      {/* Typing animation */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
          <span>ChatGPT is thinking</span>
          <div className="typing-animation">
            <span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
