"use client"

import type React from "react"
import { Plus, MessageSquare, Trash2, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import type { Chat } from "@/hooks/useChat"
import { ThemeToggle } from "@/components/ThemeToggle"

interface ChatSidebarProps {
  chats: Chat[]
  currentChatId: string | null
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onDeleteChat: (chatId: string) => void
  isCollapsed: boolean
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isCollapsed,
}) => {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gray-900 dark:bg-gray-950 flex flex-col items-center py-4 space-y-4">
        <Button onClick={onNewChat} size="icon" className="h-10 w-10 bg-gray-800 hover:bg-gray-700">
          <Plus className="h-5 w-5" />
        </Button>
        <div className="flex-1" />
        <ThemeToggle />
        <Button
          onClick={handleSignOut}
          size="icon"
          variant="ghost"
          className="h-10 w-10 text-gray-400 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-64 bg-gray-900 dark:bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <Button onClick={onNewChat} className="w-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group relative flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-800 mb-1 ${
              currentChatId === chat.id ? "bg-gray-800" : ""
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <MessageSquare className="h-4 w-4 mr-3 flex-shrink-0" />
            <span className="flex-1 truncate text-sm">{chat.title}</span>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteChat(chat.id)
              }}
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-400"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
              {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName || user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            <Button
              onClick={handleSignOut}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
