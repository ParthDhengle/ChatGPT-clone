
import React from 'react';
import { Chat } from '@/pages/Index';
import { MessageBubble } from '@/components/MessageBubble';
import { ChatInput } from '@/components/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatAreaProps {
  chat?: Chat;
  onSendMessage: (message: string) => void;
  sidebarCollapsed: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ 
  chat, 
  onSendMessage,
  sidebarCollapsed 
}) => {
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <h2 className="text-2xl font-semibold mb-2">Welcome to ChatGPT</h2>
          <p>Select a chat from the sidebar or start a new conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 min-h-screen">
      {/* Chat Header */}
      <div className="border-b border-gray-700 p-4 bg-gray-800">
        <h1 className="text-xl font-semibold text-white truncate pl-14 pr-4">
          {chat.title}
        </h1>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {chat.messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
              <p>Send a message to begin chatting</p>
            </div>
          ) : (
            chat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4 bg-gray-800">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={onSendMessage}chatId={chat.id} />
        </div>
      </div>
    </div>
  );
};
