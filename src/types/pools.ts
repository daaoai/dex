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
