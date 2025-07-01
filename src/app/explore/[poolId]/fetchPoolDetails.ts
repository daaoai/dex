import { supportedChainIds } from '@/constants/chains';
import { getLocalTokenDetails } from '@/helper/token';
import { GraphPoolDetails, PoolDetails, Transaction } from '@/types/pools';
import { formatToken } from '@/utils/address';

/**
 * Fetches detailed pool data from The Graph subgraph
 * @param poolId - The pool ID to fetch details for
 * @returns Promise<PoolDetails | null> - Detailed pool data or null if not found
 */
export const fetchPoolDetails = async (poolId: string): Promise<PoolDetails | null> => {
  const SUBGRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/113461/bnb-v-3-subgraph/version/latest';

  const POOL_DETAILS_QUERY = `
    query GetPoolDetails($poolId: ID!) {
      pool(id: $poolId) {
        id
        volumeUSD
        feeTier
        totalValueLockedUSD
        totalValueLockedToken0
        totalValueLockedToken1
        token0Price
        token1Price
        sqrtPrice
        tick
        poolDayData(
          first: 30
          orderBy: date
          orderDirection: desc
        ) {
          volumeUSD
          date
          close
          high
          low
          open
        }
        poolHourData(
          first: 24
          orderBy: periodStartUnix
          orderDirection: desc
        ) {
          volumeUSD
          periodStartUnix
          close
          high
          low
          open
        }
        swaps(
          first: 20
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          timestamp
          amount0
          amount1
          amountUSD
          sender
          recipient
          transaction {
            id
          }
        }
        token0 {
          id
          symbol
          decimals
          name
        }
        token1 {
          id
          symbol
          decimals
          name
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
        query: POOL_DETAILS_QUERY,
        variables: { poolId: poolId.toLowerCase() }, // Ensure poolId is in lowercase
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data?.pool) {
      console.warn(`No pool data received for pool ID: ${poolId}`);
      return null;
    }

    return transformGraphPoolToPoolDetails(result.data.pool);
  } catch (error) {
    console.error('Error fetching pool details from subgraph:', error);
    return null;
  }
};

/**
 * Transforms raw GraphQL pool data to PoolDetails format
 * @param graphPool - Raw pool data from subgraph
 * @returns PoolDetails - Formatted pool details
 */
const transformGraphPoolToPoolDetails = (graphPool: GraphPoolDetails): PoolDetails => {
  const feeTier = parseFloat(graphPool.feeTier) / 10000;
  const totalValueLockedUSD = parseFloat(graphPool.totalValueLockedUSD) || 0;

  // Calculate current price based on token0Price
  const currentPrice = parseFloat(graphPool.token0Price) || 0;

  // Calculate 24h volume and change
  const dayData = graphPool.poolDayData || [];
  const todayVolume = dayData[0] ? parseFloat(dayData[0].volumeUSD) : 0;
  const yesterdayVolume = dayData[1] ? parseFloat(dayData[1].volumeUSD) : 0;
  const volumeChange = yesterdayVolume > 0 ? ((todayVolume - yesterdayVolume) / yesterdayVolume) * 100 : 0;

  // Calculate TVL change
  const todayTVL = dayData[0] ? parseFloat(dayData[0].totalValueLockedUSD) : totalValueLockedUSD;
  const yesterdayTVL = dayData[1] ? parseFloat(dayData[1].totalValueLockedUSD) : totalValueLockedUSD;
  const tvlChange = yesterdayTVL > 0 ? ((todayTVL - yesterdayTVL) / yesterdayTVL) * 100 : 0;

  // Transform chart data from poolDayData
  const chartData = (graphPool.poolDayData || [])
    .slice(0, 7)
    .reverse()
    .map((dayData, index) => {
      // Try multiple price sources
      const prices = [
        parseFloat(dayData.close),
        parseFloat(dayData.open),
        parseFloat(dayData.high),
        parseFloat(dayData.low),
        currentPrice,
      ].filter((price) => !isNaN(price) && price > 0);

      // Use the first valid price
      const price = prices.length > 0 ? prices[0] : 1;

      return {
        x: index,
        y: price,
        timestamp: dayData.date * 1000,
      };
    })
    .filter((point) => !isNaN(point.y) && isFinite(point.y) && point.y > 0);

  // Transform transactions
  const transactions: Transaction[] = (graphPool.swaps || []).map((swap) => {
    const timestamp = parseInt(swap.timestamp);
    const now = Date.now() / 1000;
    const timeDiff = now - timestamp;

    let timeAgo = '';
    if (timeDiff < 3600) {
      timeAgo = `${Math.floor(timeDiff / 60)}m`;
    } else if (timeDiff < 86400) {
      timeAgo = `${Math.floor(timeDiff / 3600)}h`;
    } else {
      timeAgo = `${Math.floor(timeDiff / 86400)}d`;
    }

    const amount0 = parseFloat(swap.amount0);
    const amount1 = parseFloat(swap.amount1);
    const usd = parseFloat(swap.amountUSD);

    return {
      timeAgo,
      type: amount0 > 0 ? 'Buy' : 'Sell',
      usd,
      token0Amount: Math.abs(amount0),
      token1Amount: Math.abs(amount1),
      wallet: `${swap.sender.slice(0, 6)}...${swap.sender.slice(-4)}`,
    };
  });

  // Calculate simple APR based on fees and TVL
  const dailyVolume = todayVolume;
  const dailyFees = dailyVolume * feeTier;
  const apr = totalValueLockedUSD > 0 ? ((dailyFees * 365) / totalValueLockedUSD) * 100 : 0;
  const token0Decimals = parseInt(graphPool.token0.decimals, 10);
  const token1Decimals = parseInt(graphPool.token1.decimals, 10);

  const formattedToken0Balance = graphPool.totalValueLockedToken0 || '0';
  const formattedToken1Balance = graphPool.totalValueLockedToken1 || '0';

  const token0BalanceUSD = parseFloat(formattedToken0Balance) * parseFloat(graphPool.token0Price);
  const token1BalanceUSD = parseFloat(formattedToken1Balance) * parseFloat(graphPool.token1Price);
  const totalValueUSD = token0BalanceUSD + token1BalanceUSD;

  const poolBalances = {
    token0: formattedToken0Balance,
    token1: formattedToken1Balance,
    token0Percentage: totalValueUSD > 0 && isFinite(token0BalanceUSD) ? (token0BalanceUSD / totalValueUSD) * 100 : 50,
    token1Percentage: totalValueUSD > 0 && isFinite(token1BalanceUSD) ? (token1BalanceUSD / totalValueUSD) * 100 : 50,
  };

  // Ensure all numeric values are safe and finite to prevent NaN/hydration issues
  const safeCurrentPrice = isFinite(currentPrice) ? currentPrice : 0;
  const safeFeeTier = isFinite(feeTier) ? feeTier : 0;
  const safeApr = isFinite(apr) ? apr : 0;
  const safeTotalValueLockedUSD = isFinite(totalValueLockedUSD) ? totalValueLockedUSD : 0;
  const safeTvlChange = isFinite(tvlChange) ? tvlChange : 0;
  const safeTodayVolume = isFinite(todayVolume) ? todayVolume : 0;
  const safeVolumeChange = isFinite(volumeChange) ? volumeChange : 0;
  const safeDailyFees = isFinite(dailyFees) ? dailyFees : 0;

  const token0Address = formatToken(graphPool.token0.id);
  const token1Address = formatToken(graphPool.token1.id);

  const token0LocalInfo = getLocalTokenDetails({ address: token0Address, chainId: supportedChainIds.bsc });
  const token1LocalInfo = getLocalTokenDetails({ address: token1Address, chainId: supportedChainIds.bsc });

  return {
    address: formatToken(graphPool.id),
    price: safeCurrentPrice,
    feeTier: safeFeeTier,
    apr: safeApr,
    tvl: safeTotalValueLockedUSD.toFixed(2),
    tvlChange: safeTvlChange,
    volume24h: safeTodayVolume.toFixed(2),
    volumeChange: safeVolumeChange,
    fees24h: (safeDailyFees / 1000).toFixed(2),
    poolBalances,
    chartData,
    transactions,
    token0: {
      address: formatToken(graphPool.token0.id),
      symbol: graphPool.token0.symbol,
      decimals: token0Decimals,
      name: graphPool.token0.name,
      logo: token0LocalInfo?.logo || '',
    },
    token1: {
      address: formatToken(graphPool.token1.id),
      symbol: graphPool.token1.symbol,
      decimals: token1Decimals,
      name: graphPool.token1.name,
      logo: token1LocalInfo?.logo || '',
    },
  };
};
