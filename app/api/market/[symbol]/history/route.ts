import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '@/lib/market-data';

export async function GET(
  request: NextRequest,
  { params }: { params: { symbol: string } }
) {
  try {
    const { symbol } = params;
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    if (!symbol) {
      return NextResponse.json(
        { success: false, error: 'Symbol is required' },
        { status: 400 }
      );
    }

    const historicalData = await MarketDataService.getHistoricalData(
      symbol.toUpperCase(),
      days
    );

    return NextResponse.json({
      success: true,
      data: historicalData,
    });
  } catch (error) {
    console.error('Historical data API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch historical data' },
      { status: 500 }
    );
  }
}
