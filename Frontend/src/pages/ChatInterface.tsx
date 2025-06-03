
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ChatSidebar from '../components/ChatSidebar';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import { Chat, ChatMessage as ChatMessageType } from '../types/chat';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Dummy data for initial chats
const dummyChats: Chat[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    messages: [
      {
        id: '1',
        content: 'How do I get started with React?',
        role: 'user',
        timestamp: new Date('2024-01-15T10:00:00')
      },
      {
        id: '2',
        content: 'Great question! React is a popular JavaScript library for building user interfaces. Here are the basic steps to get started:\n\n1. **Install Node.js** - React requires Node.js to run\n2. **Create a new React app** using `npx create-react-app my-app`\n3. **Learn the basics** - Components, JSX, Props, and State\n4. **Practice building** simple components\n\n```jsx\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n```\n\nWould you like me to explain any of these concepts in more detail?',
        role: 'assistant',
        timestamp: new Date('2024-01-15T10:01:00')
      }
    ],
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:01:00')
  },
  {
    id: '2',
    title: 'JavaScript Array Methods',
    messages: [
      {
        id: '3',
        content: 'Explain JavaScript array methods like map, filter, and reduce',
        role: 'user',
        timestamp: new Date('2024-01-14T15:30:00')
      },
      {
        id: '4',
        content: 'JavaScript array methods are powerful tools for working with arrays. Here are the three most important ones:\n\n## 🗺️ map()\nTransforms each element and returns a new array:\n```javascript\nconst numbers = [1, 2, 3, 4];\nconst doubled = numbers.map(x => x * 2);\n// Result: [2, 4, 6, 8]\n```\n\n## 🔍 filter()\nCreates a new array with elements that pass a test:\n```javascript\nconst numbers = [1, 2, 3, 4, 5, 6];\nconst evens = numbers.filter(x => x % 2 === 0);\n// Result: [2, 4, 6]\n```\n\n## 🔄 reduce()\nReduces an array to a single value:\n```javascript\nconst numbers = [1, 2, 3, 4];\nconst sum = numbers.reduce((acc, curr) => acc + curr, 0);\n// Result: 10\n```\n\nThese methods are functional programming concepts that help write cleaner, more readable code!',
        role: 'assistant',
        timestamp: new Date('2024-01-14T15:31:00')
      }
    ],
    createdAt: new Date('2024-01-14T15:30:00'),
    updatedAt: new Date('2024-01-14T15:31:00')
  }
];

const ChatInterface: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(dummyChats);
  const [currentChatId, setCurrentChatId] = useState<string>(dummyChats[0]?.id || '');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat?.messages, isTyping]);

  // Mock AI response generator
  const generateMockResponse = async (userMessage: string): Promise<string> => {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "That's a great question! Let me help you with that.",
      "I understand what you're asking. Here's my perspective on this topic:",
      "Interesting point! Let me break this down for you:",
      "Thank you for asking! I'd be happy to explain:",
      "Great question! Here's what I can tell you about that:"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    return `${randomResponse}\n\nI'm a mock AI assistant, so this is just a placeholder response to demonstrate the UI. In a real implementation, this would be connected to an actual AI service.\n\nYour message was: "${userMessage}"`;
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) {
      handleNewChat();
      return;
    }

    const userMessage: ChatMessageType = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Add user message
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, userMessage],
              updatedAt: new Date()
            }
          : chat
      )
    );

    // Show typing indicator
    setIsTyping(true);

    try {
      // Generate mock AI response
      const aiResponse = await generateMockResponse(content);
      
      const assistantMessage: ChatMessageType = {
        id: uuidv4(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      // Add AI response
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChatId 
            ? { 
                ...chat, 
                messages: [...chat.messages, assistantMessage],
                updatedAt: new Date()
              }
            : chat
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setChats(prevChats => [newChat, ...prevChats]);
    setCurrentChatId(newChat.id);
    
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setCurrentChatId(remainingChats[0]?.id || '');
    }

    toast({
      title: "Chat deleted",
      description: "The chat has been successfully deleted.",
    });
  };

  const handleRegenerate = async () => {
    if (!currentChat || currentChat.messages.length === 0) return;

    const lastUserMessage = [...currentChat.messages]
      .reverse()
      .find(msg => msg.role === 'user');

    if (lastUserMessage) {
      // Remove the last assistant message if it exists
      const updatedMessages = currentChat.messages.filter(
        msg => !(msg.role === 'assistant' && msg.timestamp > lastUserMessage.timestamp)
      );

      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: updatedMessages }
            : chat
        )
      );

      // Regenerate response
      await handleSendMessage(lastUserMessage.content);
    }
  };

  const handleEditMessage = (content: string) => {
    // For demo purposes, just send as new message
    handleSendMessage(content);
  };

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
              {currentChat?.messages.length || 0} messages
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!currentChat || currentChat.messages.length === 0 ? (
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
              {currentChat.messages.map((message) => (
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
