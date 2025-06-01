import React, { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import { sendMessage } from "@/api/chatApi";
import { ThemeProvider } from "@/contexts/ThemeContext";

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

const IndexContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      lastMessage: new Date(),
    };
    setChats([newChat]);
    setActiveChat(newChat.id);
  }, []);

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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex w-full transition-colors duration-200">
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

const Index = () => {
  return (
    <ThemeProvider>
      <IndexContent />
    </ThemeProvider>
  );
};

export default Index;