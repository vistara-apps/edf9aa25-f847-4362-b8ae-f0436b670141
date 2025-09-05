'use client';

import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: 'pnl' | 'winRate' | 'trades' | 'balance';
  variant?: 'default' | 'positive' | 'negative';
}

const iconMap = {
  pnl: DollarSign,
  winRate: Target,
  trades: TrendingUp,
  balance: DollarSign,
};

export function AnalyticsCard({ 
  title, 
  value, 
  change, 
  icon, 
  variant = 'default' 
}: AnalyticsCardProps) {
  const Icon = iconMap[icon];
  const isPositive = change !== undefined ? change >= 0 : variant === 'positive';
  const isNegative = variant === 'negative';

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${
          isPositive ? 'bg-green-500 bg-opacity-20' : 
          isNegative ? 'bg-red-500 bg-opacity-20' : 
          'bg-blue-500 bg-opacity-20'
        }`}>
          <Icon size={20} className={
            isPositive ? 'text-green-400' : 
            isNegative ? 'text-red-400' : 
            'text-blue-400'
          } />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{formatPercent(change)}
            </span>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-1">
          {typeof value === 'number' ? formatCurrency(value) : value}
        </h3>
        <p className="text-sm text-gray-400">{title}</p>
      </div>
    </div>
  );
}
