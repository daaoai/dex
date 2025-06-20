import { GraphTopPool, TopPool } from '@/types/pools';
import { formatToken } from '@/utils/address';
import { calculate7DayAverageAPR } from '@/utils/apr';

/**
 * Fetches top pools data from The Graph subgraph
 * @returns Promise<TopPool[]> - Array of top pools ordered by volume
 */
export const fetchTopPoolsFromGraph = async (): Promise<TopPool[]> => {
  const SUBGRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/113461/bnb-v-3-subgraph/version/latest';

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
    const response = await fetch(SUBGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.NEXT_PUBLIC_GRAPH_API_KEY && {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPH_API_KEY}`,
        }),
      },
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

    return {
      id: formatToken(pool.id),
      volumeUSD: parseFloat(pool.volumeUSD) || 0,
      feeTier,
      apr: Math.round(apr * 100) / 100, // Round to 2 decimal places
      token0: {
        id: formatToken(pool.token0.id),
        symbol: pool.token0.symbol,
        decimals: parseInt(pool.token0.decimals, 10),
      },
      token1: {
        id: formatToken(pool.token1.id),
        symbol: pool.token1.symbol,
        decimals: parseInt(pool.token1.decimals, 10),
      },
    };
  });
};
