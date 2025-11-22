import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex gap-4 p-6 ${
        isUser
          ? 'bg-gradient-to-r from-indigo-50 to-purple-50'
          : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
      } border-b border-indigo-100 transition-all`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
            : 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white'
        }`}
      >
        {isUser ? <User size={20} /> : <Bot size={20} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className={`font-bold text-sm ${
            isUser
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600'
              : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600'
          }`}>
            {isUser ? 'You' : 'StoryStock AI'}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>

        <div className="prose prose-sm max-w-none">
          {isUser ? (
            <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom renderers for better styling
                h1: ({ node, ...props }) => (
                  <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-lg font-bold mt-3 mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-base font-semibold mt-2 mb-1" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-800 mb-2 leading-relaxed" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="text-gray-800 ml-2" {...props} />
                ),
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code
                      className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600"
                      {...props}
                    />
                  ) : (
                    <code
                      className="block bg-gray-100 p-3 rounded-lg text-sm font-mono overflow-x-auto"
                      {...props}
                    />
                  ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-2" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-primary pl-4 italic text-gray-700 my-2"
                    {...props}
                  />
                ),
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto mb-2">
                    <table className="min-w-full divide-y divide-gray-300" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th
                    className="px-3 py-2 text-left text-xs font-medium text-gray-900 uppercase tracking-wider bg-gray-50"
                    {...props}
                  />
                ),
                td: ({ node, ...props }) => (
                  <td className="px-3 py-2 text-sm text-gray-800" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {message.isStreaming && (
          <div className="flex items-center gap-1.5 mt-3 px-3 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg inline-flex">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"
              style={{ animationDelay: '0.4s' }}
            ></div>
            <span className="text-xs font-medium text-blue-700 ml-1">Generating response...</span>
          </div>
        )}
      </div>
    </div>
  );
};
