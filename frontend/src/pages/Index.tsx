// src/pages/Index.tsx
import React, { useState } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import { sendMessage } from "@/api/chatApi";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastMessage?: Date;
}

const Index = () => {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "New Chat",
      messages: [],
      lastMessage: new Date(),
    },
    {
      id: "2",
      title: "Chat with GPT-4",
      messages: [
        {
          id: "1",
          content: "Hello! How can I help you today?",
          sender: "assistant",
          timestamp: new Date(Date.now() - 300000),
        },
        {
          id: "2",
          content: "Can you explain quantum computing?",
          sender: "user",
          timestamp: new Date(Date.now() - 240000),
        },
        {
          id: "3",
          content:
            "Quantum computing is a revolutionary approach to computation that harnesses the principles of quantum mechanics to process information in fundamentally different ways than classical computers.",
          sender: "assistant",
          timestamp: new Date(Date.now() - 180000),
        },
      ],
      lastMessage: new Date(Date.now() - 180000),
    },
    {
      id: "3",
      title: "React Development Tips",
      messages: [
        {
          id: "1",
          content: "What are some best practices for React development?",
          sender: "user",
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: "2",
          content:
            "Here are some key React best practices:\n\n1. Use functional components with hooks\n2. Keep components small and focused\n3. Use proper state management\n4. Implement error boundaries\n5. Optimize with React.memo when needed",
          sender: "assistant",
          timestamp: new Date(Date.now() - 86340000),
        },
      ],
      lastMessage: new Date(Date.now() - 86340000),
    },
  ]);

  const [activeChat, setActiveChat] = useState<string>("2");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      lastMessage: new Date(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    // Get current chat history
    const currentChat = chats.find((chat) => chat.id === activeChat);
    const chatHistory = currentChat ? currentChat.messages : [];

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === activeChat) {
          const updatedChat: Chat = {
            ...chat,
            messages: [...chat.messages, userMessage],
            lastMessage: new Date(),
          };
          if (chat.title === "New Chat" && chat.messages.length === 0) {
            updatedChat.title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
          }
          return updatedChat;
        }
        return chat;
      })
    );

    try {
      // Send full chat history plus new message
      const assistantResponse = await sendMessage([...chatHistory, userMessage]);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: (Date.now() + 1).toString(),
                    content: assistantResponse || "No response received",
                    sender: "assistant",
                    timestamp: new Date(),
                  },
                ],
                lastMessage: new Date(),
              }
            : chat
        )
      );
    } catch (error: any) {
      console.error("Error:", error);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: (Date.now() + 1).toString(),
                    content: `Error: ${error.message}`,
                    sender: "assistant",
                    timestamp: new Date(),
                  },
                ],
                lastMessage: new Date(),
              }
            : chat
        )
      );
    }
  };

  const currentChat = chats.find((chat) => chat.id === activeChat);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex w-full">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={setActiveChat}
        onNewChat={createNewChat}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <ChatArea
        chat={currentChat}
        onSendMessage={handleSendMessage}
        sidebarCollapsed={sidebarCollapsed}
      />
    </div>
  );
};

export default Index;