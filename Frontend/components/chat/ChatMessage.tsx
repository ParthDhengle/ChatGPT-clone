"use client"

import type React from "react"
import type { Message } from "@/hooks/useChat"
import { User, Bot, Copy, RotateCcw, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatMessageProps {
  message: Message
  onRegenerate?: () => void
  onEdit?: () => void
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate, onEdit }) => {
  const isUser = message.role === "user"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content)
  }

  const formatContent = (content: string) => {
    // Simple markdown-like formatting for code blocks
    const parts = content.split(/(```[\s\S]*?```)/g)

    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.slice(3, -3)
        const lines = code.split("\n")
        const language = lines[0].trim()
        const codeContent = lines.slice(1).join("\n")

        return (
          <div key={index} className="my-4">
            <div className="bg-gray-900 dark:bg-gray-800 rounded-t-lg px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
              {language || "code"}
            </div>
            <pre className="bg-gray-800 dark:bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
              <code>{codeContent}</code>
            </pre>
          </div>
        )
      }

      // Handle inline code
      return part.split(/(`[^`]+`)/g).map((subPart, subIndex) => {
        if (subPart.startsWith("`") && subPart.endsWith("`")) {
          return (
            <code key={subIndex} className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
              {subPart.slice(1, -1)}
            </code>
          )
        }
        return subPart
      })
    })
  }

  return (
    <div className={`group flex gap-4 p-6 ${isUser ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-900"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-600" : "bg-green-600"
        }`}
      >
        {isUser ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="prose dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap break-words">{formatContent(message.content)}</div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            onClick={copyToClipboard}
            size="sm"
            variant="ghost"
            className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </Button>

          {isUser && onEdit && (
            <Button
              onClick={onEdit}
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}

          {!isUser && onRegenerate && (
            <Button
              onClick={onRegenerate}
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
