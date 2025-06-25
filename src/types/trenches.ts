export interface TradingItem {
  token: string;
  name: string;
  filename: string;
  image?: string;
  timeLeft?: string;
  percentage: string;
  holders: string;
  rating: number;
  change: string;
  successRate: number;
  volume: string;
  marketCap: string;
  transactions: number;
  creator: string;
  hasRun?: boolean;
  earnings: number;
  holdTime: string;
}

export interface TradingData {
  justLaunched: TradingItem[];
  active: TradingItem[];
  completed: TradingItem[];
}
