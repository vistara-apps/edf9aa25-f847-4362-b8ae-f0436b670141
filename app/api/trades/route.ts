import { NextRequest, NextResponse } from 'next/server';
import { RedisService } from '@/lib/redis';
import { Trade, User } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

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

    const trades = await RedisService.getUserTrades(userId);
    
    return NextResponse.json({
      success: true,
      data: trades,
    });
  } catch (error) {
    console.error('Get trades error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, symbol, type, quantity, entryPrice, strategyUsed } = body;

    // Validate required fields
    if (!userId || !symbol || !type || !quantity || !entryPrice) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate trade type
    if (!['buy', 'sell'].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid trade type' },
        { status: 400 }
      );
    }

    // Get user to check balance
    const user = await RedisService.getUser(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate trade value
    const tradeValue = quantity * entryPrice;

    // Check if user has sufficient balance for buy orders
    if (type === 'buy' && user.virtualBalance < tradeValue) {
      return NextResponse.json(
        { success: false, error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Create new trade
    const newTrade: Trade = {
      tradeId: uuidv4(),
      userId,
      symbol,
      type,
      quantity,
      entryPrice,
      timestamp: new Date(),
      status: 'open',
      strategyUsed,
    };

    // Add trade to user's trade history
    const tradeSuccess = await RedisService.addTrade(userId, newTrade);
    if (!tradeSuccess) {
      return NextResponse.json(
        { success: false, error: 'Failed to create trade' },
        { status: 500 }
      );
    }

    // Update user's virtual balance
    const newBalance = type === 'buy' 
      ? user.virtualBalance - tradeValue 
      : user.virtualBalance + tradeValue;

    const updatedUser: User = {
      ...user,
      virtualBalance: newBalance,
      updatedAt: new Date(),
    };

    await RedisService.setUser(userId, updatedUser);

    // Update user analytics
    await updateUserAnalytics(userId);

    return NextResponse.json({
      success: true,
      data: newTrade,
    });
  } catch (error) {
    console.error('Create trade error:', error);
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
