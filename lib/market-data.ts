import { MarketData, CandlestickData } from './types';
import { RedisService } from './redis';

// CoinGecko API configuration
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';
const CACHE_DURATION = 60; // 1 minute cache

// Symbol mapping for CoinGecko IDs
const SYMBOL_TO_COINGECKO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BASE: 'base',
  USDC: 'usd-coin',
};

export class MarketDataService {
  private static async fetchFromCoinGecko(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${COINGECKO_API_BASE}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('CoinGecko API error:', error);
      throw error;
    }
  }

  static async getCurrentPrices(symbols: string[]): Promise<MarketData[]> {
    try {
      // Check cache first
      const cachedData = await Promise.all(
        symbols.map(symbol => RedisService.getCachedMarketData(symbol))
      );

      const uncachedSymbols = symbols.filter((symbol, index) => !cachedData[index]);
      
      if (uncachedSymbols.length === 0) {
        return cachedData.filter(Boolean) as MarketData[];
      }

      // Fetch uncached data from CoinGecko
      const coinGeckoIds = uncachedSymbols
        .map(symbol => SYMBOL_TO_COINGECKO_ID[symbol])
        .filter(Boolean);

      if (coinGeckoIds.length === 0) {
        return cachedData.filter(Boolean) as MarketData[];
      }

      const data = await this.fetchFromCoinGecko(
        `/simple/price?ids=${coinGeckoIds.join(',')}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );

      const marketData: MarketData[] = [];

      for (const symbol of uncachedSymbols) {
        const coinGeckoId = SYMBOL_TO_COINGECKO_ID[symbol];
        const coinData = data[coinGeckoId];

        if (coinData) {
          const marketDataItem: MarketData = {
            symbol,
            price: coinData.usd || 0,
            change24h: coinData.usd_24h_change || 0,
            changePercent24h: coinData.usd_24h_change || 0,
            volume24h: coinData.usd_24h_vol || 0,
            marketCap: coinData.usd_market_cap || 0,
            high24h: coinData.usd * 1.05, // Approximate high (CoinGecko simple API doesn't include this)
            low24h: coinData.usd * 0.95, // Approximate low
            lastUpdated: new Date(),
          };

          marketData.push(marketDataItem);
          
          // Cache the data
          await RedisService.cacheMarketData(symbol, marketDataItem, CACHE_DURATION);
        }
      }

      // Combine cached and fresh data
      const allData = [...cachedData.filter(Boolean), ...marketData] as MarketData[];
      return allData;
    } catch (error) {
      console.error('Error fetching market data:', error);
      
      // Return cached data if available, otherwise return mock data
      const fallbackData = await Promise.all(
        symbols.map(async (symbol) => {
          const cached = await RedisService.getCachedMarketData(symbol);
          return cached || this.getMockData(symbol);
        })
      );

      return fallbackData.filter(Boolean) as MarketData[];
    }
  }

  static async getHistoricalData(symbol: string, days: number = 30): Promise<CandlestickData[]> {
    try {
      const coinGeckoId = SYMBOL_TO_COINGECKO_ID[symbol];
      if (!coinGeckoId) {
        throw new Error(`Unsupported symbol: ${symbol}`);
      }

      const data = await this.fetchFromCoinGecko(
        `/coins/${coinGeckoId}/ohlc?vs_currency=usd&days=${days}`
      );

      return data.map((item: number[]) => ({
        timestamp: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
        volume: 0, // OHLC endpoint doesn't include volume
      }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      
      // Return mock historical data
      return this.generateMockHistoricalData(symbol, days);
    }
  }

  static async getDetailedMarketData(symbols: string[]): Promise<MarketData[]> {
    try {
      const coinGeckoIds = symbols
        .map(symbol => SYMBOL_TO_COINGECKO_ID[symbol])
        .filter(Boolean);

      if (coinGeckoIds.length === 0) {
        return [];
      }

      const data = await this.fetchFromCoinGecko(
        `/coins/markets?vs_currency=usd&ids=${coinGeckoIds.join(',')}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );

      return data.map((coin: any) => {
        const symbol = Object.keys(SYMBOL_TO_COINGECKO_ID).find(
          key => SYMBOL_TO_COINGECKO_ID[key] === coin.id
        ) || coin.symbol.toUpperCase();

        return {
          symbol,
          price: coin.current_price || 0,
          change24h: coin.price_change_24h || 0,
          changePercent24h: coin.price_change_percentage_24h || 0,
          volume24h: coin.total_volume || 0,
          marketCap: coin.market_cap || 0,
          high24h: coin.high_24h || coin.current_price * 1.05,
          low24h: coin.low_24h || coin.current_price * 0.95,
          lastUpdated: new Date(),
        };
      });
    } catch (error) {
      console.error('Error fetching detailed market data:', error);
      return symbols.map(symbol => this.getMockData(symbol));
    }
  }

  private static getMockData(symbol: string): MarketData {
    const mockPrices: Record<string, number> = {
      BTC: 43250.75,
      ETH: 2650.40,
      BASE: 1.85,
      USDC: 1.00,
    };

    const basePrice = mockPrices[symbol] || 100;
    const change = (Math.random() - 0.5) * basePrice * 0.1;

    return {
      symbol,
      price: basePrice + change,
      change24h: change,
      changePercent24h: (change / basePrice) * 100,
      volume24h: Math.random() * 1000000000,
      marketCap: Math.random() * 100000000000,
      high24h: basePrice + Math.abs(change) * 1.2,
      low24h: basePrice - Math.abs(change) * 1.2,
      lastUpdated: new Date(),
    };
  }

  private static generateMockHistoricalData(symbol: string, days: number): CandlestickData[] {
    const data: CandlestickData[] = [];
    const basePrice = symbol === 'BTC' ? 43000 : symbol === 'ETH' ? 2600 : 100;
    let currentPrice = basePrice;

    for (let i = days; i >= 0; i--) {
      const timestamp = Date.now() - (i * 24 * 60 * 60 * 1000);
      const volatility = 0.02; // 2% daily volatility
      
      const change = (Math.random() - 0.5) * currentPrice * volatility;
      const open = currentPrice;
      const close = currentPrice + change;
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.random() * 1000000;

      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume,
      });

      currentPrice = close;
    }

    return data;
  }

  static async refreshAllMarketData(): Promise<void> {
    try {
      const symbols = Object.keys(SYMBOL_TO_COINGECKO_ID);
      await this.getCurrentPrices(symbols);
    } catch (error) {
      console.error('Error refreshing market data:', error);
    }
  }
}

// Utility function to format price changes
export function formatPriceChange(change: number, isPercentage: boolean = false): string {
  const prefix = change >= 0 ? '+' : '';
  const suffix = isPercentage ? '%' : '';
  return `${prefix}${change.toFixed(2)}${suffix}`;
}

// Utility function to determine price trend
export function getPriceTrend(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}
