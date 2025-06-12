export interface PriceData {
    timestamp: number;
    price: number;
  }
  
  export interface TokenState {
    percentageDiff?: number;
    diff?: number;
    time?: string;
    type?: 'positive' | 'negative';
  }
  
 export interface CachedPrices {
    newPrices: PriceData[];
    updatedAt: string;
  }