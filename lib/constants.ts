export const INITIAL_VIRTUAL_BALANCE = 10000; // $10,000 starting balance

export const SUPPORTED_ASSETS = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { symbol: 'BASE', name: 'Base', icon: '🔵' },
  { symbol: 'USDC', name: 'USD Coin', icon: '$' },
] as const;

export const TRADING_STRATEGIES = [
  'Day Trading',
  'Swing Trading',
  'Scalping',
  'HODLing',
  'DCA (Dollar Cost Averaging)',
  'Technical Analysis',
  'Fundamental Analysis',
] as const;

export const LEARNING_MODULES = [
  {
    moduleId: '1',
    title: 'Trading Basics',
    content: 'Learn the fundamentals of cryptocurrency trading, including market orders, limit orders, and basic terminology.',
    type: 'text' as const,
    difficulty: 'beginner' as const,
    duration: 15,
  },
  {
    moduleId: '2',
    title: 'Technical Analysis 101',
    content: 'Understanding charts, candlesticks, support and resistance levels, and basic technical indicators.',
    type: 'text' as const,
    difficulty: 'beginner' as const,
    duration: 25,
  },
  {
    moduleId: '3',
    title: 'Risk Management',
    content: 'Learn how to manage risk, set stop losses, and position sizing for sustainable trading.',
    type: 'text' as const,
    difficulty: 'intermediate' as const,
    duration: 20,
  },
  {
    moduleId: '4',
    title: 'Advanced Trading Strategies',
    content: 'Explore advanced strategies like arbitrage, momentum trading, and mean reversion.',
    type: 'text' as const,
    difficulty: 'advanced' as const,
    duration: 35,
  },
];

export const MOCK_MARKET_DATA = [
  {
    symbol: 'BTC',
    price: 43250.75,
    change24h: 1250.30,
    changePercent24h: 2.98,
    volume24h: 28500000000,
    marketCap: 847000000000,
    high24h: 43800.00,
    low24h: 41900.50,
    lastUpdated: new Date(),
  },
  {
    symbol: 'ETH',
    price: 2650.40,
    change24h: -85.20,
    changePercent24h: -3.11,
    volume24h: 15200000000,
    marketCap: 318000000000,
    high24h: 2750.80,
    low24h: 2620.15,
    lastUpdated: new Date(),
  },
  {
    symbol: 'BASE',
    price: 1.85,
    change24h: 0.12,
    changePercent24h: 6.94,
    volume24h: 125000000,
    marketCap: 1850000000,
    high24h: 1.92,
    low24h: 1.71,
    lastUpdated: new Date(),
  },
  {
    symbol: 'USDC',
    price: 1.00,
    change24h: 0.001,
    changePercent24h: 0.10,
    volume24h: 5800000000,
    marketCap: 32000000000,
    high24h: 1.002,
    low24h: 0.998,
    lastUpdated: new Date(),
  },
];
