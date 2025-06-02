"use client"

import { useState, useRef, useEffect } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { ChatMessage } from "@/components/chat/ChatMessage"
import { ChatInput } from "@/components/chat/ChatInput"
import { TypingIndicator } from "@/components/chat/TypingIndicator"
import { useChat } from "@/hooks/useChat"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const { chats, currentChat, currentChatId, isLoading, createNewChat, deleteChat, sendMessage, selectChat } = useChat()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages, isLoading])

  const handleSendMessage = (message: string) => {
    if (!currentChatId) {
      const newChatId = createNewChat()
      // Wait for the chat to be created, then send the message
      setTimeout(() => sendMessage(message), 0)
    } else {
      sendMessage(message)
    }
  }

  const handleNewChat = () => {
    createNewChat()
    setMobileMenuOpen(false)
  }

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId)
    setMobileMenuOpen(false)
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white dark:bg-gray-900">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} size="icon" variant="ghost" className="h-10 w-10">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 fixed md:relative z-40 transition-transform duration-300 ease-in-out
        `}
        >
          <ChatSidebar
            chats={chats}
            currentChatId={currentChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={deleteChat}
            isCollapsed={sidebarCollapsed}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Sidebar Toggle */}
          <div className="hidden md:block absolute top-4 left-4 z-30">
            <Button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              size="icon"
              variant="ghost"
              className="h-10 w-10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {currentChat?.messages.length === 0 || !currentChat ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md mx-auto p-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How can I help you today?</h2>
                  <p className="text-gray-600 dark:text-gray-400">Start a conversation by typing a message below.</p>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {currentChat.messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onRegenerate={() => {
                      // TODO: Implement regenerate functionality
                      console.log("Regenerate message")
                    }}
                    onEdit={() => {
                      // TODO: Implement edit functionality
                      console.log("Edit message")
                    }}
                  />
                ))}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </ProtectedRoute>
  )
}
