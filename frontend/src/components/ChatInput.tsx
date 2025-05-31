
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  chatId?: string
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  return (
    <div className="relative">
      <div className="flex items-end space-x-2 bg-gray-700 rounded-lg p-3">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Send a message..."
          className="flex-1 min-h-[20px] max-h-[120px] resize-none bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
          rows={1}
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed p-2"
        >
          <Send size={16} />
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send, Shift + Enter for new line
      </p>
    </div>
  );
};
