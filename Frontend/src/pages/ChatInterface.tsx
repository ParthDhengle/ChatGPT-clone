// src/pages/ChatInterface.tsx
import React, { useState, useEffect, useRef } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { apiService, Chat, Message } from '../services/api';

// Convert backend chat to frontend chat format
const convertBackendChat = (backendChat: any) => ({
  id: backendChat.id,
  title: backendChat.title,
  messages: [], // Messages loaded separately
  createdAt: new Date(backendChat.created_at),
  updatedAt: new Date(backendChat.updated_at)
});

// Convert backend message to frontend message format
const convertBackendMessage = (backendMessage: any) => ({
  id: backendMessage.id,
  content: backendMessage.content,
  role: backendMessage.role as 'user' | 'assistant',
  timestamp: new Date(backendMessage.timestamp)
});

const ChatInterface: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [currentMessages, setCurrentMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  const currentChat = chats.find(chat => chat.id === currentChatId);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load user chats on mount
  useEffect(() => {
    if (currentUser) {
      loadUserChats();
    }
  }, [currentUser]);

  // Load messages when chat changes
  useEffect(() => {
    if (currentChatId) {
      loadChatMessages(currentChatId);
    } else {
      setCurrentMessages([]);
    }
  }, [currentChatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages, isTyping]);

  const loadUserChats = async () => {
    try {
      setLoading(true);
      const backendChats = await apiService.getUserChats();
      const convertedChats = backendChats.map(convertBackendChat);
      setChats(convertedChats);
      
      // Set first chat as current if exists
      if (convertedChats.length > 0) {
        setCurrentChatId(convertedChats[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chats. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadChatMessages = async (chatId: string) => {
    try {
      const backendMessages = await apiService.getChatMessages(chatId);
      const convertedMessages = backendMessages.map(convertBackendMessage);
      setCurrentMessages(convertedMessages);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) {
      // Create new chat first
      const newChatId = await handleNewChat();
      if (!newChatId) return;
      // Wait for the chat to be set as current, then send message
      setTimeout(() => handleSendMessage(content), 100);
      return;
    }

    // Show typing indicator
    setIsTyping(true);

    try {
      // Send message to backend
      const result = await apiService.sendMessage(currentChatId, content);
      
      if (result) {
        // Add both user message and AI response to current messages
        const userMessage = convertBackendMessage(result.userMessage);
        const aiMessage = convertBackendMessage(result.aiResponse);
        
        setCurrentMessages(prev => [...prev, userMessage, aiMessage]);
        
        // Update chat's updated time in the chats list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, updatedAt: new Date() }
              : chat
          )
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = async (): Promise<string | null> => {
    try {
      const chatId = await apiService.createChat('New Chat');
      
      if (chatId) {
        const newChat = {
          id: chatId,
          title: 'New Chat',
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        setChats(prevChats => [newChat, ...prevChats]);
        setCurrentChatId(chatId);
        
        if (isMobile) {
          setSidebarOpen(false);
        }
        
        return chatId;
      }
      
      throw new Error('Failed to create chat');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create new chat. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const success = await apiService.deleteChat(chatId);
      
      if (success) {
        setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
        
        if (currentChatId === chatId) {
          const remainingChats = chats.filter(chat => chat.id !== chatId);
          setCurrentChatId(remainingChats[0]?.id || '');
        }

        toast({
          title: "Chat deleted",
          description: "The chat has been successfully deleted.",
        });
      } else {
        throw new Error('Failed to delete chat');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerate = async () => {
    if (!currentMessages.length) return;

    const lastUserMessage = [...currentMessages]
      .reverse()
      .find(msg => msg.role === 'user');

    if (lastUserMessage) {
      // Remove the last assistant message if it exists
      const updatedMessages = currentMessages.filter(
        msg => !(msg.role === 'assistant' && msg.timestamp > lastUserMessage.timestamp)
      );

      setCurrentMessages(updatedMessages);

      // Regenerate response
      await handleSendMessage(lastUserMessage.content);
    }
  };

  const handleEditMessage = (content: string) => {
    // For demo purposes, just send as new message
    handleSendMessage(content);
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-chat-bg items-center justify-center">
        <div className="text-chat-text">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-chat-bg">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-chat-surface border-b border-chat-green/20 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-chat-text">
              {currentChat?.title || 'New Chat'}
            </h1>
            <div className="text-sm text-chat-text-muted">
              {currentMessages.length} messages
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!currentChatId || currentMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md mx-auto p-6">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-bold text-chat-text mb-2">
                  How can I help you today?
                </h2>
                <p className="text-chat-text-muted">
                  Start a conversation by sending a message below.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-4 space-y-6">
              {currentMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onRegenerate={message.role === 'assistant' ? handleRegenerate : undefined}
                  onEdit={message.role === 'user' ? handleEditMessage : undefined}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          placeholder={currentChat ? "Send a message..." : "Start a new conversation..."}
        />
      </div>
    </div>
  );
};

export default ChatInterface;