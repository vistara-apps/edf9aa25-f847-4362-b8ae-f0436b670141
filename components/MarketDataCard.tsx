'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatPercent, formatLargeNumber } from '@/lib/utils';
import type { MarketData } from '@/lib/types';

interface MarketDataCardProps {
  data: MarketData;
  onClick?: () => void;
}

export function MarketDataCard({ data, onClick }: MarketDataCardProps) {
  const isPositive = data.changePercent24h >= 0;

  return (
    <div 
      className="metric-card cursor-pointer hover:scale-105 transform transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{data.symbol === 'BTC' ? '₿' : data.symbol === 'ETH' ? 'Ξ' : data.symbol === 'BASE' ? '🔵' : '$'}</span>
          <div>
            <h3 className="font-semibold text-white">{data.symbol}</h3>
            <p className="text-xs text-gray-400">
              {data.symbol === 'BTC' ? 'Bitcoin' : 
               data.symbol === 'ETH' ? 'Ethereum' : 
               data.symbol === 'BASE' ? 'Base' : 'USD Coin'}
            </p>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="text-sm font-medium">{formatPercent(data.changePercent24h)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Price</span>
          <span className="text-white font-medium">{formatCurrency(data.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">24h Change</span>
          <span className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{formatCurrency(data.change24h)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Volume</span>
          <span className="text-white font-medium">{formatLargeNumber(data.volume24h)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400 text-sm">Market Cap</span>
          <span className="text-white font-medium">{formatLargeNumber(data.marketCap)}</span>
        </div>
      </div>
    </div>
  );
}
