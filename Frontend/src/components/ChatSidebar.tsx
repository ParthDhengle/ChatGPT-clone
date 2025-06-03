
import React, { useState } from 'react';
import { Plus, MessageCircle, Trash2, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Chat } from '../types/chat';
import { toast } from '@/hooks/use-toast';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId?: string;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  isMobile = false,
  isOpen = true,
  onToggle
}) => {
  const { currentUser, logout } = useAuth();
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingChatId(chatId);
    onDeleteChat(chatId);
    setTimeout(() => setDeletingChatId(null), 300);
  };

  if (isMobile && !isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 bg-chat-surface border border-chat-green/20 rounded-lg text-chat-text hover:bg-chat-green/10 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed left-0 top-0 z-50' : 'relative'} 
        w-80 h-full bg-chat-surface border-r border-chat-green/20 flex flex-col
        ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="p-4 border-b border-chat-green/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-chat-text">Chats</h2>
            {isMobile && (
              <button
                onClick={onToggle}
                className="p-2 hover:bg-chat-green/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-chat-text" />
              </button>
            )}
          </div>
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 bg-chat-green hover:bg-chat-green-hover text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.length === 0 ? (
            <div className="text-center text-chat-text-muted py-8">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No chats yet</p>
              <p className="text-sm">Start a new conversation</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`
                  group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${currentChatId === chat.id ? 'bg-chat-green/20 border border-chat-green/40' : 'hover:bg-chat-bg'}
                  ${deletingChatId === chat.id ? 'opacity-50 scale-95' : ''}
                `}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-chat-text font-medium truncate">{chat.title}</h3>
                  <p className="text-chat-text-muted text-sm">
                    {chat.messages.length} messages
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-chat-green/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-chat-green rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-chat-text font-medium truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
