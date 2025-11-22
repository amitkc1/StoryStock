import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about stocks... (e.g., 'Analyze Apple's financial health')"
            disabled={disabled}
            rows={3}
            className="w-full px-5 py-3 border-2 border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm transition-all"
          />
          <div className="mt-2 text-xs text-indigo-600 font-medium flex items-center gap-1">
            <span>💡</span>
            <span>Press Enter to send, Shift+Enter for new line</span>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 h-[60px] flex items-center gap-2 font-semibold"
        >
          <Send size={20} />
          Send
        </button>
      </div>
    </div>
  );
};
