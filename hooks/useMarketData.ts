import { useState, useEffect, useCallback } from 'react';
import { MarketData, CandlestickData } from '@/lib/types';
import { ApiClient } from '@/lib/api';

interface UseMarketDataReturn {
  data: MarketData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useMarketData(symbols?: string[]): UseMarketDataReturn {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.getMarketData(symbols);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch market data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refresh };
}

interface UseHistoricalDataReturn {
  data: CandlestickData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useHistoricalData(symbol: string, days: number = 30): UseHistoricalDataReturn {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!symbol) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.getHistoricalData(symbol, days);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch historical data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [symbol, days]);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh };
}

// Hook for real-time price updates
export function useRealTimePrice(symbol: string) {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!symbol) return;

    const fetchPrice = async () => {
      try {
        const response = await ApiClient.getMarketData([symbol]);
        if (response.success && response.data && response.data.length > 0) {
          const marketData = response.data[0];
          setPrice(marketData.price);
          setChange(marketData.changePercent24h);
        }
      } catch (error) {
        console.error('Error fetching real-time price:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    
    // Update every 10 seconds for real-time feel
    const interval = setInterval(fetchPrice, 10000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  return { price, change, loading };
}

// Hook for market overview data
export function useMarketOverview() {
  const { data, loading, error, refresh } = useMarketData();
  
  const totalMarketCap = data.reduce((sum, item) => sum + item.marketCap, 0);
  const totalVolume = data.reduce((sum, item) => sum + item.volume24h, 0);
  const gainers = data.filter(item => item.changePercent24h > 0).length;
  const losers = data.filter(item => item.changePercent24h < 0).length;

  return {
    data,
    loading,
    error,
    refresh,
    stats: {
      totalMarketCap,
      totalVolume,
      gainers,
      losers,
    },
  };
}
