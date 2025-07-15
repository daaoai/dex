import { NextRequest, NextResponse } from 'next/server';
import { chainsData, supportedChainIds } from '@/constants/chains';

export async function GET(request: NextRequest, { params }: { params: Promise<{ poolId: string }> }) {
  const { poolId } = await params;
  if (!poolId) {
    return NextResponse.json({ error: 'Pool ID is required' }, { status: 400 });
  }

  const SUBGRAPH_ENDPOINT = chainsData[supportedChainIds.bsc].subgraphURL;

  const TICK_LIQUIDITY_QUERY = `
    query GetPoolTicks($poolId: ID!) {
      pool(id: $poolId) {
        ticks(first: 1000, orderBy: tickIdx, orderDirection: asc) {
          tickIdx
          liquidityNet
          price0
        }
      }
    }
  `;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (process.env.GRAPH_API_KEY) {
      headers.Authorization = `Bearer ${process.env.GRAPH_API_KEY}`;
    }

    const response = await fetch(SUBGRAPH_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: TICK_LIQUIDITY_QUERY,
        variables: { poolId: poolId.toLowerCase() },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `HTTP error! status: ${response.status}` }, { status: 500 });
    }

    const result = await response.json();
    const ticks = result?.data?.pool?.ticks || [];
    // Return as array of { tickIdx, liquidityNet, price0 }
    return NextResponse.json(ticks);
  } catch (error) {
    console.error('Error fetching tick liquidity from subgraph:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
