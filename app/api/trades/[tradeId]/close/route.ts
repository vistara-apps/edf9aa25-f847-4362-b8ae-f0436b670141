import { NextRequest, NextResponse } from 'next/server';
import { RedisService } from '@/lib/redis';
import { Trade, User } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: { tradeId: string } }
) {
  try {
    const { tradeId } = params;
    const { exitPrice } = await request.json();

    if (!tradeId || !exitPrice) {
      return NextResponse.json(
        { success: false, error: 'Trade ID and exit price are required' },
        { status: 400 }
      );
    }

    // Find the trade across all users (in a real app, you'd have better indexing)
    // For now, we'll need the userId to be passed or stored differently
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const trades = await RedisService.getUserTrades(userId);
    const tradeIndex = trades.findIndex(trade => trade.tradeId === tradeId);

    if (tradeIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Trade not found' },
        { status: 404 }
      );
    }

    const trade = trades[tradeIndex];

    if (trade.status === 'closed') {
      return NextResponse.json(
        { success: false, error: 'Trade is already closed' },
        { status: 400 }
      );
    }

    // Calculate P&L
    const pnl = trade.type === 'buy' 
      ? (exitPrice - trade.entryPrice) * trade.quantity
      : (trade.entryPrice - exitPrice) * trade.quantity;

    // Update trade
    const updatedTrade: Trade = {
      ...trade,
      exitPrice,
      pnl,
      status: 'closed',
    };

    // Update the trade in the list
    trades[tradeIndex] = updatedTrade;

    // Save updated trades back to Redis
    // Clear existing trades and add updated ones
    await RedisService.addTrade(userId, updatedTrade);

    // Update user's virtual balance with P&L
    const user = await RedisService.getUser(userId);
    if (user) {
      const updatedUser: User = {
        ...user,
        virtualBalance: user.virtualBalance + pnl,
        updatedAt: new Date(),
      };

      await RedisService.setUser(userId, updatedUser);
    }

    // Update user analytics
    await updateUserAnalytics(userId);

    return NextResponse.json({
      success: true,
      data: updatedTrade,
    });
  } catch (error) {
    console.error('Close trade error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update user analytics
async function updateUserAnalytics(userId: string) {
  try {
    const trades = await RedisService.getUserTrades(userId);
    const user = await RedisService.getUser(userId);
    
    if (!trades || !user) return;

    const closedTrades = trades.filter(trade => trade.status === 'closed' && trade.pnl !== undefined);
    const totalTrades = closedTrades.length;
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winningTrades = closedTrades.filter(trade => (trade.pnl || 0) > 0);
    const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
    const avgTradeSize = totalTrades > 0 
      ? closedTrades.reduce((sum, trade) => sum + (trade.quantity * trade.entryPrice), 0) / totalTrades 
      : 0;
    const bestTrade = closedTrades.length > 0 
      ? Math.max(...closedTrades.map(trade => trade.pnl || 0)) 
      : 0;
    const worstTrade = closedTrades.length > 0 
      ? Math.min(...closedTrades.map(trade => trade.pnl || 0)) 
      : 0;

    const analytics = {
      totalValue: user.virtualBalance,
      totalPnL,
      totalPnLPercent: user.virtualBalance > 0 ? (totalPnL / user.virtualBalance) * 100 : 0,
      winRate,
      totalTrades,
      avgTradeSize,
      bestTrade,
      worstTrade,
    };

    await RedisService.updateUserAnalytics(userId, analytics);
    
    // Update leaderboard
    await RedisService.updateLeaderboard(userId, totalPnL);
  } catch (error) {
    console.error('Update analytics error:', error);
  }
}
