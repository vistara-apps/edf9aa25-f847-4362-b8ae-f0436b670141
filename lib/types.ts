export interface User {
  userId: string;
  virtualBalance: number;
  tradeHistory: Trade[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Trade {
  tradeId: string;
  userId: string;
  symbol: string;
  type: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  timestamp: Date;
  pnl?: number;
  strategyUsed?: string;
  status: 'open' | 'closed';
}

export interface LearningModule {
  moduleId: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'quiz';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  completed?: boolean;
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  lastUpdated: Date;
}

export interface CandlestickData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalPnL: number;
  totalPnLPercent: number;
  winRate: number;
  totalTrades: number;
  avgTradeSize: number;
  bestTrade: number;
  worstTrade: number;
}
