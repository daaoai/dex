export type CoinGeckoToken = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
};

export type LiveFeedToken = {
  rank: number;
  name: string;
  symbol: string;
  address: string;
  image?: string;
  percent: string;
  price: number;
  marketCap: number;
};

export type CoinGeckoTokenDetail = {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
  };
};
