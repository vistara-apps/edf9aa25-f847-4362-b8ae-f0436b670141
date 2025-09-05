import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis environment variables');
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Redis key patterns
export const REDIS_KEYS = {
  user: (userId: string) => `user:${userId}`,
  userTrades: (userId: string) => `user:${userId}:trades`,
  userAnalytics: (userId: string) => `user:${userId}:analytics`,
  marketData: (symbol: string) => `market:${symbol}`,
  marketDataCache: 'market:cache',
  leaderboard: 'leaderboard',
  learningProgress: (userId: string) => `learning:${userId}`,
} as const;

// Helper functions for Redis operations
export class RedisService {
  static async getUser(userId: string) {
    try {
      const user = await redis.get(REDIS_KEYS.user(userId));
      return user;
    } catch (error) {
      console.error('Redis getUser error:', error);
      return null;
    }
  }

  static async setUser(userId: string, userData: any) {
    try {
      await redis.set(REDIS_KEYS.user(userId), userData);
      return true;
    } catch (error) {
      console.error('Redis setUser error:', error);
      return false;
    }
  }

  static async getUserTrades(userId: string) {
    try {
      const trades = await redis.lrange(REDIS_KEYS.userTrades(userId), 0, -1);
      return trades.map(trade => typeof trade === 'string' ? JSON.parse(trade) : trade);
    } catch (error) {
      console.error('Redis getUserTrades error:', error);
      return [];
    }
  }

  static async addTrade(userId: string, trade: any) {
    try {
      await redis.lpush(REDIS_KEYS.userTrades(userId), JSON.stringify(trade));
      // Keep only last 1000 trades per user
      await redis.ltrim(REDIS_KEYS.userTrades(userId), 0, 999);
      return true;
    } catch (error) {
      console.error('Redis addTrade error:', error);
      return false;
    }
  }

  static async updateUserAnalytics(userId: string, analytics: any) {
    try {
      await redis.set(REDIS_KEYS.userAnalytics(userId), analytics);
      return true;
    } catch (error) {
      console.error('Redis updateUserAnalytics error:', error);
      return false;
    }
  }

  static async getUserAnalytics(userId: string) {
    try {
      const analytics = await redis.get(REDIS_KEYS.userAnalytics(userId));
      return analytics;
    } catch (error) {
      console.error('Redis getUserAnalytics error:', error);
      return null;
    }
  }

  static async cacheMarketData(symbol: string, data: any, ttl: number = 60) {
    try {
      await redis.setex(REDIS_KEYS.marketData(symbol), ttl, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Redis cacheMarketData error:', error);
      return false;
    }
  }

  static async getCachedMarketData(symbol: string) {
    try {
      const data = await redis.get(REDIS_KEYS.marketData(symbol));
      return data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
    } catch (error) {
      console.error('Redis getCachedMarketData error:', error);
      return null;
    }
  }

  static async updateLeaderboard(userId: string, score: number) {
    try {
      await redis.zadd(REDIS_KEYS.leaderboard, { score, member: userId });
      return true;
    } catch (error) {
      console.error('Redis updateLeaderboard error:', error);
      return false;
    }
  }

  static async getLeaderboard(limit: number = 10) {
    try {
      const leaderboard = await redis.zrevrange(REDIS_KEYS.leaderboard, 0, limit - 1, {
        withScores: true,
      });
      return leaderboard;
    } catch (error) {
      console.error('Redis getLeaderboard error:', error);
      return [];
    }
  }

  static async setLearningProgress(userId: string, moduleId: string, progress: any) {
    try {
      await redis.hset(REDIS_KEYS.learningProgress(userId), { [moduleId]: JSON.stringify(progress) });
      return true;
    } catch (error) {
      console.error('Redis setLearningProgress error:', error);
      return false;
    }
  }

  static async getLearningProgress(userId: string) {
    try {
      const progress = await redis.hgetall(REDIS_KEYS.learningProgress(userId));
      const parsed: Record<string, any> = {};
      for (const [key, value] of Object.entries(progress)) {
        parsed[key] = typeof value === 'string' ? JSON.parse(value) : value;
      }
      return parsed;
    } catch (error) {
      console.error('Redis getLearningProgress error:', error);
      return {};
    }
  }
}
