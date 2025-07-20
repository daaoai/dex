import { NextRequest, NextResponse } from 'next/server';
import { fetchPositionPriceData } from '@/services/subgraph/fetchPositionPriceData';
import { HistoryDuration } from '@/types/positions';

export async function GET(request: NextRequest, { params }: { params: Promise<{ poolAddress: string }> }) {
  try {
    const { poolAddress } = await params;
    const { searchParams } = new URL(request.url);
    const duration = (searchParams.get('duration') || 'WEEK') as HistoryDuration;

    if (!poolAddress) {
      return NextResponse.json({ error: 'Pool address is required' }, { status: 400 });
    }

    const validDurations: HistoryDuration[] = ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'];
    if (!validDurations.includes(duration)) {
      return NextResponse.json(
        {
          error: 'Invalid duration. Must be one of: HOUR, DAY, WEEK, MONTH, YEAR',
        },
        { status: 400 },
      );
    }

    const priceData = await fetchPositionPriceData(poolAddress, duration);

    if (!priceData) {
      return NextResponse.json({ error: 'Price data not found' }, { status: 404 });
    }

    return NextResponse.json(priceData);
  } catch (error) {
    console.error('Error in position price data API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
