import { NextRequest, NextResponse } from 'next/server';
import { RedisService } from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const leaderboard = await RedisService.getLeaderboard(limit);
    
    // Format leaderboard data
    const formattedLeaderboard = [];
    for (let i = 0; i < leaderboard.length; i += 2) {
      const userId = leaderboard[i];
      const score = leaderboard[i + 1];
      
      // Get user data for display
      const user = await RedisService.getUser(userId as string);
      
      formattedLeaderboard.push({
        rank: Math.floor(i / 2) + 1,
        userId,
        score,
        displayName: user?.displayName || `User ${userId}`,
        totalPnL: score,
      });
    }

    return NextResponse.json({
      success: true,
      data: formattedLeaderboard,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
