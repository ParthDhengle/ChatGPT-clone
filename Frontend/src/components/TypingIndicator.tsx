
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-chat-green rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-chat-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-chat-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="text-chat-text-muted text-sm">AI is thinking...</span>
    </div>
  );
};

export default TypingIndicator;
