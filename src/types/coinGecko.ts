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

export type CoingeckoCoin = {
  id: string;
  symbol: string;
  name: string;
  platforms: {
    [key: string]: string | undefined;
  };
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
  description?: {
    en: string;
  };
  links?: {
    homepage?: string[];
    twitter_screen_name?: string;
    telegram_channel_identifier?: string;
    official_forum_url?: string[];
    subreddit_url?: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  coingecko_rank?: number;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    price_change_percentage_24h: number;
    price_change_percentage_7d?: number;
    price_change_percentage_30d?: number;
    total_volume?: {
      usd: number;
    };
    high_24h?: {
      usd: number;
    };
    low_24h?: {
      usd: number;
    };
    circulating_supply?: number;
    total_supply?: number;
    max_supply?: number;
    ath?: {
      usd: number;
    };
    ath_change_percentage?: {
      usd: number;
    };
    ath_date?: {
      usd: string;
    };
    atl?: {
      usd: number;
    };
    atl_change_percentage?: {
      usd: number;
    };
    atl_date?: {
      usd: string;
    };
    price_change_24h?: number;
  };
  community_data?: {
    facebook_likes?: number;
    twitter_followers?: number;
    reddit_subscribers?: number;
    telegram_channel_user_count?: number;
  };
  developer_data?: {
    forks?: number;
    stars?: number;
    subscribers?: number;
    total_issues?: number;
    closed_issues?: number;
    pull_requests_merged?: number;
    pull_request_contributors?: number;
    code_additions_deletions_4_weeks?: {
      additions?: number;
      deletions?: number;
    };
    commit_count_4_weeks?: number;
  };

  tickers?: {
    base: string;
    target: string;
    market: {
      name: string;
      identifier: string;
      has_trading_incentive: boolean;
    };
    last: number;
    volume: number;
    converted_last: {
      btc: number;
      eth: number;
      usd: number;
    };
    converted_volume: {
      btc: number;
      eth: number;
      usd: number;
    };
    trust_score: string;
    bid_ask_spread_percentage: number;
    timestamp: string;
    last_traded_at: string;
    last_fetch_at: string;
    is_anomaly: boolean;
    is_stale: boolean;
    trade_url: string;
    token_info_url: string | null;
    coin_id: string;
    target_coin_id: string;
    coin_mcap_usd: number;
  }[];

  // tickers: [
  //   {
  // tickers: [
  //   {
  //     base: 'SSKFGDPEQYZAM8NWPIIX7MGY7INDTEX6DXRDXMKPUMP';
  //     target: 'SO11111111111111111111111111111111111111112';
  //     market: {
  //       name: 'Raydium';
  //       identifier: 'raydium2';
  //       has_trading_incentive: false;
  //     };
  //     last: 6.712575774e-7;
  //     volume: 624704.774446;
  //     converted_last: {
  //       btc: 1.221e-9;
  //       eth: 2.9377e-8;
  //       usd: 0.00014026;
  //     };
  //     converted_volume: {
  //       btc: 0.00076341;
  //       eth: 0.01837487;
  //       usd: 87.73;
  //     };
  //     trust_score: 'yellow';
  //     bid_ask_spread_percentage: 0.606465;
  //     timestamp: '2025-08-24T02:36:14+00:00';
  //     last_traded_at: '2025-08-24T02:36:14+00:00';
  //     last_fetch_at: '2025-08-24T03:47:12+00:00';
  //     is_anomaly: false;
  //     is_stale: false;
  //     trade_url: 'https://raydium.io/swap/?outputCurrency=SsKFgDPEqyzAM8nWPiiX7MGY7iNDTEX6DxRdxmkpump';
  //     token_info_url: null;
  //     coin_id: 'doge';
  //     target_coin_id: 'wrapped-solana';
  //     coin_mcap_usd: 140089.6237833073;
  //   },
  // ];
};

export type CoingeckoTokenDetailedInfo = {
  id: string;
  symbol: string;
  name: string;
  description?: string;
  image?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  reddit?: string;
  currentPrice: number;
  priceChange24h: number;
  priceChange7d?: number;
  priceChange30d?: number;
  marketCap: number;
  volume24h?: number;
  high24h?: number;
  low24h?: number;
  circulatingSupply?: number;
  totalSupply?: number;
  maxSupply?: number;
  rank?: number;
  ath?: number;
  athChangePercentage?: number;
  athDate?: string;
  atl?: number;
  atlChangePercentage?: number;
  atlDate?: string;
  // Core CoinGecko data only
  fdv?: number; // Fully Diluted Valuation
  liquidity?: number;
  holders?: number;
  likes?: number;
  orgScore?: number;
  sentiment?: number; // 0-100 scale
  sentimentLabel?: string; // "Bullish", "Neutral", "Bearish"
  // Trading pair data
  tradingPair?: string;
  tradingPairPrice?: number;
  tradingPairChange?: number;
  tradingPairChangePercentage?: number;
  tradingPairHigh?: number;
  tradingPairLow?: number;
};

export type TokenTransaction = {
  id: string;
  type: 'Buy' | 'Sell';
  price: number;
  volume: number;
  tokenAmount: number;
  trader: string;
  timestamp: string;
  age: string;
};

export type TokenTradingData = {
  price: number;
  change: number;
  changePercentage: number;
  high: number;
  low: number;
  volume24h: number;
  timeframe: string;
  chartData: number[][];
};

export type AdditionalTokenData = {
  socialScore: number;
  communityScore: number;
  developerScore: number;
  publicInterestScore: number;
  liquidityScore: number;
  marketCapRank: number;
  coingeckoRank: number;
  trustScore: number;
};
