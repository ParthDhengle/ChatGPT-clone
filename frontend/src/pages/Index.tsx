import React, { useState, useEffect } from "react";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatArea } from "@/components/ChatArea";
import Login from "@/components/Login";
import SignUp from "@/components/SignUp";
import { sendMessage } from "@/api/chatApi";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

export interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: string;
  chatId: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  lastMessage?: Date;
}

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const IndexContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string>("");
  const { userId } = useAuth();

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    console.log("User ID:", userId); // For testing
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

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChat === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0].id);
      } else {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: "New Chat",
          messages: [],
          lastMessage: new Date(),
        };
        setChats([newChat]);
        setActiveChat(newChat.id);
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date().toISOString(),
      chatId: activeChat,
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              lastMessage: new Date(),
              title:
                chat.title === "New Chat" && chat.messages.length === 0
                  ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                  : chat.title,
            }
          : chat
      )
    );

    try {
      const assistantResponse = await sendMessage([...(chats.find((chat) => chat.id === activeChat)?.messages || []), userMessage]);
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
                    timestamp: new Date().toISOString(),
                    chatId: activeChat,
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
                    timestamp: new Date().toISOString(),
                    chatId: activeChat,
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
        onDeleteChat={handleDeleteChat}
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
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <IndexContent />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;