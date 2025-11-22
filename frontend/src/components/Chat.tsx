import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { QuickActions } from './QuickActions';
import { InsightsPanel } from './InsightsPanel';
import { useSocket } from '../hooks/useSocket';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentThinkingTool, setCurrentThinkingTool] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessageRef = useRef<Message | null>(null);

  // Insights panel state
  const [stockData, setStockData] = useState<{
    symbol?: string;
    name?: string;
    price?: number;
    change?: number;
    changePercent?: number;
    investmentScore?: number;
  }>({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleMessage = useCallback((text: string) => {
    if (!currentMessageRef.current) {
      // Create new assistant message
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: text,
        timestamp: new Date(),
        isStreaming: true,
      };
      currentMessageRef.current = newMessage;
      setMessages((prev) => [...prev, newMessage]);
    } else {
      // Append to existing message
      currentMessageRef.current.content += text;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentMessageRef.current?.id
            ? { ...msg, content: currentMessageRef.current.content }
            : msg
        )
      );
    }
  }, []);

  const handleThinking = useCallback((tool: string) => {
    setCurrentThinkingTool(tool);
  }, []);

  const handleDataFetched = useCallback((tool: string, data: any) => {
    console.log(`Data fetched from ${tool}:`, data);
    setCurrentThinkingTool(null);

    // Extract stock data for insights panel
    if (tool === 'get_stock_info' && data) {
      setStockData(prev => ({
        ...prev,
        symbol: data.symbol,
        name: data.name,
        price: data.price,
        change: data.change,
        changePercent: data.changePercent,
      }));
    }

    if (tool === 'calculate_investment_score' && data) {
      setStockData(prev => ({
        ...prev,
        investmentScore: data.total,
      }));
    }
  }, []);

  const handleComplete = useCallback((convId: string) => {
    setConversationId(convId);
    setIsStreaming(false);
    setCurrentThinkingTool(null);

    if (currentMessageRef.current) {
      // Mark message as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === currentMessageRef.current?.id ? { ...msg, isStreaming: false } : msg
        )
      );
      currentMessageRef.current = null;
    }
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Chat error:', error);
    setIsStreaming(false);
    setCurrentThinkingTool(null);
    currentMessageRef.current = null;

    // Add error message
    const errorMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `⚠️ Error: ${error}. Please try again.`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, errorMessage]);
  }, []);

  const { isConnected, sendMessage } = useSocket(
    handleMessage,
    handleThinking,
    handleDataFetched,
    handleComplete,
    handleError
  );

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send to server
    setIsStreaming(true);
    currentMessageRef.current = null;
    sendMessage(message, conversationId);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            📈 StoryStock
          </h1>
          <p className="text-sm text-indigo-100 mt-1">Every number tells a story, every metric drives a decision</p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
          {isConnected ? (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <Wifi size={18} className="text-white" />
              <span className="text-sm font-medium text-white">Connected</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <WifiOff size={18} className="text-white" />
              <span className="text-sm font-medium text-white">Disconnected</span>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        {/* Chat panel */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col h-full">
                {/* Welcome Section */}
                <div className="flex-1 flex items-center justify-center px-8 py-12">
                  <div className="text-center max-w-2xl">
                    {/* Animated Icon */}
                    <div className="mb-8 relative">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="absolute bottom-4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      <div className="absolute top-8 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                    </div>

                    {/* Title */}
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 animate-fade-in">
                      Welcome to StoryStock!
                    </h2>

                    {/* Subtitle */}
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                      Your AI-powered stock analysis companion. Get <span className="font-bold text-indigo-600">deep insights</span>, understand the <span className="font-bold text-purple-600">WHY</span> behind every metric, and make <span className="font-bold text-pink-600">informed decisions</span>.
                    </p>

                    {/* Feature badges */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-indigo-50 px-4 py-2 rounded-full border border-indigo-200">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold text-indigo-700">Real-time Data</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-50 px-4 py-2 rounded-full border border-purple-200">
                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-semibold text-purple-700">AI-Powered</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-pink-50 px-4 py-2 rounded-full border border-pink-200">
                        <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold text-pink-700">Verified Sources</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-3 rounded-full border-2 border-indigo-200 shadow-md">
                      <span className="text-2xl animate-bounce">👇</span>
                      <p className="text-sm font-bold text-gray-700">Choose a quick action below or type your question!</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions at bottom */}
                <div className="border-t border-gray-200">
                  <QuickActions onSelectAction={handleSendMessage} disabled={isStreaming || !isConnected} />
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Thinking indicator */}
          {currentThinkingTool && (
            <div className="px-6 py-4 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 border-t border-indigo-200 flex items-center gap-3 shadow-inner">
              <div className="relative">
                <Loader2 size={20} className="animate-spin text-indigo-600" />
                <div className="absolute inset-0 animate-ping">
                  <Loader2 size={20} className="text-indigo-400 opacity-50" />
                </div>
              </div>
              <span className="text-sm font-medium text-indigo-700">
                🔍 Fetching data using <code className="px-2 py-1 bg-white rounded font-semibold text-indigo-600 shadow-sm">{currentThinkingTool}</code>
              </span>
            </div>
          )}

          {/* Input */}
          <ChatInput onSendMessage={handleSendMessage} disabled={isStreaming || !isConnected} />
        </div>

        {/* Right panel - Dynamic Insights */}
        <InsightsPanel
          stockSymbol={stockData.symbol}
          stockName={stockData.name}
          price={stockData.price}
          change={stockData.change}
          changePercent={stockData.changePercent}
          investmentScore={stockData.investmentScore}
          isLoading={isStreaming && currentThinkingTool !== null}
        />
      </div>
    </div>
  );
};
