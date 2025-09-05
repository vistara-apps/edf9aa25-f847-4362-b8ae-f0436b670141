import { User, Trade, PortfolioMetrics } from './types';

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// API client class for making requests
export class ApiClient {
  private static baseUrl = '/api';

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // User API methods
  static async getUser(userId: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`);
  }

  static async createUser(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Trade API methods
  static async getTrades(userId: string): Promise<ApiResponse<Trade[]>> {
    return this.request<Trade[]>(`/trades?userId=${userId}`);
  }

  static async createTrade(trade: Omit<Trade, 'tradeId'>): Promise<ApiResponse<Trade>> {
    return this.request<Trade>('/trades', {
      method: 'POST',
      body: JSON.stringify(trade),
    });
  }

  static async updateTrade(tradeId: string, updates: Partial<Trade>): Promise<ApiResponse<Trade>> {
    return this.request<Trade>(`/trades/${tradeId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  static async closeTrade(tradeId: string, exitPrice: number): Promise<ApiResponse<Trade>> {
    return this.request<Trade>(`/trades/${tradeId}/close`, {
      method: 'POST',
      body: JSON.stringify({ exitPrice }),
    });
  }

  // Analytics API methods
  static async getAnalytics(userId: string): Promise<ApiResponse<PortfolioMetrics>> {
    return this.request<PortfolioMetrics>(`/analytics/${userId}`);
  }

  static async getLeaderboard(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/analytics/leaderboard?limit=${limit}`);
  }

  // Market data API methods
  static async getMarketData(symbols?: string[]): Promise<ApiResponse<any[]>> {
    const query = symbols ? `?symbols=${symbols.join(',')}` : '';
    return this.request<any[]>(`/market${query}`);
  }

  static async getHistoricalData(symbol: string, days: number = 30): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/market/${symbol}/history?days=${days}`);
  }

  // Learning API methods
  static async getLearningProgress(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/learning/${userId}`);
  }

  static async updateLearningProgress(
    userId: string,
    moduleId: string,
    progress: any
  ): Promise<ApiResponse<any>> {
    return this.request<any>(`/learning/${userId}/${moduleId}`, {
      method: 'PUT',
      body: JSON.stringify(progress),
    });
  }
}

// Utility functions for API error handling
export function handleApiError(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
}

// Retry utility for failed requests
export async function retryRequest<T>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await requestFn();
      if (result.success) return result;
      lastError = result.error;
    } catch (error) {
      lastError = error;
    }

    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  return {
    success: false,
    error: handleApiError(lastError),
  };
}

// Request queue for managing concurrent requests
class RequestQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private maxConcurrent = 5;
  private active = 0;

  async add<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          this.active++;
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.active--;
          this.processNext();
        }
      });

      this.processNext();
    });
  }

  private processNext() {
    if (this.active >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const nextRequest = this.queue.shift();
    if (nextRequest) {
      nextRequest();
    }
  }
}

export const requestQueue = new RequestQueue();
