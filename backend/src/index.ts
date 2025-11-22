import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { ClaudeService } from './services/claude.js';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Claude service
const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY || '');

// In-memory storage for conversations (replace with DB in production)
const conversations = new Map<string, any>();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ready', (req, res) => {
  res.json({ ready: true });
});

// REST API routes
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, conversationId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const convId = conversationId || uuidv4();
    const conversation = conversations.get(convId) || {
      id: convId,
      messages: [],
      context: { discussedStocks: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
    });

    let fullResponse = '';

    // Stream response
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    for await (const chunk of claudeService.streamChat(message, conversation.messages)) {
      if (chunk.type === 'text') {
        fullResponse += chunk.content;
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      } else if (chunk.type === 'thinking' || chunk.type === 'tool_start') {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      } else if (chunk.type === 'data_fetched') {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      } else if (chunk.type === 'done') {
        // Save assistant response
        conversation.messages.push({
          role: 'assistant',
          content: fullResponse,
        });
        conversation.updatedAt = new Date();
        conversations.set(convId, conversation);

        res.write(`data: ${JSON.stringify({ type: 'done', conversationId: convId })}\n\n`);
        res.end();
      }
    }
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    res.end();
  }
});

// Get conversation history
app.get('/api/chat/history/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const conversation = conversations.get(conversationId);

  if (!conversation) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  res.json(conversation);
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('user-message', async (data) => {
    const { message, conversationId } = data;

    try {
      const convId = conversationId || uuidv4();
      const conversation = conversations.get(convId) || {
        id: convId,
        messages: [],
        context: { discussedStocks: [] },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add user message
      conversation.messages.push({
        role: 'user',
        content: message,
      });

      let fullResponse = '';

      // Stream response back to client
      for await (const chunk of claudeService.streamChat(message, conversation.messages)) {
        if (chunk.type === 'text') {
          fullResponse += chunk.content;
          socket.emit('ai-response-chunk', { text: chunk.content });
        } else if (chunk.type === 'thinking') {
          socket.emit('thinking', { tool: chunk.tool });
        } else if (chunk.type === 'tool_start') {
          socket.emit('tool-start', { tool: chunk.tool });
        } else if (chunk.type === 'data_fetched') {
          socket.emit('data-fetched', {
            tool: chunk.tool,
            data: chunk.data,
          });
        } else if (chunk.type === 'done') {
          // Save assistant response
          conversation.messages.push({
            role: 'assistant',
            content: fullResponse,
          });
          conversation.updatedAt = new Date();
          conversations.set(convId, conversation);

          socket.emit('response-complete', { conversationId: convId });
        }
      }
    } catch (error: any) {
      console.error('Error in WebSocket handler:', error);
      socket.emit('error', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 WebSocket ready for connections`);
  console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    console.log('HTTP server closed');
  });
});
