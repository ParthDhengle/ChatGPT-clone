// src/components/ChatInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void> | void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Send a message..." 
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !sending) {
      try {
        setSending(true);
        setError(null);
        
        await onSendMessage(message.trim());
        setMessage('');
      } catch (error: any) {
        setError(error.message || 'Failed to send message');
      } finally {
        setSending(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Clear error when user starts typing
  useEffect(() => {
    if (message && error) {
      setError(null);
    }
  }, [message, error]);

  const isDisabled = disabled || sending || !message.trim();

  return (
    <div className="border-t border-chat-green/20 p-4">
      {error && (
        <div className="max-w-4xl mx-auto mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3 bg-chat-surface rounded-lg border border-chat-green/20 focus-within:border-chat-green transition-colors">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || sending}
            className="flex-1 resize-none bg-transparent border-none outline-none text-chat-text placeholder-chat-text-muted p-4 min-h-[56px] max-h-[200px] disabled:opacity-50"
            rows={1}
          />
          <button
            type="submit"
            disabled={isDisabled}
            className="m-2 p-2 bg-chat-green hover:bg-chat-green-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors relative"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        <div className="text-xs text-chat-text-muted text-center mt-2">
          Press Enter to send, Shift + Enter for new line
          {sending && " • Sending message..."}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;