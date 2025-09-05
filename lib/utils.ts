import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercent(percent: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(percent / 100);
}

export function formatLargeNumber(num: number): string {
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(1)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(1)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(1)}K`;
  }
  return num.toString();
}

export function generateMockCandlestickData(days = 30): any[] {
  const data = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  let basePrice = 43000;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * dayMs);
    const volatility = 0.05; // 5% daily volatility
    
    const change = (Math.random() - 0.5) * 2 * volatility;
    const open = basePrice;
    const close = basePrice * (1 + change);
    
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    
    data.push({
      timestamp,
      open,
      high,
      low,
      close,
      volume: Math.random() * 1000000 + 500000,
    });
    
    basePrice = close;
  }
  
  return data;
}

export function calculatePnL(trades: any[]): number {
  return trades.reduce((total, trade) => {
    if (trade.status === 'closed' && trade.pnl) {
      return total + trade.pnl;
    }
    return total;
  }, 0);
}

export function calculateWinRate(trades: any[]): number {
  const closedTrades = trades.filter(trade => trade.status === 'closed' && trade.pnl !== undefined);
  if (closedTrades.length === 0) return 0;
  
  const winningTrades = closedTrades.filter(trade => trade.pnl! > 0);
  return (winningTrades.length / closedTrades.length) * 100;
}
