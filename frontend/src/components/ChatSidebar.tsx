// src/components/ChatSidebar.tsx
import React from "react";
import { Plus, MessageSquare, Menu, X } from "lucide-react";
import { Chat } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  collapsed,
  onToggleCollapse,
}) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return "Today";
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative z-50 h-screen bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out
          ${collapsed ? "w-0 md:w-0" : "w-80"}
          ${collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-700">
            {!collapsed && <h2 className="text-lg font-semibold text-white">Chats</h2>}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="text-gray-400 hover:text-white"
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </Button>
          </div>

          {/* Content (hidden when collapsed) */}
          {!collapsed && (
            <>
              {/* New Chat Button */}
              <div className="p-4">
                <Button
                  onClick={onNewChat}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                  variant="outline"
                >
                  <Plus size={16} className="mr-2" />
                  New Chat
                </Button>
              </div>

              {/* Chat List */}
              <ScrollArea className="flex-1 px-2">
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => {
                        onChatSelect(chat.id);
                        if (window.innerWidth < 768) {
                          onToggleCollapse();
                        }
                      }}
                      className={`
                        w-full text-left p-3 rounded-lg transition-colors duration-200 group
                        ${activeChat === chat.id
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        }
                      `}
                    >
                      <div className="flex items-start space-x-3">
                        <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{chat.title}</p>
                          {chat.lastMessage && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(chat.lastMessage)}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>

      {/* Toggle button for collapsed state */}
      {collapsed && (
        <Button
          onClick={onToggleCollapse}
          className="fixed top-4 left-4 z-50 bg-gray-800 hover:bg-gray-700 border border-gray-600 shadow-lg"
          size="sm"
          variant="outline"
        >
          <Menu size={18} className="text-white" />
        </Button>
      )}
    </>
  );
};