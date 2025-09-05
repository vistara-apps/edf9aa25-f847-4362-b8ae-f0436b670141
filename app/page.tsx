'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { Sidebar } from '@/components/Sidebar';
import { MarketDataCard } from '@/components/MarketDataCard';
import { TradingChart } from '@/components/TradingChart';
import { TradeForm } from '@/components/TradeForm';
import { AnalyticsCard } from '@/components/AnalyticsCard';
import { LearningModuleCard } from '@/components/LearningModuleCard';
import { MOCK_MARKET_DATA, LEARNING_MODULES } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export default function FlashTradeSim() {
  const { setFrameReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [trades, setTrades] = useState<any[]>([]);
  const [virtualBalance, setVirtualBalance] = useState(10000);

  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  const handleTrade = (trade: any) => {
    setTrades(prev => [...prev, trade]);
    // Update virtual balance based on trade
    if (trade.type === 'buy') {
      setVirtualBalance(prev => prev - (trade.quantity * trade.entryPrice));
    }
  };

  const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  const winRate = trades.length > 0 ? (trades.filter(t => (t.pnl || 0) > 0).length / trades.length) * 100 : 0;

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Trading Dashboard</h2>
        <p className="text-gray-400">Monitor markets and track your performance</p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Virtual Balance"
          value={virtualBalance}
          icon="balance"
          variant="default"
        />
        <AnalyticsCard
          title="Total P&L"
          value={totalPnL}
          change={totalPnL > 0 ? 5.2 : -2.1}
          icon="pnl"
          variant={totalPnL >= 0 ? 'positive' : 'negative'}
        />
        <AnalyticsCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon="winRate"
          variant="default"
        />
        <AnalyticsCard
          title="Total Trades"
          value={trades.length}
          icon="trades"
          variant="default"
        />
      </div>

      {/* Market Overview */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Market Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_MARKET_DATA.map((asset) => (
            <MarketDataCard
              key={asset.symbol}
              data={asset}
              onClick={() => {
                setSelectedAsset(asset.symbol);
                setActiveTab('trading');
              }}
            />
          ))}
        </div>
      </div>

      {/* Quick Chart */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Price Chart</h3>
        <TradingChart symbol={selectedAsset} />
      </div>
    </div>
  );

  const renderTrading = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Trading Interface</h2>
        <p className="text-gray-400">Execute simulated trades with real market data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <TradingChart symbol={selectedAsset} />
        </div>

        {/* Trade Form */}
        <div>
          <TradeForm
            selectedAsset={selectedAsset}
            onTrade={handleTrade}
          />
        </div>
      </div>

      {/* Market Data */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Available Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_MARKET_DATA.map((asset) => (
            <MarketDataCard
              key={asset.symbol}
              data={asset}
              onClick={() => setSelectedAsset(asset.symbol)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Performance Analytics</h2>
        <p className="text-gray-400">Analyze your trading performance and identify patterns</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total P&L"
          value={totalPnL}
          change={totalPnL > 0 ? 5.2 : -2.1}
          icon="pnl"
          variant={totalPnL >= 0 ? 'positive' : 'negative'}
        />
        <AnalyticsCard
          title="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          icon="winRate"
          variant="default"
        />
        <AnalyticsCard
          title="Total Trades"
          value={trades.length}
          icon="trades"
          variant="default"
        />
        <AnalyticsCard
          title="Avg Trade Size"
          value={trades.length > 0 ? trades.reduce((sum, t) => sum + (t.quantity * t.entryPrice), 0) / trades.length : 0}
          icon="balance"
          variant="default"
        />
      </div>

      {/* Trade History */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Trades</h3>
        {trades.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No trades yet. Start trading to see your history here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trades.slice(-10).reverse().map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white bg-opacity-5 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    trade.type === 'buy' ? 'bg-green-500 bg-opacity-20 text-green-400' : 'bg-red-500 bg-opacity-20 text-red-400'
                  }`}>
                    {trade.type.toUpperCase()}
                  </span>
                  <span className="text-white font-medium">{trade.symbol}</span>
                  <span className="text-gray-400 text-sm">{trade.quantity} @ {formatCurrency(trade.entryPrice)}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{formatCurrency(trade.quantity * trade.entryPrice)}</div>
                  <div className="text-gray-400 text-xs">{new Date(trade.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderLearn = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Learning Center</h2>
        <p className="text-gray-400">Master trading strategies with our comprehensive courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEARNING_MODULES.map((module) => (
          <LearningModuleCard
            key={module.moduleId}
            module={module}
            onStart={(moduleId) => {
              alert(`Starting module: ${module.title}`);
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Profile</h2>
        <p className="text-gray-400">Your trading profile and achievements</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">DU</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Demo User</h3>
            <p className="text-gray-400">Virtual Trader</p>
            <p className="text-sm text-gray-500">Member since {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
            <div className="text-2xl font-bold text-white">{trades.length}</div>
            <div className="text-gray-400 text-sm">Total Trades</div>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
            <div className="text-2xl font-bold text-white">{winRate.toFixed(1)}%</div>
            <div className="text-gray-400 text-sm">Win Rate</div>
          </div>
          <div className="text-center p-4 bg-white bg-opacity-5 rounded-lg">
            <div className="text-2xl font-bold text-white">{formatCurrency(totalPnL)}</div>
            <div className="text-gray-400 text-sm">Total P&L</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-400">Customize your trading experience</p>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Trading Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Default Order Type</span>
            <select className="select-field w-32">
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Risk Level</span>
            <select className="select-field w-32">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">Notifications</span>
            <button className="btn-secondary">
              Enabled
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account</h3>
        <div className="space-y-4">
          <button className="btn-primary w-full">
            Reset Virtual Balance
          </button>
          <button className="btn-secondary w-full">
            Export Trade History
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'trading':
        return renderTrading();
      case 'analytics':
        return renderAnalytics();
      case 'learn':
        return renderLearn();
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 lg:ml-64 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
