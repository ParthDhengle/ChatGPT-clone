import React, { useEffect, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import { Chat } from "@/pages/Index";
import { MessageBubble } from "@/components/MessageBubble";
import { ChatInput } from "@/components/ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface ChatAreaProps {
  chat?: Chat;
  onSendMessage: (message: string) => void;
  sidebarCollapsed: boolean;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  chat,
  onSendMessage,
  sidebarCollapsed,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 relative">
        {/* Theme Toggle Button */}
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun size={18} className="text-gray-700 dark:text-gray-300" />
          )}
        </Button>
        
        <div className="text-center text-gray-500 dark:text-gray-400">
          <h2 className="text-2xl font-semibold mb-2">Welcome to ChatGPT</h2>
          <p>Start a new conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 h-screen transition-colors duration-200">
      {/* Chat Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
          {chat.title}
        </h1>
        
        {/* Theme Toggle Button */}
        <Button
          onClick={toggleTheme}
          variant="outline"
          size="sm"
          className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Sun size={18} className="text-gray-700 dark:text-gray-300" />
          )}
        </Button>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {chat.messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
              <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
              <p>Send a message to begin chatting</p>
            </div>
          ) : (
            <>
              {chat.messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border- border--200 dark:border--700 p-4 bg--50 dark:bg--800 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={onSendMessage} chatId={chat.id} />
        </div>
      </div>
    </div>
  );
};