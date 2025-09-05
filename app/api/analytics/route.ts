import { NextRequest, NextResponse } from 'next/server';
import { RedisService } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const analytics = await RedisService.getUserAnalytics(userId);
    
    if (!analytics) {
      // Return default analytics if none exist
      const defaultAnalytics = {
        totalValue: 10000,
        totalPnL: 0,
        totalPnLPercent: 0,
        winRate: 0,
        totalTrades: 0,
        avgTradeSize: 0,
        bestTrade: 0,
        worstTrade: 0,
      };

      return NextResponse.json({
        success: true,
        data: defaultAnalytics,
      });
    }

    return NextResponse.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
