import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:4000';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (message: string, conversationId?: string) => void;
}

export const useSocket = (
  onMessage: (text: string) => void,
  onThinking: (tool: string) => void,
  onDataFetched: (tool: string, data: any) => void,
  onComplete: (conversationId: string) => void,
  onError: (error: string) => void
): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const messageBuffer = useRef('');

  useEffect(() => {
    console.log('Initializing socket connection to:', SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'],
      autoConnect: true,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server successfully!');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('ai-response-chunk', (data: { text: string }) => {
      messageBuffer.current += data.text;
      onMessage(data.text);
    });

    newSocket.on('thinking', (data: { tool: string }) => {
      onThinking(data.tool);
    });

    newSocket.on('tool-start', (data: { tool: string }) => {
      onThinking(data.tool);
    });

    newSocket.on('data-fetched', (data: { tool: string; data: any }) => {
      onDataFetched(data.tool, data.data);
    });

    newSocket.on('response-complete', (data: { conversationId: string }) => {
      messageBuffer.current = '';
      onComplete(data.conversationId);
    });

    newSocket.on('error', (data: { message: string }) => {
      onError(data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [onMessage, onThinking, onDataFetched, onComplete, onError]);

  const sendMessage = useCallback(
    (message: string, conversationId?: string) => {
      if (socket && isConnected) {
        socket.emit('user-message', { message, conversationId });
      }
    },
    [socket, isConnected]
  );

  return { socket, isConnected, sendMessage };
};
