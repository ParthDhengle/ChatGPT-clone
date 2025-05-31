
import React, { useState } from 'react';
import { ChatSidebar } from '@/components/ChatSidebar';
import { ChatArea } from '@/components/ChatArea';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
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
      id: '1',
      title: 'New Chat',
      messages: [],
      lastMessage: new Date()
    },
    {
      id: '2', 
      title: 'Chat with GPT-4',
      messages: [
        {
          id: '1',
          content: 'Hello! How can I help you today?',
          sender: 'assistant',
          timestamp: new Date(Date.now() - 300000)
        },
        {
          id: '2',
          content: 'Can you explain quantum computing?',
          sender: 'user',
          timestamp: new Date(Date.now() - 240000)
        },
        {
          id: '3',
          content: 'Quantum computing is a revolutionary approach to computation that harnesses the principles of quantum mechanics to process information in fundamentally different ways than classical computers.',
          sender: 'assistant',
          timestamp: new Date(Date.now() - 180000)
        }
      ],
      lastMessage: new Date(Date.now() - 180000)
    },
    {
      id: '3',
      title: 'React Development Tips',
      messages: [
        {
          id: '1',
          content: 'What are some best practices for React development?',
          sender: 'user',
          timestamp: new Date(Date.now() - 86400000)
        },
        {
          id: '2',
          content: 'Here are some key React best practices:\n\n1. Use functional components with hooks\n2. Keep components small and focused\n3. Use proper state management\n4. Implement error boundaries\n5. Optimize with React.memo when needed',
          sender: 'assistant',
          timestamp: new Date(Date.now() - 86340000)
        }
      ],
      lastMessage: new Date(Date.now() - 86340000)
    }
  ]);

  const [activeChat, setActiveChat] = useState<string>('2');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      lastMessage: new Date()
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const sendMessage = (content: string) => {
    if (!activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      sender: 'assistant',
      timestamp: new Date(),
      isStreaming: true
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChat) {
        const updatedChat = {
          ...chat,
          messages: [...chat.messages, userMessage, assistantMessage],
          lastMessage: new Date()
        };
        
        // Update title if it's a new chat
        if (chat.title === 'New Chat' && chat.messages.length === 0) {
          updatedChat.title = content.slice(0, 30) + (content.length > 30 ? '...' : '');
        }
        
        return updatedChat;
      }
      return chat;
    }));

    // Simulate AI response streaming
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you with that! Let me think about this for a moment...",
        "That's an interesting question. Here's what I can tell you about that topic...",
        "Great question! Let me break this down for you step by step...",
        "I understand what you're asking. Here's my perspective on this...",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: chat.messages.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: randomResponse, isStreaming: false }
                : msg
            )
          };
        }
        return chat;
      }));
    }, 2000);
  };

  const currentChat = chats.find(chat => chat.id === activeChat);

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
        onSendMessage={sendMessage}
        sidebarCollapsed={sidebarCollapsed}
      />
    </div>
  );
};

export default Index;
