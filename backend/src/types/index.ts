export interface StockInfo {
  symbol: string;
  name: string;
  marketCap: number;
  sector: string;
  industry: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface FinancialMetrics {
  // Valuation
  peRatio: number;
  pegRatio: number;
  priceToBook: number;
  priceToSales: number;

  // Profitability
  profitMargin: number;
  operatingMargin: number;
  returnOnEquity: number;
  returnOnAssets: number;

  // Financial Health
  currentRatio: number;
  quickRatio: number;
  debtToEquity: number;
  interestCoverage: number;

  // Growth
  revenueGrowth: number;
  earningsGrowth: number;
  epsGrowth: number;

  // Cash Flow
  freeCashFlow: number;
  operatingCashFlow: number;
  capex: number;
}

export interface MetricExplanation {
  metric: string;
  value: number | string;
  points: number;
  maxPoints: number;
  reason: string;
  context?: {
    historical?: number[];
    sectorAverage?: number;
    peers?: { symbol: string; value: number }[];
  };
  implications: string;
  source: string;
}

export interface InvestmentScore {
  total: number;
  maxScore: number;
  rating: 'BUY' | 'HOLD' | 'SELL';
  breakdown: {
    financialHealth: ComponentScore;
    valuation: ComponentScore;
    growth: ComponentScore;
    sentiment: ComponentScore;
  };
  summary: string;
  bullCase: string;
  bearCase: string;
  verdict: string;
}

export interface ComponentScore {
  score: number;
  maxScore: number;
  explanations: MetricExplanation[];
  summary: string;
}

export interface SentimentAnalysis {
  score: number; // -1 to +1
  label: 'Very Negative' | 'Negative' | 'Neutral' | 'Positive' | 'Very Positive';
  confidence: number;
  themes: {
    positive: string[];
    negative: string[];
  };
  articleCount: number;
  source: string;
}

export interface AnalystData {
  rating: 'Buy' | 'Hold' | 'Sell';
  count: number;
  percentage: number;
  priceTarget: {
    high: number;
    average: number;
    low: number;
    current: number;
  };
}

export interface InsiderTransaction {
  date: string;
  name: string;
  position: string;
  type: 'buy' | 'sell';
  amount: number;
  shares: number;
}

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    stocks?: string[];
    charts?: any[];
    sentiment?: SentimentAnalysis;
    score?: InvestmentScore;
  };
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId?: string;
  title: string;
  messages: Message[];
  context: {
    discussedStocks: string[];
    currentFocus?: string;
    userIntent?: string;
    dataFetched?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  messageId: string;
  conversationId: string;
  content: string;
  metadata?: Message['metadata'];
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter';
  title: string;
  data: any;
  annotations?: any;
  explanations?: any[];
}
