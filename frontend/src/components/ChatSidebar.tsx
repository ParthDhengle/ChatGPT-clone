import React from "react";
import { Plus, MessageSquare, Menu, X, Trash2, LogOut } from "lucide-react";
import { Chat } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  collapsed,
  onToggleCollapse,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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

  const handleDelete = (chatId: string) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      onDeleteChat(chatId);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err: any) {
      console.error("Logout failed:", err.message);
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
          fixed md:relative z-50 h-screen bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out
          ${collapsed ? "w-0 md:w-12" : "w-80"}
          ${collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            {!collapsed && (
              <div className="flex items-center justify-between w-full">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Chats</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
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
                  className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
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
                    <div key={chat.id} className="group flex items-center">
                      <button
                        onClick={() => {
                          onChatSelect(chat.id);
                          if (window.innerWidth < 768) {
                            onToggleCollapse();
                          }
                        }}
                        className={`
                          flex-1 text-left p-3 rounded-lg transition-colors duration-200
                          ${activeChat === chat.id
                            ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                          }
                        `}
                      >
                        <div className="flex items-start space-x-3">
                          <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{chat.title}</p>
                            {chat.lastMessage && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {formatDate(chat.lastMessage)}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(chat.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
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
          className="fixed top-3 left-3 z-50 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 shadow-lg p-2 rounded-md"
          size="sm"
          variant="outline"
        >
          <Menu size={18} className="text-gray-900 dark:text-white" />
        </Button>
      )}
    </>
  );
};