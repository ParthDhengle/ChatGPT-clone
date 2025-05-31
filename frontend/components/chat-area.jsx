"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { MessageBubble } from "@/components/message-bubble"
import { StreamingMessage } from "@/components/streaming-message"

export function ChatArea({ conversation, onSendMessage, isStreaming }) {
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages, isStreaming])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() && !isStreaming) {
      onSendMessage(inputValue)
      setInputValue("")
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  if (!conversation) {
    return (
      <SidebarInset>
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Welcome to ChatGPT</h2>
            <p className="text-muted-foreground">Select a conversation or start a new chat</p>
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <SidebarTrigger className="md:hidden" />
          <h1 className="font-semibold">{conversation.title}</h1>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
                <p className="text-muted-foreground">Send a message to begin chatting</p>
              </div>
            </div>
          ) : (
            <>
              {conversation.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isStreaming && <StreamingMessage />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[44px] max-h-32 resize-none pr-12"
                disabled={isStreaming}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-2 top-2 h-8 w-8 p-0"
                disabled={!inputValue.trim() || isStreaming}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SidebarInset>
  )
}
