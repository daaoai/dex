import { ChartDataPoint } from './pools';

export type HistoryDuration = 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export type PriceHistoryPoint = {
  id: string;
  token0Price: number;
  token1Price: number;
  timestamp: number;
};

export type PositionPriceData = {
  id: string;
  currentPrice: number;
  priceHistory: PriceHistoryPoint[];
  chartData: ChartDataPoint[]; // For compatibility with existing chart component
  token0Symbol: string;
  token1Symbol: string;
};

// GraphQL response types
type Token = {
  id: string;
  symbol: string;
  name: string;
};

export type PoolDataPoint = {
  periodStartUnix?: number;
  date?: number;
  close: string;
  high: string;
  low: string;
  open: string;
  token0Price: string;
  token1Price: string;
};

export type GraphPoolData = {
  id: string;
  token0Price: string;
  token1Price: string;
  poolHourData: PoolDataPoint[];
  poolDayData: PoolDataPoint[];
  token0: Token;
  token1: Token;
};

export type UsePositionPriceDataOptions = {
  poolAddress?: string;
  duration?: HistoryDuration;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
};

export type UsePositionPriceDataReturn = {
  data: PositionPriceData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};
