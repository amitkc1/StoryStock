export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
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

export interface QuickAction {
  id: string;
  label: string;
  query: string;
  icon?: string;
}
