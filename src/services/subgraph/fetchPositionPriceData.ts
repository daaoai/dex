import { chainsData, supportedChainIds } from '@/constants/chains';
import { ChartDataPoint } from '@/types/pools';
import { GraphPoolData, HistoryDuration, PoolDataPoint, PositionPriceData, PriceHistoryPoint } from '@/types/positions';

/**
 * Fetches price history data for a specific pool from The Graph subgraph
 * @param poolAddress - The pool address to fetch price data for
 * @param duration - Duration for price history (default: 'WEEK')
 * @returns Promise<PositionPriceData | null> - Price data or null if not found
 */
export const fetchPositionPriceData = async (
  poolAddress: string,
  duration: HistoryDuration = 'WEEK',
): Promise<PositionPriceData | null> => {
  const SUBGRAPH_ENDPOINT = chainsData[supportedChainIds.bsc].subgraphURL;

  // Convert duration to days and data points
  const getDurationConfig = (duration: HistoryDuration) => {
    switch (duration) {
      case 'HOUR':
        return { days: 1, hours: 24, useHourly: true };
      case 'DAY':
        return { days: 7, hours: 168, useHourly: true };
      case 'WEEK':
        return { days: 7, hours: 168, useHourly: false };
      case 'MONTH':
        return { days: 30, hours: 720, useHourly: false };
      case 'YEAR':
        return { days: 365, hours: 8760, useHourly: false };
      default:
        return { days: 7, hours: 168, useHourly: false };
    }
  };

  const { days, hours, useHourly } = getDurationConfig(duration);

  // Calculate the timestamp for the duration
  const endTime = Math.floor(Date.now() / 1000);
  const startTime = endTime - days * 24 * 60 * 60;

  const PRICE_HISTORY_QUERY = `
    query GetPoolPriceHistory($poolId: ID!, $startTime: Int!) {
      pool(id: $poolId) {
        id
        token0Price
        token1Price
        poolHourData(
          first: ${useHourly ? hours : Math.min(hours, 1000)}
          orderBy: periodStartUnix
          orderDirection: desc
          where: { periodStartUnix_gte: $startTime }
        ) {
          periodStartUnix
          close
          high
          low
          open
          token0Price
          token1Price
        }
        poolDayData(
          first: ${Math.min(days, 1000)}
          orderBy: date
          orderDirection: desc
          where: { date_gte: ${Math.floor(startTime / 86400)} }
        ) {
          date
          close
          high
          low
          open
          token0Price
          token1Price
        }
        token0 {
          id
          symbol
          name
        }
        token1 {
          id
          symbol
          name
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
        query: PRICE_HISTORY_QUERY,
        variables: {
          poolId: poolAddress.toLowerCase(),
          startTime: startTime,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data?.pool) {
      console.warn(`No pool data received for pool address: ${poolAddress}`);
      return null;
    }

    return transformPriceData(result.data.pool, duration, useHourly);
  } catch (error) {
    console.error('Error fetching position price data from subgraph:', error);
    return null;
  }
};

/**
 * Transforms raw GraphQL price data to PositionPriceData format
 */
const transformPriceData = (
  graphPool: GraphPoolData,
  duration: HistoryDuration,
  useHourly: boolean,
): PositionPriceData => {
  const currentToken0Price = parseFloat(graphPool.token0Price) || 0;
  const currentToken1Price = parseFloat(graphPool.token1Price) || 0;

  // Use hourly data for short durations, daily data for longer periods
  const rawData = useHourly ? graphPool.poolHourData : graphPool.poolDayData;

  // Transform price history to match Uniswap's format
  const priceHistory: PriceHistoryPoint[] = (rawData || [])
    .slice()
    .reverse() // Reverse to get chronological order
    .map((dataPoint: PoolDataPoint, index: number) => {
      // Try multiple price sources in order of preference
      const token0Prices = [
        parseFloat(dataPoint.token0Price),
        parseFloat(dataPoint.close),
        parseFloat(dataPoint.open),
        parseFloat(dataPoint.high),
        parseFloat(dataPoint.low),
        currentToken0Price,
      ].filter((price) => !isNaN(price) && price > 0 && isFinite(price));

      const token1Prices = [
        parseFloat(dataPoint.token1Price),
        parseFloat(dataPoint.token0Price) > 0 ? 1 / parseFloat(dataPoint.token0Price) : 0,
        currentToken1Price,
      ].filter((price) => !isNaN(price) && price > 0 && isFinite(price));

      // Use the first valid prices
      const token0Price = token0Prices.length > 0 ? token0Prices[0] : currentToken0Price;
      const token1Price = token1Prices.length > 0 ? token1Prices[0] : currentToken1Price;

      // Calculate timestamp based on data type
      const timestamp = useHourly
        ? dataPoint.periodStartUnix
          ? dataPoint.periodStartUnix * 1000
          : Date.now()
        : dataPoint.date
          ? dataPoint.date * 1000 // Convert from seconds to milliseconds
          : Date.now();

      return {
        id: `${graphPool.id}-${timestamp}-${index}`,
        token0Price,
        token1Price,
        timestamp: timestamp,
      };
    })
    .filter(
      (point: PriceHistoryPoint) =>
        !isNaN(point.token0Price) &&
        !isNaN(point.token1Price) &&
        isFinite(point.token0Price) &&
        isFinite(point.token1Price) &&
        point.token0Price > 0 &&
        point.token1Price > 0,
    );

  // Create chart data for compatibility with existing chart component
  const chartData: ChartDataPoint[] = priceHistory.map((point, index) => ({
    x: index,
    y: point.token0Price,
    timestamp: point.timestamp && !isNaN(point.timestamp) ? point.timestamp : Date.now(),
  }));

  return {
    id: graphPool.id,
    currentPrice: currentToken0Price,
    priceHistory,
    chartData,
    token0Symbol: graphPool.token0.symbol,
    token1Symbol: graphPool.token1.symbol,
  };
};
