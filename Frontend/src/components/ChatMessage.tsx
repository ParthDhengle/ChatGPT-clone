
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, RotateCcw, Edit3, Check } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types/chat';
import { toast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message: ChatMessageType;
  onRegenerate?: () => void;
  onEdit?: (content: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRegenerate, onEdit }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied to clipboard",
      description: "Message content copied successfully.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div className={`message-bubble ${isUser ? 'user-message' : 'assistant-message'} group`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
          isUser ? 'bg-chat-green' : 'bg-purple-600'
        }`}>
          {isUser ? 'U' : 'AI'}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !className || !match;
                  
                  return !isInline ? (
                    <div className="relative">
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                      <button
                        onClick={() => copyToClipboard(String(children))}
                        className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : (
                    <code className={`${className} bg-gray-700 px-1 py-0.5 rounded text-sm`} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => copyToClipboard(message.content)}
              className="p-1 hover:bg-gray-600 rounded transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            
            {!isUser && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                title="Regenerate response"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            
            {isUser && onEdit && (
              <button
                onClick={() => onEdit(message.content)}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
                title="Edit message"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
