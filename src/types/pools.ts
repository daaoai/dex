export interface GraphTopPool {
  id: string;
  volumeUSD: string;
  feeTier: string;
  untrackedVolumeUSD: string;
  totalValueLockedUSD: string;
  poolDayData: Array<{
    volumeUSD: string;
    date: number;
  }>;
  poolHourData: Array<{
    volumeUSD: string;
  }>;
  token0: {
    id: string;
    symbol: string;
    decimals: string;
  };
  token1: {
    id: string;
    symbol: string;
    decimals: string;
  };
}

export interface TopPool {
  id: string;
  volumeUSD: number;
  feeTier: number;
  apr: number;
  token0: {
    id: string;
    symbol: string;
    decimals: number;
  };
  token1: {
    id: string;
    symbol: string;
    decimals: number;
  };
}

export interface Transaction {
  timeAgo: string;
  type: 'Buy' | 'Sell';
  usd: number;
  token0Amount: number;
  token1Amount: number;
  wallet: string;
}

export interface ChartDataPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface PoolBalances {
  token0: string;
  token1: string;
  token0Percentage: number;
  token1Percentage: number;
}

export interface PoolDetails {
  id: string;
  price: number;
  feeTier: number;
  apr: number;
  tvl: string;
  tvlChange: number;
  volume24h: string;
  volumeChange: number;
  fees24h: string;
  poolBalances: PoolBalances;
  chartData: ChartDataPoint[];
  transactions: Transaction[];
  token0: {
    id: string;
    symbol: string;
    decimals: number;
    name: string;
  };
  token1: {
    id: string;
    symbol: string;
    decimals: number;
    name: string;
  };
}

export interface GraphPoolDetails {
  id: string;
  volumeUSD: string;
  feeTier: string;
  totalValueLockedUSD: string;
  totalValueLockedToken0: string;
  totalValueLockedToken1: string;
  token0Price: string;
  token1Price: string;
  sqrtPrice: string;
  tick: string;
  poolDayData: Array<{
    volumeUSD: string;
    date: number;
    close: string;
    high: string;
    low: string;
    open: string;
    totalValueLockedUSD: string;
  }>;
  poolHourData: Array<{
    volumeUSD: string;
    periodStartUnix: number;
    close: string;
    high: string;
    low: string;
    open: string;
  }>;
  swaps: Array<{
    id: string;
    timestamp: string;
    amount0: string;
    amount1: string;
    amountUSD: string;
    sender: string;
    recipient: string;
    transaction: {
      id: string;
    };
  }>;
  token0: {
    id: string;
    symbol: string;
    decimals: string;
    name: string;
  };
  token1: {
    id: string;
    symbol: string;
    decimals: string;
    name: string;
  };
}
