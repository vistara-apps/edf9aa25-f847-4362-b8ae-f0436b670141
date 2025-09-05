import { NextRequest, NextResponse } from 'next/server';
import { MarketDataService } from '@/lib/market-data';
import { SUPPORTED_ASSETS } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbolsParam = searchParams.get('symbols');
    
    // Use provided symbols or default to all supported assets
    const symbols = symbolsParam 
      ? symbolsParam.split(',').map(s => s.trim().toUpperCase())
      : SUPPORTED_ASSETS.map(asset => asset.symbol);

    const marketData = await MarketDataService.getCurrentPrices(symbols);

    return NextResponse.json({
      success: true,
      data: marketData,
    });
  } catch (error) {
    console.error('Market data API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch market data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Refresh all market data
    await MarketDataService.refreshAllMarketData();

    return NextResponse.json({
      success: true,
      message: 'Market data refreshed successfully',
    });
  } catch (error) {
    console.error('Market data refresh error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh market data' },
      { status: 500 }
    );
  }
}
