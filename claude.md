# Interactive Stock Analysis App - Claude Code Prompt (UPDATED)

## Project Vision
Build a **conversational AI-powered stock analysis platform** where users can ask natural language questions about stocks, ETFs, and markets, and receive intelligent, contextualized insights with dynamic visualizations.

**Tagline:** "Every number should tell a story, and every metric should drive a decision."

**Key Differentiator:** Unlike Robinhood or Yahoo Finance, we don't just show numbers - we explain the **WHY** behind every metric with full transparency on data sources, calculations, and implications.

---

## Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** + shadcn/ui components
- **Recharts** for dynamic chart generation
- **WebSocket client** for real-time streaming
- Split-pane UI: Chat interface (left) + Dynamic content area (right)

### Backend
- **Node.js + Express** (or **Python + FastAPI** - recommended for FinGPT)
- **Claude API** (Anthropic) for conversational intelligence
- **Yahoo Finance MCP Server** integration (use maxscheijen/mcp-yahoo-finance)
- **FinGPT** (HuggingFace) for sentiment analysis and market insights
- **PostgreSQL** for conversation history & user data
- **Redis** for session management & caching
- **WebSocket (Socket.io)** for real-time chat

### ML/Analytics Layer
- **FinGPT** via HuggingFace Inference API for:
  - News sentiment analysis
  - Market mood detection
  - Financial entity extraction
- **Custom LSTM model** (optional) for price predictions
- Deploy on HuggingFace Spaces (free tier)

### Infrastructure
- Docker containers for each service
- Ready for AWS EKS deployment
- CI/CD pipeline configuration

---

## Core Features

### 1. CONVERSATIONAL CHAT INTERFACE

**User Experience:**
- Clean chat UI similar to ChatGPT
- Message input with autocomplete for stock symbols
- Streaming responses (typewriter effect)
- Message history with timestamps
- Ability to reference previous questions

**Example Interactions:**
```
User: "Analyze Apple's financial health"
AI: [Fetches AAPL data via MCP + FinGPT sentiment] → Generates analysis with metrics + charts

User: "How does it compare to Microsoft?"
AI: [Maintains context, fetches MSFT] → Side-by-side comparison

User: "Which one is better for long-term investment?"
AI: [Synthesizes data] → Provides reasoned recommendation with caveats
```

### 2. DYNAMIC VISUALIZATION GENERATOR

Based on user queries, automatically generate relevant charts:
- "Show me a chart of Tesla's revenue over 5 years" → Line chart
- "Compare P/E ratios of tech giants" → Bar chart
- "What's the correlation between these 3 stocks?" → Scatter plot
- "Show sector allocation of my watchlist" → Pie chart

**Implementation:**
- Parse user intent from question
- Fetch appropriate data via MCP
- Generate chart configuration
- Render in right pane

### 3. DEEP "WHY" EXPLANATIONS - THE CORE DIFFERENTIATOR 🎯

**Critical Philosophy: Every number must explain itself**

This is what sets your app apart from Robinhood, Yahoo Finance, and all competitors. When you show a score or metric, ALWAYS explain:
1. **What** the number is
2. **Why** it has this value (the calculation/reasoning)
3. **What** it means for investment decisions
4. **How** it compares to alternatives
5. **Who says so** (data source, analyst consensus, or model prediction)

**Examples of Deep Why:**

#### Example 1: Investment Score

❌ **BAD** (What Robinhood shows):
```
Investment Score: 68/100 (HOLD)
P/E Ratio: 28.5
```

✅ **GOOD** (What YOUR app shows):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 INVESTMENT SCORE: 68/100 (HOLD)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 HOW WE CALCULATED THIS:

┌─ FINANCIAL HEALTH: 24/30 points ─────────────────┐
│                                                   │
│ ✅ Current Ratio: 2.1                            │
│    Why this matters: Company can cover 2x its    │
│    short-term obligations. Healthy liquidity.    │
│    Benchmark: Sector avg is 1.5                  │
│                                                   │
│ ✅ Debt-to-Equity: 0.8                          │
│    Why this matters: Moderate debt load, below   │
│    sector average of 1.2. Room to borrow if      │
│    needed for expansion.                         │
│                                                   │
│ ⚠️  Interest Coverage: 5.0x (DOWN from 8.0x)    │
│    Why this matters: Can still cover interest    │
│    payments, but declining coverage means rising │
│    financial stress. Lost 6 points here.         │
│    Alert: If drops below 3x, consider risky      │
└───────────────────────────────────────────────────┘

┌─ VALUATION: 15/25 points ────────────────────────┐
│                                                   │
│ ⚠️  P/E Ratio: 28.5 (40% ABOVE historical avg)  │
│    Why this matters: You're paying $28.50 for    │
│    every $1 of annual earnings.                  │
│                                                   │
│    📊 Context:                                   │
│    • 5-year average P/E: 20.3                    │
│    • Sector average: 22.1                        │
│    • Tech giants: AAPL 26.8, GOOGL 24.2         │
│                                                   │
│    🤔 Why so high?                               │
│    1. Market expects 22% EPS growth (vs 12%)     │
│    2. New AI chip line launching Q2              │
│    3. Strong customer retention (85%)            │
│                                                   │
│    ⚠️  Risk: If growth slows to 15%, fair P/E   │
│    would be ~22 → 23% downside potential         │
│                                                   │
│ ✅ PEG Ratio: 1.3                                │
│    Why this matters: P/E divided by growth rate. │
│    Under 1.5 suggests growth justifies premium.  │
│    Lost only 10 points instead of 15.            │
└───────────────────────────────────────────────────┘

┌─ GROWTH MOMENTUM: 19/25 points ──────────────────┐
│                                                   │
│ ✅ Revenue Growth: +18% YoY                      │
│    Why this matters: Accelerating from +12%      │
│    last year. Strongest growth in 7 quarters.    │
│    Source: Q3 2024 earnings (Yahoo Finance)      │
│                                                   │
│ ✅ EPS Growth: +22% YoY                          │
│    Why this matters: Earnings growing faster     │
│    than revenue = improving efficiency.          │
│    Beat analyst estimates by 8%.                 │
│                                                   │
│ ⚠️  Profit Margin: 32% (DOWN from 35%)          │
│    Why this matters: Margin compression due to   │
│    expansion costs. CFO cited "investment phase."│
│    Lost 6 points. Monitor if continues Q4.       │
└───────────────────────────────────────────────────┘

┌─ MARKET SENTIMENT: 10/20 points ─────────────────┐
│                                                   │
│ 📰 News Sentiment: +0.42 (Moderately Positive)  │
│    Source: FinGPT analysis of 127 articles       │
│    Sample headlines:                             │
│    • "XYZ Corp signs $2B cloud deal" - Reuters   │
│    • "Strong demand continues" - Bloomberg       │
│                                                   │
│ 🤝 Analyst Consensus: 7 of 12 rate "Buy" (58%)  │
│    Source: Yahoo Finance analyst ratings         │
│    Why caution: Average price target is $245     │
│    (only 5% above current $233)                  │
│    Suggests limited near-term upside priced in   │
│                                                   │
│ 🚨 Insider Trading: -$12M (net selling)         │
│    Source: SEC filings via Yahoo Finance         │
│    Why concerning: 3 executives sold in 90 days, │
│    0 bought. Typically bearish signal.           │
│    Lost 10 points here.                          │
└───────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 BOTTOM LINE: 

Strong fundamentals (24/30) and accelerating growth (19/25) 
are offset by stretched valuation (15/25) and insider selling 
concerns (10/20).

📈 BULL CASE (How to get to 78/100):
• If P/E normalizes to sector avg (22), score → 78/100
• If insiders stop selling, sentiment → 16/20

📉 BEAR CASE (How score drops to 58/100):
• If growth slows to 12%, growth → 14/25
• If debt increases further, health → 18/30

🎯 VERDICT: HOLD. Good company, but wait for better entry 
point. Consider buying if price drops to $210 (P/E ~23).
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Example 2: Single Metric Deep Dive

❌ **BAD**:
```
Free Cash Flow: $18.2B
```

✅ **GOOD**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 FREE CASH FLOW: $18.2B
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 WHAT IS THIS?
Cash left over after paying all operating expenses and 
capital expenditures. This is "real" money the company 
can use for dividends, buybacks, or acquisitions.

🧮 HOW IT'S CALCULATED:
Operating Cash Flow:     $24.8B
Less: CapEx:             -$6.6B
─────────────────────────────
Free Cash Flow:          $18.2B

📈 HISTORICAL TREND:
2021: $12.3B │████████░░░░░░░░░░
2022: $14.8B │███████████░░░░░░░
2023: $16.5B │█████████████░░░░░
2024: $18.2B │███████████████░░░ ⬆️ +10% YoY

🎯 WHY THIS MATTERS:

✅ POSITIVE SIGNS:
• Growing every year (4-year CAGR: 14%)
• FCF margin: 24% (Industry avg: 18%)
• Enough to cover dividend ($8B) 2.3x over
• $10B left for growth investments

📊 PEER COMPARISON:
• AAPL: $22.8B (but 3x larger revenue)
• MSFT: $21.5B (similar size, edge to MSFT)
• GOOGL: $19.2B (you're competitive here)
• FCF per share: $4.25 vs sector avg $3.10 ✅

💡 WHAT ANALYSTS SAY:
Source: Yahoo Finance analyst notes
"Strong FCF generation supports continued share 
buybacks. Management guided to $20B FCF in 2025." 
- Goldman Sachs, Dec 2024

⚠️  WATCH OUT FOR:
• CapEx expected to rise 20% next year (new fabs)
• If CapEx hits $8B, FCF drops to $16.8B
• Could limit buyback/dividend growth

🎯 INVESTMENT IMPLICATION:
Strong and growing FCF = Company isn't "fake profitable."
Can weather downturns better than peers. Adds +5 points
to Financial Health score.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Implementation Rule:**
For EVERY metric displayed, create a deep-dive view (expandable card or modal) that shows:
- Definition in plain English
- Calculation/formula
- Historical trend (5 years minimum)
- Peer comparison (3-5 competitors)
- Analyst perspective (if available)
- What-if scenarios
- Why it matters for investment decision

### 4. MULTI-TURN CONTEXT AWARENESS

- Maintain conversation state across messages
- Remember previously discussed stocks
- Allow follow-up questions without repeating context
- Store conversation history per session

**Backend Context Management:**
```javascript
{
  conversationId: "uuid",
  messages: [...previous messages],
  context: {
    discussedStocks: ["AAPL", "MSFT"],
    currentFocus: "AAPL",
    userIntent: "comparison",
    dataFetched: {
      AAPL: { financials, sentiment, analysts },
      MSFT: { financials, sentiment, analysts }
    }
  }
}
```

### 5. INTELLIGENT INSIGHTS ENGINE WITH SOURCE ATTRIBUTION

Generate insights with FULL transparency on sources:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 KEY INSIGHTS FOR TESLA (TSLA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ REVENUE MOMENTUM BUILDING
   📊 Data Source: Yahoo Finance Q3 2024 earnings
   
   Revenue grew 18% YoY ($24.8B), accelerating from 12% 
   in Q2. This is the strongest growth in 8 quarters.
   
   Why it matters: Revenue acceleration typically precedes
   stock price appreciation. Management raised FY guidance
   from $96B to $101B (+5%).
   
   Chart: [Shows revenue trend with inflection point marked]

⚠️  VALUATION STRETCHED DESPITE GROWTH
   📊 Data Source: Historical P/E analysis (Yahoo Finance)
   
   Current P/E of 68.5 is 3.1x the auto sector average (22.1)
   and 3.4x above TSLA's own 5-year average (20.3).
   
   Why it matters: You're paying a significant premium. Even
   with 22% expected growth, PEG ratio of 3.1 suggests 
   overvaluation by traditional metrics.
   
   Bull argument: Tech company, not auto (deserves premium)
   Bear argument: Competition from BYD, legacy brands intensifying
   
   Our take: Premium justified only if growth sustains >20%

📰 POSITIVE NEWS CYCLE (BUT WATCH FOR SHIFT)
   📊 Data Source: FinGPT sentiment analysis
   
   News sentiment: +0.68/1.0 (Strong Positive)
   Analyzed: 248 articles from last 30 days
   
   Key themes detected:
   • AI/autonomy progress: 42% of articles (very positive)
   • Strong Model Y demand in Europe: 28% (positive)
   • China competition: 18% (mixed/negative)
   • Regulatory concerns: 12% (negative)
   
   Sample headlines:
   ✅ "Tesla FSD shows dramatic improvement" - Wired
   ✅ "Model Y becomes Europe's best seller" - Bloomberg
   ⚠️  "BYD outsells Tesla in China Q3" - Reuters
   
   Why it matters: Sentiment can flip quickly. Current 
   positivity is priced in. Watch for sentiment deterioration.

🤝 ANALYSTS DIVIDED - NO STRONG CONSENSUS
   📊 Data Source: Yahoo Finance analyst ratings
   
   Rating distribution (23 analysts):
   • Buy:  10 analysts (43%)
   • Hold: 9 analysts (39%)  
   • Sell: 4 analysts (17%)
   
   Price targets:
   • High:  $350 (Wedbush - "AI play")
   • Avg:   $252 (only 4% above current)
   • Low:   $180 (GLJ Research - "overvalued")
   
   Why it matters: No clear consensus = high uncertainty.
   When analysts are divided, individual investor research
   becomes even more critical.
   
   Notable: Average target barely above current price suggests
   limited upside priced in by professional analysts.

🚨 INSIDER SELLING ACCELERATING
   📊 Data Source: SEC Form 4 filings (via Yahoo Finance)
   
   Last 90 days:
   • Insider sales: $28.5M (8 transactions)
   • Insider buys:  $0 (0 transactions)
   • Net flow: -$28.5M
   
   Who sold:
   • CFO: $12M (largest single sale in 2 years)
   • 2 VPs: $16.5M combined
   
   Why it matters: Insiders typically know the business best.
   Heavy selling with NO buying is historically a bearish signal.
   
   Context: Elon Musk has been selling regularly, but executive
   team selling accelerated in Q4 2024.
   
   Counterpoint: Could be tax planning or diversification,
   not necessarily bearish outlook.

🔮 OUR PREDICTION MODEL
   📊 Data Source: Custom LSTM model + FinGPT sentiment
   
   30-day forecast: $242 → $268 (est. +10.7%)
   Confidence interval: $255-$285 (68% probability)
   
   Key inputs:
   • Technical indicators: Bullish (RSI 58, MACD positive)
   • Sentiment momentum: Strong positive (+0.68)
   • Historical pattern: Similar setups → +8-12% moves
   
   Risk factors:
   • If sentiment drops below +0.3, prediction invalidates
   • If BTC drops >10% (correlation: 0.64), drag on TSLA
   
   Note: This is a MODEL PREDICTION, not financial advice.
   Model accuracy on 30-day forecasts: 62% directional accuracy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 SYNTHESIS: WHAT DOES ALL THIS MEAN?

🎯 FOR GROWTH INVESTORS:
Strong revenue momentum and positive sentiment make this 
attractive IF you can stomach volatility. But you're paying
a steep premium (P/E 68.5). Consider dollar-cost averaging.

🎯 FOR VALUE INVESTORS:
Hard pass. Valuation is 3x sector average with no margin
of safety. Wait for P/E to drop to low 40s minimum.

🎯 FOR MOMENTUM TRADERS:
Sentiment is strong (+0.68) and improving. Could see 
continuation in next 30-60 days. But watch insider selling
as potential reversal signal.

⚠️  KEY RISK TO MONITOR:
If next earnings show margin compression OR if China sales
disappoint, stock could re-rate sharply lower (20-30% drop
not uncommon for high P/E stocks that miss).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Critical Implementation Points:**
1. **Always cite sources** - "According to...", "Based on...", "Source: ..."
2. **Show the data** - Don't just say "high P/E", show historical comparison
3. **Explain implications** - "Why it matters:" for every insight
4. **Multiple perspectives** - Bull case, bear case, our take
5. **Confidence levels** - Be honest about uncertainty
6. **Forward-looking** - What to watch, what could change the thesis

### 6. SMART QUERY EXAMPLES (Quick Actions)

Show users example queries they can click:
- "Compare FAANG stocks' financial health"
- "Find undervalued stocks in the tech sector"
- "Analyze my portfolio risk"
- "What are the best dividend stocks?"
- "Why is Tesla's P/E ratio so high?"
- "Show me insider trading activity for NVDA"
- "What's driving Amazon's stock price lately?"

### 7. INVESTMENT HEALTH SCORE (Enhanced with Breakdown)

**Scoring System (0-100):**
- Financial Health: 30 points
- Valuation Attractiveness: 25 points
- Growth Momentum: 25 points
- Market Sentiment: 20 points

**For each component, show:**
- Points awarded
- Maximum possible points
- Why points were awarded or deducted
- Specific metrics that influenced the score
- How to improve the score

### 8. COMPARATIVE ANALYSIS

When comparing stocks:
```
User: "Compare Apple and Microsoft"

Response:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 APPLE vs MICROSOFT: HEAD-TO-HEAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─ VALUATION ─────────────────────────────────────┐
│                                                  │
│ P/E Ratio                                        │
│ AAPL: 26.8 ████████████████████░░ 🟢           │
│ MSFT: 32.4 ████████████████████████ 🟡         │
│ Winner: AAPL (cheaper by 17%)                   │
│                                                  │
│ Why it matters: You pay less per dollar of      │
│ earnings with AAPL. But MSFT growing faster     │
│ (see Growth section), which may justify premium.│
│                                                  │
│ PEG Ratio (P/E adjusted for growth)             │
│ AAPL: 2.1 (P/E 26.8 / Growth 13%)              │
│ MSFT: 2.4 (P/E 32.4 / Growth 14%)              │
│ Winner: AAPL (better risk-adjusted value)       │
└──────────────────────────────────────────────────┘

┌─ PROFITABILITY ─────────────────────────────────┐
│                                                  │
│ Net Profit Margin                                │
│ AAPL: 25.3% ████████████████████████████ 🏆   │
│ MSFT: 36.2% ████████████████████████████████ 🏆│
│ Winner: MSFT (11 percentage points higher!)     │
│                                                  │
│ Why it matters: MSFT keeps $0.36 of every       │
│ revenue dollar vs AAPL's $0.25. MSFT has better │
│ pricing power and/or lower costs. This is a     │
│ significant competitive advantage.               │
│                                                  │
│ Return on Equity (ROE)                           │
│ AAPL: 147% 🔥🔥🔥                               │
│ MSFT: 43%  ████████░░░░░░░░                    │
│ Winner: AAPL (but see caveat below)             │
│                                                  │
│ Caveat: AAPL's crazy-high ROE is partly from    │
│ aggressive buybacks (shrinking equity base).    │
│ Still impressive, but MSFT's 43% is more        │
│ "sustainable" and also excellent.                │
└──────────────────────────────────────────────────┘

┌─ GROWTH ────────────────────────────────────────┐
│                                                  │
│ Revenue Growth (YoY)                             │
│ AAPL: -2.8% ▼ (temporary iPhone cycle slowdown) │
│ MSFT: +13.1% ▲████████████ 🟢                  │
│ Winner: MSFT (by a lot!)                         │
│                                                  │
│ Why it matters: MSFT is growing faster due to   │
│ cloud (Azure) boom. AAPL facing headwinds from  │
│ China and mature iPhone market. However, AAPL   │
│ has history of comeback cycles with new products.│
│                                                  │
│ EPS Growth (YoY)                                 │
│ AAPL: -3.4% ▼                                    │
│ MSFT: +20.2% ▲████████████████ 🏆             │
│ Winner: MSFT (crushing it)                       │
└──────────────────────────────────────────────────┘

┌─ FINANCIAL HEALTH ──────────────────────────────┐
│                                                  │
│ Debt-to-Equity                                   │
│ AAPL: 1.98 (higher debt)                         │
│ MSFT: 0.32 (very conservative) 🟢               │
│ Winner: MSFT (much safer balance sheet)          │
│                                                  │
│ Why it matters: MSFT can weather downturns      │
│ better. AAPL's higher debt isn't dangerous (they │
│ have $162B cash), but MSFT has more flexibility. │
│                                                  │
│ Current Ratio                                    │
│ AAPL: 0.98 (slight concern)                      │
│ MSFT: 1.78 🟢                                    │
│ Winner: MSFT                                     │
└──────────────────────────────────────────────────┘

┌─ MARKET SENTIMENT ──────────────────────────────┐
│                                                  │
│ News Sentiment (FinGPT)                          │
│ AAPL: +0.42 (Moderately Positive)               │
│ MSFT: +0.58 (Positive) 🟢                       │
│ Winner: MSFT (AI narrative dominant)             │
│                                                  │
│ AAPL themes: China concerns, Vision Pro mixed    │
│ MSFT themes: AI leadership, Azure growth, GitHub │
│                                                  │
│ Analyst Ratings                                  │
│ AAPL: 62% Buy (18 of 29 analysts)               │
│ MSFT: 78% Buy (28 of 36 analysts) 🏆           │
│ Winner: MSFT (stronger conviction)               │
└──────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 OVERALL WINNER: MICROSOFT (on current metrics)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 SCORECARD:
• Valuation: AAPL ✅ (cheaper, better PEG)
• Profitability: MSFT ✅ (much higher margins)
• Growth: MSFT ✅ (AAPL in temporary slowdown)
• Financial Health: MSFT ✅ (stronger balance sheet)
• Sentiment: MSFT ✅ (AI momentum)

MSFT wins 4 out of 5 categories.

💡 BUT WAIT - CONTEXT MATTERS:

🍎 WHY APPLE COULD STILL BE BETTER:
• Trading at a discount (P/E 26.8 vs MSFT 32.4)
• Temporary slowdown - iPhone 16 cycle could surprise
• Vision Pro long-term potential not priced in
• Massive cash hoard ($162B) for M&A or buybacks
• If you believe in "buy low, sell high", AAPL is on sale

🪟 WHY MICROSOFT IS SAFER:
• Momentum clearly with MSFT (AI leadership)
• More consistent growth (not cyclical like AAPL)
• Better fundamentals across the board right now
• Less geopolitical risk (no China exposure like AAPL)

🎯 RECOMMENDATION:
For GROWTH: MSFT (ride the AI wave)
For VALUE: AAPL (contrarian play, discounted)
For BALANCED: 60% MSFT / 40% AAPL (get both)

⚠️  What could change this analysis:
• If AAPL announces major AI features → AAPL gains
• If Azure growth slows → MSFT loses edge
• If China bans iPhone → AAPL serious trouble
• If MSFT wins $100B cloud deals → MSFT dominates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Technical Implementation

### Backend API Architecture

```
/api/chat
  POST /message - Send user message, stream AI response
  GET /history/:conversationId - Retrieve conversation history
  
/api/analysis
  POST /stock/:symbol - Deep dive analysis with "why" explanations
  POST /compare - Compare multiple stocks
  POST /portfolio - Portfolio-level analysis
  
/api/sentiment
  POST /analyze - Get FinGPT sentiment for a stock
  GET /news/:symbol - Get recent news with sentiment scores
  
/api/mcp
  POST /query - Direct MCP server queries (internal use)
```

### Claude API Integration

**System Prompt for Claude:**
```
You are an expert financial analyst helping users understand stocks and markets. 
You have access to Yahoo Finance data via MCP tools AND FinGPT for sentiment analysis.

CRITICAL: Your key differentiator is explaining the WHY behind every number.
Never just show a metric - always explain:
1. What it is
2. Why it has this value
3. What it means for investors
4. How it compares to peers/history
5. Source of the data

Your capabilities:
1. Fetch real-time stock data, financials, historical prices (Yahoo Finance MCP)
2. Analyze news sentiment and market mood (FinGPT)
3. Calculate investment scores with full breakdown
4. Generate comparative analysis with head-to-head comparisons
5. Provide deep "why" explanations for every metric

Guidelines:
- ALWAYS cite data sources explicitly
- Show calculations and reasoning transparently
- Use visual ASCII charts/tables for comparisons
- Provide context: historical, peer, analyst perspectives
- Be balanced - mention both opportunities AND risks
- Never give definitive "buy/sell" advice - provide analysis for informed decisions
- When users ask "why", dive DEEP into the explanation
- Format responses with clear sections and visual hierarchy
- Use emojis sparingly for visual markers (✅⚠️🚨📊💡)

Available MCP Tools (Yahoo Finance):
- get_stock_info(symbol) - Company details, market cap, sector
- get_stock_price(symbol) - Current price, volume, changes
- get_financials(symbol) - Income statement, balance sheet, cash flow
- get_historical_data(symbol, period) - Price history
- get_analyst_recommendations(symbol) - Analyst ratings and targets
- get_insider_transactions(symbol) - Insider buying/selling
- search_stocks(query) - Find stocks by name/sector

FinGPT Integration:
- analyze_sentiment(text) - Get sentiment score for news/text
- get_market_mood(symbol) - Analyze recent news sentiment for a stock

Always fetch fresh data for each query. Structure responses with:
1. Direct answer to user's question
2. Supporting data/metrics WITH EXPLANATIONS
3. Context and comparison
4. Visual data (charts/tables when applicable)
5. Key insights/takeaways
6. Multiple perspectives (bull/bear cases)
7. What to watch going forward
```

### FinGPT Integration

**Setup FinGPT (Python Backend):**

```python
# Install dependencies
# pip install transformers huggingface_hub torch

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from huggingface_hub import InferenceClient

# Option 1: Use FinGPT via HuggingFace Inference API (Recommended - Free Tier)
class FinGPTAnalyzer:
    def __init__(self, hf_token):
        self.client = InferenceClient(token=hf_token)
        self.sentiment_model = "FinGPT/fingpt-sentiment-llama2-13b-lora"
        
    def analyze_news_sentiment(self, news_articles, stock_symbol):
        """Analyze sentiment of news articles for a stock"""
        prompt = f"""
        Analyze the sentiment of the following news articles about {stock_symbol}.
        Provide:
        1. Overall sentiment score (-1 to +1)
        2. Key themes (positive and negative)
        3. Market implications
        
        Articles:
        {news_articles}
        
        Response format: JSON with sentiment_score, themes, implications
        """
        
        response = self.client.text_generation(
            prompt,
            model=self.sentiment_model,
            max_new_tokens=500
        )
        
        return self.parse_response(response)
    
    def get_market_mood(self, stock_symbol, recent_news):
        """Get overall market mood for a stock based on news"""
        sentiments = []
        themes = {"positive": [], "negative": []}
        
        for article in recent_news:
            sentiment = self.analyze_news_sentiment(article['text'], stock_symbol)
            sentiments.append(sentiment['score'])
            
            if sentiment['score'] > 0.2:
                themes['positive'].extend(sentiment['themes'])
            elif sentiment['score'] < -0.2:
                themes['negative'].extend(sentiment['themes'])
        
        avg_sentiment = sum(sentiments) / len(sentiments)
        
        return {
            "sentiment_score": avg_sentiment,
            "confidence": self._calculate_confidence(sentiments),
            "positive_themes": self._top_themes(themes['positive']),
            "negative_themes": self._top_themes(themes['negative']),
            "article_count": len(recent_news)
        }

# Option 2: Use local FinGPT model (if you have GPU)
class LocalFinGPT:
    def __init__(self):
        self.tokenizer = AutoTokenizer.from_pretrained("FinGPT/fingpt-sentiment")
        self.model = AutoModelForSequenceClassification.from_pretrained(
            "FinGPT/fingpt-sentiment"
        )
        
    def analyze_sentiment(self, text):
        inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        outputs = self.model(**inputs)
        scores = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
        return {
            "positive": scores[0][2].item(),
            "neutral": scores[0][1].item(),
            "negative": scores[0][0].item()
        }

# Usage in your backend
@app.post("/api/sentiment/analyze")
async def analyze_stock_sentiment(symbol: str):
    # 1. Fetch recent news from Yahoo Finance MCP
    news = await mcp_client.get_news(symbol, count=20)
    
    # 2. Analyze sentiment with FinGPT
    fingpt = FinGPTAnalyzer(hf_token=os.getenv("HF_TOKEN"))
    sentiment_analysis = fingpt.get_market_mood(symbol, news)
    
    # 3. Return comprehensive analysis
    return {
        "symbol": symbol,
        "sentiment": sentiment_analysis,
        "news_sample": news[:5],  # Include sample headlines
        "analysis_timestamp": datetime.now()
    }
```

**Free Tier Limits:**
- HuggingFace Inference API: 30,000 characters/month free
- Enough for ~150-200 sentiment analyses per month
- Upgrade to Pro ($9/mo) for unlimited usage

### Yahoo Finance MCP Server Integration

**Setup:**
```bash
# Install MCP server (using maxscheijen's version)
npm install -g mcp-yahoo-finance

# Or use docker
docker run -d -p 3001:3000 --name yahoo-mcp mcp-yahoo-finance
```

**Backend Connection (Node.js):**
```javascript
const { MCPClient } = require('@modelcontextprotocol/sdk');

class YahooFinanceMCP {
  constructor() {
    this.client = new MCPClient({
      serverUrl: process.env.MCP_SERVER_URL || 'http://localhost:3001',
    });
  }
  
  async getStockData(symbol) {
    const [info, financials, analysts, insiders] = await Promise.all([
      this.client.call('get_stock_info', { symbol }),
      this.client.call('get_financials', { symbol }),
      this.client.call('get_analyst_ratings', { symbol }),
      this.client.call('get_insider_transactions', { symbol })
    ]);
    
    return { info, financials, analysts, insiders };
  }
  
  async calculateInvestmentScore(data) {
    // Implement scoring logic
    const financialHealth = this.scoreFinancialHealth(data.financials);
    const valuation = this.scoreValuation(data.info, data.financials);
    const growth = this.scoreGrowth(data.financials);
    const sentiment = this.scoreSentiment(data.analysts);
    
    return {
      total: financialHealth.score + valuation.score + growth.score + sentiment.score,
      breakdown: {
        financial_health: financialHealth,
        valuation: valuation,
        growth: growth,
        sentiment: sentiment
      }
    };
  }
  
  scoreFinancialHealth(financials) {
    const currentRatio = financials.currentRatio;
    const debtToEquity = financials.debtToEquity;
    const interestCoverage = financials.interestCoverage;
    
    let score = 30; // Start with max
    let explanations = [];
    
    // Current Ratio scoring
    if (currentRatio >= 2.0) {
      explanations.push({
        metric: "Current Ratio",
        value: currentRatio,
        points: 10,
        reason: "Excellent liquidity - can cover short-term obligations 2x over"
      });
    } else if (currentRatio >= 1.5) {
      score -= 3;
      explanations.push({
        metric: "Current Ratio",
        value: currentRatio,
        points: 7,
        reason: "Good liquidity - comfortable coverage of obligations"
      });
    } else {
      score -= 7;
      explanations.push({
        metric: "Current Ratio",
        value: currentRatio,
        points: 3,
        reason: "Weak liquidity - may struggle with short-term obligations"
      });
    }
    
    // Similar logic for debt and interest coverage...
    
    return {
      score: score,
      max_score: 30,
      explanations: explanations,
      summary: this.generateHealthSummary(score, explanations)
    };
  }
}

// Integrate with Claude API
app.post('/api/chat/message', async (req, res) => {
  const { message, conversationId } = req.body;
  
  // Get conversation history
  const history = await getConversationHistory(conversationId);
  
  // Create Claude request with MCP tools
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: SYSTEM_PROMPT, // From above
    messages: [...history, { role: 'user', content: message }],
    tools: yahooMCP.getTools() // Pass MCP tools
  });
  
  // Stream response back to client
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }
    
    if (chunk.type === 'tool_use') {
      // Claude is calling a tool
      const result = await yahooMCP.executeTool(chunk.name, chunk.input);
      
      // If it's stock data, also get sentiment from FinGPT
      if (chunk.name === 'get_stock_info') {
        const sentiment = await fingpt.analyze_stock_sentiment(chunk.input.symbol);
        result.sentiment = sentiment;
      }
      
      // Send tool result back
      res.write(`data: ${JSON.stringify({ type: 'tool_result', result })}\n\n`);
    }
  }
  
  res.end();
});
```

### Real-Time Streaming with WebSocket

```javascript
// Backend WebSocket handler
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('user-message', async (data) => {
    const { message, conversationId } = data;
    
    try {
      // Get full context
      const history = await getConversationHistory(conversationId);
      
      // Stream Claude's response
      const stream = await anthropic.messages.stream({
        model: 'claude-sonnet-4-20250514',
        messages: [...history, { role: 'user', content: message }],
        tools: [
          ...yahooMCP.getTools(),
          ...fingptTools
        ],
        max_tokens: 4000
      });
      
      let fullResponse = '';
      
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          const text = chunk.delta.text;
          fullResponse += text;
          
          // Stream to client
          socket.emit('ai-response-chunk', { text });
        }
        
        if (chunk.type === 'tool_use') {
          socket.emit('thinking', { tool: chunk.name });
          
          // Execute tool
          let result;
          if (chunk.name.startsWith('get_')) {
            result = await yahooMCP.executeTool(chunk.name, chunk.input);
          } else if (chunk.name === 'analyze_sentiment') {
            result = await fingpt.analyzeSentiment(chunk.input);
          }
          
          socket.emit('data-fetched', { 
            tool: chunk.name,
            data: result 
          });
        }
      }
      
      // Save to history
      await saveMessage(conversationId, 'user', message);
      await saveMessage(conversationId, 'assistant', fullResponse);
      
      socket.emit('response-complete');
      
    } catch (error) {
      console.error('Error:', error);
      socket.emit('error', { message: error.message });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});
```

### Chart Generation Logic

```javascript
function generateChartFromQuery(userQuery, data, intent) {
  // Parse what kind of chart is needed
  
  if (intent.includes('compare') && intent.includes('P/E')) {
    return {
      type: 'bar',
      title: 'P/E Ratio Comparison',
      data: {
        labels: data.stocks.map(s => s.symbol),
        datasets: [{
          label: 'P/E Ratio',
          data: data.stocks.map(s => s.peRatio),
          backgroundColor: data.stocks.map(s => {
            // Color code based on sector average
            const sectorAvg = s.sectorPE || 20;
            return s.peRatio > sectorAvg * 1.3 ? '#EF4444' : // Red (overvalued)
                   s.peRatio < sectorAvg * 0.8 ? '#10B981' : // Green (undervalued)
                   '#F59E0B'; // Yellow (fair)
          })
        }]
      },
      annotations: {
        // Show sector average line
        sectorAverage: data.sectorAverage
      },
      explanations: data.stocks.map(s => ({
        symbol: s.symbol,
        why: `P/E of ${s.peRatio} is ${s.peRatio > s.sectorPE ? 'above' : 'below'} sector avg of ${s.sectorPE}`
      }))
    };
  }
  
  if (intent.includes('trend') || intent.includes('history')) {
    return {
      type: 'line',
      title: `${data.symbol} Historical Performance`,
      data: {
        labels: data.dates,
        datasets: [{
          label: 'Price',
          data: data.prices,
          borderColor: '#3B82F6',
          fill: false
        }]
      },
      annotations: {
        // Mark significant events
        events: data.significantEvents,
        // Show moving averages
        ma50: data.movingAverage50,
        ma200: data.movingAverage200
      },
      explanations: [
        {
          type: 'inflection',
          date: data.inflectionPoint,
          why: 'Trend changed here due to earnings beat'
        }
      ]
    };
  }
  
  // Add more chart types...
}
```

---

## Frontend UI Structure

### Layout
```
┌──────────────────────────────────────────────────────────────┐
│  Header: Logo | "Every number tells a story..." | Settings  │
├──────────────────────┬───────────────────────────────────────┤
│                      │                                       │
│  Chat Panel          │  Dynamic Content Area                │
│  (Left 40%)          │  (Right 60%)                         │
│                      │                                       │
│  [Quick Actions]     │  ┌─────────────────────────────────┐ │
│   • Compare FAANG    │  │                                 │ │
│   • Find undervalued │  │   Investment Score Card         │ │
│   • Why is P/E high? │  │   (with expandable breakdown)   │ │
│                      │  │                                 │ │
│  [Messages]          │  └─────────────────────────────────┘ │
│   User: Analyze AAPL │                                       │
│   AI: [Response...]  │  ┌─────────────────────────────────┐ │
│                      │  │                                 │ │
│  [Typing indicator]  │  │   Chart (dynamic)               │ │
│                      │  │                                 │ │
│  [Input Box]         │  └─────────────────────────────────┘ │
│   "Ask me anything"  │                                       │
│   [Send button]      │  ┌─────────────────────────────────┐ │
│                      │  │   Key Insights Panel            │ │
│                      │  │   (with source citations)       │ │
│                      │  └─────────────────────────────────┘ │
│                      │                                       │
└──────────────────────┴───────────────────────────────────────┘
```

### Components to Build

**Chat Components:**
- `ChatContainer` - Main chat wrapper
- `MessageList` - Scrollable message history with lazy loading
- `MessageBubble` - Individual message (user/AI) with markdown support
- `ChatInput` - Input box with autocomplete
- `TypingIndicator` - Shows when AI is thinking
- `QuickActions` - Clickable example queries
- `ThinkingIndicator` - Shows which tool Claude is using

**Visualization Components:**
- `InvestmentScoreCard` - Main score display with expandable breakdown
- `MetricCard` - Individual metric with "Why" button
- `ComparisonTable` - Side-by-side metrics with visual indicators
- `DynamicChart` - Recharts wrapper that can render any chart type
- `InsightPanel` - Key insights with expandable explanations
- `SourceCitation` - Visual indicator of data source
- `WhyExplainer` - Modal/drawer for deep dives

**Example: MetricCard with "Why" Button**
```jsx
function MetricCard({ metric, value, explanation }) {
  const [showWhy, setShowWhy] = useState(false);
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-500">{metric}</span>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <button 
          onClick={() => setShowWhy(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          <InfoIcon /> Why?
        </button>
      </div>
      
      {showWhy && (
        <WhyExplainer 
          metric={metric}
          value={value}
          explanation={explanation}
          onClose={() => setShowWhy(false)}
        />
      )}
    </div>
  );
}

function WhyExplainer({ metric, explanation, onClose }) {
  return (
    <Dialog open onClose={onClose}>
      <div className="p-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          Why {metric} = {explanation.value}?
        </h2>
        
        <div className="space-y-4">
          <section>
            <h3 className="font-semibold">What is this?</h3>
            <p>{explanation.definition}</p>
          </section>
          
          <section>
            <h3 className="font-semibold">How it's calculated</h3>
            <pre className="bg-gray-100 p-3 rounded">
              {explanation.calculation}
            </pre>
          </section>
          
          <section>
            <h3 className="font-semibold">Historical Context</h3>
            <TrendChart data={explanation.historical} />
          </section>
          
          <section>
            <h3 className="font-semibold">Peer Comparison</h3>
            <ComparisonChart data={explanation.peers} />
          </section>
          
          <section>
            <h3 className="font-semibold">Why it matters</h3>
            <p>{explanation.implications}</p>
          </section>
          
          <section>
            <h3 className="font-semibold">What analysts say</h3>
            <p className="italic">"{explanation.analystView}"</p>
            <span className="text-sm text-gray-500">
              Source: {explanation.source}
            </span>
          </section>
        </div>
      </div>
    </Dialog>
  );
}
```

---

## Database Schema

### Conversations
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255), -- First query or summary
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id),
  role VARCHAR(10) CHECK (role IN ('user', 'assistant')),
  content TEXT,
  metadata JSONB, -- Store tool calls, charts, sentiment data
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
```

### User Data
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  symbol VARCHAR(10),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, symbol)
);

CREATE TABLE analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(10),
  analysis_type VARCHAR(50), -- 'score', 'sentiment', 'financials'
  data JSONB,
  expires_at TIMESTAMP, -- Cache for 15 minutes
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cache_symbol ON analysis_cache(symbol, analysis_type);
CREATE INDEX idx_cache_expires ON analysis_cache(expires_at);
```

---

## Deployment Architecture

### Docker Compose (Development)
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:4000
      - REACT_APP_WS_URL=ws://localhost:4000
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - HUGGINGFACE_TOKEN=${HUGGINGFACE_TOKEN}
      - MCP_SERVER_URL=http://yahoo-mcp:3000
      - DATABASE_URL=postgresql://user:pass@postgres:5432/stockapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
      - yahoo-mcp
  
  yahoo-mcp:
    image: ghcr.io/maxscheijen/mcp-yahoo-finance:latest
    ports:
      - "3001:3000"
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=stockapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Kubernetes Manifests (EKS)

**backend-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: stock-app-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: stock-app-backend
  template:
    metadata:
      labels:
        app: stock-app-backend
    spec:
      containers:
      - name: backend
        image: your-ecr-repo/stock-app-backend:latest
        ports:
        - containerPort: 4000
        env:
        - name: ANTHROPIC_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: anthropic-key
        - name: HUGGINGFACE_TOKEN
          valueFrom:
            secretKeyRef:
              name: api-secrets
              key: hf-token
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 4000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 4000
          initialDelaySeconds: 5
          periodSeconds: 5
```

**ingress.yaml:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: stock-app-ingress
  annotations:
    kubernetes.io/ingress.class: alb
    alb.ingress.kubernetes.io/scheme: internet-facing
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:...
    alb.ingress.kubernetes.io/ssl-policy: ELBSecurityPolicy-TLS-1-2-2017-01
spec:
  rules:
  - host: api.yourapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: stock-app-backend
            port:
              number: 4000
  - host: www.yourapp.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: stock-app-frontend
            port:
              number: 80
```

---

## Environment Variables

```env
# Backend
ANTHROPIC_API_KEY=sk-ant-xxx
HUGGINGFACE_TOKEN=hf_xxx
MCP_SERVER_URL=http://localhost:3001
DATABASE_URL=postgresql://user:pass@localhost:5432/stockapp
REDIS_URL=redis://localhost:6379
NODE_ENV=production
PORT=4000

# Frontend
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_WS_URL=wss://api.yourapp.com
```

---

## Development Workflow

### 1. Clone and Setup
```bash
git clone <your-repo>
cd stock-analysis-app

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your API keys:
# - Get ANTHROPIC_API_KEY from console.anthropic.com
# - Get HUGGINGFACE_TOKEN from huggingface.co/settings/tokens
```

### 3. Start Services
```bash
# Terminal 1: Start all services with Docker Compose
docker-compose up

# OR manually:
# Terminal 1: Yahoo Finance MCP
docker run -p 3001:3000 mcp-yahoo-finance

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm start
```

### 4. Access the App
```
Frontend: http://localhost:3000
Backend API: http://localhost:4000
MCP Server: http://localhost:3001
```

---

## Testing Strategy

### Key Test Scenarios

1. **Investment Score Accuracy**
   - Verify calculations match documentation
   - Test edge cases (negative earnings, high debt, etc.)
   - Validate explanations are generated correctly

2. **Sentiment Analysis**
   - Test with positive/negative/neutral news
   - Verify FinGPT integration works
   - Check sentiment scores make sense

3. **Chat Context**
   - Multi-turn conversations maintain context
   - Follow-up questions work correctly
   - Can reference previously mentioned stocks

4. **Data Freshness**
   - Yahoo Finance data updates correctly
   - Cache invalidation works (15 min TTL)
   - Error handling for stale data

5. **"Why" Explanations**
   - Every metric has a deep explanation
   - Sources are cited correctly
   - Comparisons (historical/peer) load properly

---

## Success Metrics

Track these KPIs:
- **Engagement:** Average messages per conversation
- **Retention:** Users returning within 7 days
- **Most asked questions:** Identify popular features
- **"Why" clicks:** How often users expand explanations
- **User sentiment:** Thumbs up/down on responses
- **Time to insight:** How quickly users get answers

---

## Key Differentiators Summary

What makes THIS app special:

1. **Deep "Why" Explanations** 
   - Never just show numbers - explain the reasoning
   - Full transparency on calculations and sources
   
2. **Source Attribution**
   - "According to Yahoo Finance..." 
   - "7 of 12 analysts say..."
   - "Our model predicts..."

3. **Multi-Source Intelligence**
   - Yahoo Finance (fundamentals)
   - FinGPT (sentiment)
   - Custom models (predictions)
   - Synthesized insights

4. **Conversational Interface**
   - Natural language queries
   - Context-aware follow-ups
   - Dynamic visualizations

5. **Educational Focus**
   - Teach users WHY metrics matter
   - Show how to analyze stocks
   - Build financial literacy

---

## Priority Order for Development

### Week 1-2: Foundation
1. ✅ Backend setup with Express/FastAPI
2. ✅ Yahoo Finance MCP integration
3. ✅ Basic chat interface (frontend)
4. ✅ Claude API integration with streaming
5. ✅ Investment score calculation with breakdown

### Week 3-4: Intelligence Layer
1. ✅ FinGPT integration for sentiment
2. ✅ "Why" explanation system
3. ✅ Deep metric drill-downs
4. ✅ Chart generation
5. ✅ Comparison features

### Week 5-6: Polish & Deploy
1. ✅ Full source attribution
2. ✅ Performance optimization
3. ✅ Mobile responsive design
4. ✅ Docker deployment
5. ✅ EKS production setup

### Week 7-8: Advanced Features
1. ✅ User accounts & watchlists
2. ✅ Custom ML predictions (LSTM)
3. ✅ Portfolio analysis
4. ✅ Alerts & notifications

---

## Notes for Claude Code

**Philosophy:** 
Users don't want data dumps - they want understanding. Every number should tell a story that helps them make better decisions.

**Start with:**
1. Backend MCP + FinGPT integration (verify data flow)
2. Investment score with full breakdown (the core value prop)
3. Chat UI with one example query working end-to-end
4. Then iterate adding "why" explanations for each metric

**Testing:**
- Use AAPL as the primary test case
- Verify explanations make sense to non-experts
- Ensure all sources are cited
- Check that comparisons load properly

**Remember:**
- EVERY metric needs a "Why" button
- ALWAYS cite data sources
- Show calculations transparently
- Provide multiple perspectives (bull/bear)
- Be honest about uncertainty

Build iteratively and make it EDUCATIONAL above all else!

---

**Tagline:** "Every number should tell a story, and every metric should drive a decision."

Let's build something that actually helps people understand investing! 🚀
