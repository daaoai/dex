export interface MoralisSwapTransaction {
  transactionHash: string;
  transactionIndex: number;
  transactionType: 'buy' | 'sell';
  baseQuotePrice: string;
  entity: string | null;
  entityLogo: string | null;
  blockTimestamp: string;
  blockNumber: number;
  subCategory: string;
  walletAddress: string;
  walletAddressLabel: string | null;
  pairAddress: string;
  pairLabel: string;
  exchangeName: string | null;
  exchangeAddress: string;
  exchangeLogo: string | null;
  baseToken: string;
  quoteToken: string;
  bought: {
    address: string;
    amount: string;
    usdPrice: number;
    usdAmount: number;
    symbol: string;
    logo: string;
    name: string;
    tokenType: 'token0' | 'token1';
  };
  sold: {
    address: string;
    amount: string;
    usdPrice: number;
    usdAmount: number;
    symbol: string;
    logo: string;
    name: string;
    tokenType: 'token0' | 'token1';
  };
  totalValueUsd: number;
}

export interface MoralisSwapResponse {
  result: MoralisSwapTransaction[];
}

export interface ProcessedTransaction {
  id: string;
  type: 'Buy' | 'Sell';
  timestamp: string;
  age: string;
  trader: string;
  tokenAmount: number;
  tokenSymbol: string;
  usdAmount: number;
  price: number;
  exchange: string;
  txHash: string;
}