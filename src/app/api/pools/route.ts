import { chainsData, supportedChainIds } from '@/constants/chains';
import { getLocalTokenDetails } from '@/helper/token';
import { GraphTopPool, TopPool } from '@/types/pools';
import { formatToken } from '@/utils/address';
import { calculate7DayAverageAPR } from '@/utils/apr';
import { NextResponse } from 'next/server';

/**
 * Fetches top pools data from The Graph subgraph
 * @returns Promise<TopPool[]> - Array of top pools ordered by volume
 */
const fetchTopPoolsFromGraph = async (): Promise<TopPool[]> => {
  const SUBGRAPH_ENDPOINT = chainsData[supportedChainIds.base].subgraphURL;

  const POOLS_QUERY = `
    query GetTopPools {
      pools(
        orderBy: volumeUSD
        orderDirection: desc
        first: 10
      ) {
        id
        volumeUSD
        feeTier
        untrackedVolumeUSD
        totalValueLockedUSD
        poolDayData(
          first: 7
          orderBy: date
          orderDirection: desc
        ) {
          volumeUSD
          date
        }
        poolHourData {
          volumeUSD
        }
        token0 {
          id
          symbol
          decimals
        }
        token1 {
          id
          symbol
          decimals
        }
      }
    }
  `;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add Authorization header if API key is available
    if (process.env.GRAPH_API_KEY) {
      headers.Authorization = `Bearer ${process.env.GRAPH_API_KEY}`;
    }

    const response = await fetch(SUBGRAPH_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: POOLS_QUERY,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data?.pools) {
      console.warn('No pools data received from subgraph');
      return [];
    }

    return transformGraphPoolsToTopPools(result.data.pools);
  } catch (error) {
    console.error('Error fetching top pools from subgraph:', error);
    return [];
  }
};

/**
 * Transforms raw GraphQL pool data to TopPool format
 * @param graphPools - Raw pool data from subgraph
 * @returns TopPool[] - Formatted pool data
 */
const transformGraphPoolsToTopPools = (graphPools: GraphTopPool[]): TopPool[] => {
  return graphPools.map((pool) => {
    const feeTier = parseFloat(pool.feeTier) / 10000;
    const totalValueLockedUSD = parseFloat(pool.totalValueLockedUSD) || 0;

    // Calculate APR using 7-day average for stability
    const apr = calculate7DayAverageAPR(pool.poolDayData || [], feeTier, totalValueLockedUSD);

    const token0Address = formatToken(pool.token0.id);
    const token1Address = formatToken(pool.token1.id);

    const token0LocalInfo = getLocalTokenDetails({ address: token0Address, chainId: supportedChainIds.base });
    const token1LocalInfo = getLocalTokenDetails({ address: token1Address, chainId: supportedChainIds.base });

    return {
      address: formatToken(pool.id),
      volumeUSD: parseFloat(pool.volumeUSD) || 0,
      feeTier,
      apr: Math.round(apr * 100) / 100, // Round to 2 decimal places
      token0: {
        address: formatToken(pool.token0.id),
        symbol: token0LocalInfo?.symbol || pool.token0.symbol,
        decimals: parseInt(pool.token0.decimals, 10),
        logo: token0LocalInfo?.logo || '',
        name: token0LocalInfo?.name || pool.token0.symbol,
      },
      token1: {
        address: formatToken(pool.token1.id),
        symbol: token1LocalInfo?.symbol || pool.token1.symbol,
        decimals: parseInt(pool.token1.decimals, 10),
        logo: token1LocalInfo?.logo || '',
        name: token1LocalInfo?.name || pool.token1.symbol,
      },
    };
  });
};

export async function GET() {
  try {
    const pools = await fetchTopPoolsFromGraph();

    return NextResponse.json(pools);
  } catch (error) {
    console.error('Error in pools API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
