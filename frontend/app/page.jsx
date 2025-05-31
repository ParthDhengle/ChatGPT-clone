"use client"

import { useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat-sidebar"
import { ChatArea } from "@/components/chat-area"

// Mock data for conversations
const initialConversations = [
  {
    id: "1",
    title: "New Chat",
    messages: [],
  },
  {
    id: "2",
    title: "React Best Practices",
    messages: [
      {
        id: "1",
        content: "What are some React best practices?",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        content:
          "Here are some key React best practices:\n\n1. **Use functional components** with hooks instead of class components\n2. **Keep components small and focused** on a single responsibility\n3. **Use proper state management** - useState for local state, useContext for shared state\n4. **Optimize performance** with useMemo and useCallback when needed\n5. **Follow naming conventions** - PascalCase for components, camelCase for functions\n6. **Use TypeScript** for better type safety and developer experience",
        sender: "assistant",
        timestamp: new Date(Date.now() - 3590000),
      },
    ],
  },
  {
    id: "3",
    title: "JavaScript Async/Await",
    messages: [
      {
        id: "1",
        content: "Explain async/await in JavaScript",
        sender: "user",
        timestamp: new Date(Date.now() - 7200000),
      },
      {
        id: "2",
        content:
          "Async/await is a syntax that makes it easier to work with promises in JavaScript. Here's how it works:\n\n**async** - declares a function as asynchronous\n**await** - pauses execution until a promise resolves\n\n```javascript\nasync function fetchData() {\n  try {\n    const response = await fetch('/api/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n```\n\nThis is much cleaner than using .then() chains!",
        sender: "assistant",
        timestamp: new Date(Date.now() - 7190000),
      },
    ],
  },
  {
    id: "4",
    title: "CSS Grid vs Flexbox",
    messages: [
      {
        id: "1",
        content: "When should I use CSS Grid vs Flexbox?",
        sender: "user",
        timestamp: new Date(Date.now() - 86400000),
      },
    ],
  },
]

export default function ChatApp() {
  const [conversations, setConversations] = useState(initialConversations)
  const [activeConversationId, setActiveConversationId] = useState("2")
  const [isStreaming, setIsStreaming] = useState(false)

  const activeConversation = conversations.find((conv) => conv.id === activeConversationId)

  const handleSendMessage = async (content) => {
    if (!content.trim() || isStreaming) return

    const userMessage = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    }

    // Add user message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === activeConversationId ? { ...conv, messages: [...conv.messages, userMessage] } : conv,
      ),
    )

    // Start streaming simulation
    setIsStreaming(true)

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(content),
        sender: "assistant",
        timestamp: new Date(),
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeConversationId ? { ...conv, messages: [...conv.messages, aiMessage] } : conv,
        ),
      )

      setIsStreaming(false)
    }, 2000)
  }

  const generateAIResponse = (userMessage) => {
    const responses = [
      "That's a great question! Let me help you with that.",
      "I understand what you're asking. Here's my perspective on this topic.",
      "Thanks for asking! This is an interesting topic to explore.",
      "Let me break this down for you in a clear and helpful way.",
      "That's something many people wonder about. Here's what I think.",
    ]

    return (
      responses[Math.floor(Math.random() * responses.length)] +
      "\n\nThis is a simulated response to demonstrate the chat interface. In a real application, this would be connected to an AI model to provide actual intelligent responses based on your input."
    )
  }

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    }

    setConversations((prev) => [newChat, ...prev])
    setActiveConversationId(newChat.id)
  }

  const handleSelectConversation = (conversationId) => {
    setActiveConversationId(conversationId)
  }

  return (
    <div className="h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
        />
        <ChatArea conversation={activeConversation} onSendMessage={handleSendMessage} isStreaming={isStreaming} />
      </SidebarProvider>
    </div>
  )
}
