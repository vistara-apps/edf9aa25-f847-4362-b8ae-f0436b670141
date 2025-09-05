import { NextRequest, NextResponse } from 'next/server';
import { RedisService } from '@/lib/redis';
import { User } from '@/lib/types';
import { INITIAL_VIRTUAL_BALANCE } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...userData } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await RedisService.getUser(userId);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists' },
        { status: 409 }
      );
    }

    // Create new user with default values
    const newUser: User = {
      userId,
      virtualBalance: INITIAL_VIRTUAL_BALANCE,
      tradeHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData,
    };

    const success = await RedisService.setUser(userId, newUser);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Initialize user analytics
    const initialAnalytics = {
      totalValue: INITIAL_VIRTUAL_BALANCE,
      totalPnL: 0,
      totalPnLPercent: 0,
      winRate: 0,
      totalTrades: 0,
      avgTradeSize: 0,
      bestTrade: 0,
      worstTrade: 0,
    };

    await RedisService.updateUserAnalytics(userId, initialAnalytics);

    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const user = await RedisService.getUser(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
