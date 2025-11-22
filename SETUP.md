# StoryStock - Quick Setup Guide

**Tagline:** "Every number tells a story, and every metric drives a decision."

A conversational AI-powered stock analysis platform that explains the **WHY** behind every financial metric.

---

## Prerequisites

Before you begin, make sure you have:

- **Node.js 20+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

---

## Quick Start (5 minutes)

### 1. Clone or Navigate to the Project

```bash
cd /Users/amitkc/workspace/StoryStock
```

### 2. Set Up Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your API key
# Open .env in your favorite editor and set:
# ANTHROPIC_API_KEY=sk-ant-your-key-here
```

**Edit `backend/.env`:**
```bash
PORT=4000
NODE_ENV=development
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here  # <-- CHANGE THIS
CORS_ORIGIN=http://localhost:3000
```

### 3. Set Up Frontend

```bash
# Navigate to frontend (from project root)
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Frontend `.env` should already be configured correctly:
```bash
VITE_API_URL=http://localhost:4000
VITE_WS_URL=http://localhost:4000
```

### 4. Start the Application

**Open two terminal windows:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 4000
📊 Health check: http://localhost:4000/health
💬 WebSocket ready for connections
🎯 Environment: development
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.4.21  ready in 323 ms
➜  Local:   http://localhost:3000/
```

### 5. Open the App

Open your browser and go to: **http://localhost:3000**

You should see:
- ✅ "Connected" in green at the top right
- Quick action buttons
- Chat interface ready to use

---

## Try It Out!

Ask questions like:

1. **"Analyze Apple's financial health"**
   - Gets comprehensive investment score with detailed breakdown
   - Explains every metric with context and comparisons

2. **"Compare Apple and Microsoft"**
   - Side-by-side analysis
   - Bull/bear cases for each

3. **"Why is Tesla's P/E ratio so high?"**
   - Deep dive into valuation
   - Historical context and sector comparison

4. **"Show me insider trading for NVIDIA"**
   - Recent transactions
   - Investment implications

---

## Project Structure

```
StoryStock/
├── backend/                    # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── services/
│   │   │   ├── yahooFinance.ts    # Stock data fetching
│   │   │   ├── investmentScore.ts  # Scoring algorithm
│   │   │   └── claude.ts           # AI integration
│   │   ├── types/              # TypeScript types
│   │   └── index.ts            # Server entry point
│   ├── package.json
│   └── .env                    # YOUR API KEY GOES HERE
│
├── frontend/                   # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── hooks/              # Custom hooks
│   │   └── types/              # TypeScript types
│   ├── package.json
│   └── .env                    # API endpoints
│
├── SETUP.md                    # This file
└── README.md                   # Full documentation
```

---

## Troubleshooting

### "Disconnected" showing in top right

**Check:**
1. Is the backend running on port 4000?
2. Did you set `ANTHROPIC_API_KEY` in `backend/.env`?
3. Refresh the browser page

**Fix:**
```bash
# In backend terminal, check for errors
# Make sure you see "Server running on port 4000"
```

### Backend won't start

**Error:** `Cannot find module 'yahoo-finance2'`

**Fix:**
```bash
cd backend
npm install
```

### Frontend won't start

**Fix:**
```bash
cd frontend
npm install
```

### Stock data not loading

**Possible causes:**
- Yahoo Finance API rate limiting (wait a few seconds)
- Invalid stock symbol (use valid tickers like AAPL, MSFT, TSLA)

---

## Environment Variables

### Backend `.env`

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Backend server port | 4000 | No |
| `ANTHROPIC_API_KEY` | Your Claude API key | - | **YES** |
| `FMP_API_KEY` | Financial Modeling Prep API key | demo | No (demo key works) |
| `CORS_ORIGIN` | Frontend URL | http://localhost:3000 | No |
| `NODE_ENV` | Environment | development | No |

### Frontend `.env`

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | http://localhost:4000 | No |
| `VITE_WS_URL` | WebSocket URL | http://localhost:4000 | No |

---

## Docker Setup (Alternative)

If you prefer Docker:

```bash
# Make sure you have your ANTHROPIC_API_KEY in backend/.env
export ANTHROPIC_API_KEY=sk-ant-your-key-here

# Start everything
docker-compose up
```

Access at: http://localhost:3000

---

## Getting Your API Keys

### Anthropic API Key (Required)

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-`)
6. Paste it in `backend/.env`

**Free tier includes:**
- $5 credit for new accounts
- Enough for ~100-200 stock analyses

### Financial Modeling Prep API Key (Optional)

The app uses a "demo" API key by default which works for testing. For production use:

1. Go to https://site.financialmodelingprep.com/developer/docs/
2. Sign up for free account
3. Get your API key from dashboard
4. Add to `backend/.env` as `FMP_API_KEY=your-key-here`

**Free tier includes:**
- 250 requests/day
- Comprehensive financial data (balance sheets, cash flow, ratios)
- Historical data and analyst estimates

**What FMP provides that Yahoo Finance doesn't:**
- ✅ Profit margins (net, operating)
- ✅ Financial health ratios (current ratio, debt-to-equity)
- ✅ Cash flow statements (FCF, operating cash flow)
- ✅ Growth metrics (revenue growth, earnings growth)
- ✅ Complete balance sheet data
- ✅ Income statement details

---

## Key Features

✅ **Deep "Why" Explanations** - Every metric explained with reasoning
✅ **Investment Scoring** - 0-100 score with transparent breakdown
✅ **Real-time Streaming** - Instant AI responses
✅ **Tool Calling** - Automatic stock data fetching
✅ **Context Awareness** - Follow-up questions work
✅ **Source Attribution** - All data cited

---

## Tech Stack

**Backend:**
- Node.js + Express + TypeScript
- Claude API (Anthropic)
- Yahoo Finance API
- Socket.IO (WebSocket)

**Frontend:**
- React 18 + TypeScript
- Vite (dev server)
- Tailwind CSS
- Socket.IO Client

---

## What's Next?

After setup, check out:
- **README.md** - Full documentation
- **claude.md** - Detailed project specification

**Planned features:**
- FinGPT sentiment analysis
- Dynamic charts and visualizations
- Portfolio analysis
- User authentication
- Conversation history

---

## Support

**Issues?**
- Check the Troubleshooting section above
- Review terminal output for error messages
- Make sure all dependencies are installed
- Verify your Anthropic API key is valid

**Need help?**
Open an issue or check the main README.md

---

**Now go analyze some stocks! 🚀📊**
