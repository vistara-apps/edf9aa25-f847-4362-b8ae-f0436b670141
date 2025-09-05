'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { SUPPORTED_ASSETS, MOCK_MARKET_DATA } from '@/lib/constants';

interface TradeFormProps {
  selectedAsset?: string;
  onTrade?: (trade: any) => void;
}

export function TradeForm({ selectedAsset = 'BTC', onTrade }: TradeFormProps) {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentAsset = MOCK_MARKET_DATA.find(asset => asset.symbol === selectedAsset);
  const currentPrice = currentAsset?.price || 0;
  const virtualBalance = 10000; // Mock balance

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || (orderType === 'limit' && !price)) return;

    setIsSubmitting(true);

    try {
      const trade = {
        tradeId: Date.now().toString(),
        userId: 'demo-user',
        symbol: selectedAsset,
        type: tradeType,
        quantity: parseFloat(amount),
        entryPrice: orderType === 'market' ? currentPrice : parseFloat(price),
        timestamp: new Date(),
        status: 'open',
      };

      onTrade?.(trade);
      
      // Reset form
      setAmount('');
      setPrice('');
      
      // Show success message (in a real app, you'd use a toast)
      alert(`${tradeType.toUpperCase()} order placed successfully!`);
    } catch (error) {
      console.error('Trade submission error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedTotal = parseFloat(amount || '0') * (orderType === 'market' ? currentPrice : parseFloat(price || '0'));

  return (
    <div className="trade-form">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Place Order</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTradeType('buy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              tradeType === 'buy'
                ? 'bg-green-500 text-white'
                : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
            }`}
          >
            <TrendingUp size={16} />
            Buy
          </button>
          <button
            onClick={() => setTradeType('sell')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              tradeType === 'sell'
                ? 'bg-red-500 text-white'
                : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
            }`}
          >
            <TrendingDown size={16} />
            Sell
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Asset
          </label>
          <select className="select-field">
            {SUPPORTED_ASSETS.map((asset) => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.symbol} - {asset.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Order Type
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOrderType('market')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                orderType === 'market'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
              }`}
            >
              Market
            </button>
            <button
              type="button"
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                orderType === 'limit'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
              }`}
            >
              Limit
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount ({selectedAsset})
          </label>
          <input
            type="number"
            step="0.00001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input-field"
            required
          />
        </div>

        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Price (USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={currentPrice.toString()}
              className="input-field"
              required
            />
          </div>
        )}

        <div className="bg-white bg-opacity-5 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Current Price:</span>
            <span className="text-white">{formatCurrency(currentPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Estimated Total:</span>
            <span className="text-white">{formatCurrency(estimatedTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Available Balance:</span>
            <span className="text-white">{formatCurrency(virtualBalance)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !amount || (orderType === 'limit' && !price)}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
            tradeType === 'buy'
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-red-500 hover:bg-red-600 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Placing Order...' : `${tradeType.toUpperCase()} ${selectedAsset}`}
        </button>
      </form>
    </div>
  );
}
