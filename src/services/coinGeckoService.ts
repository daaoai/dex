import { chainsData } from '@/constants/chains';
import { getTokensDecimals } from '@/helper/token';
import type {
  CoinGeckoToken,
  CoinGeckoTokenDetail,
  CoingeckoCoin,
  CoingeckoTokenDetailedInfo,
  LiveFeedToken,
} from '@/types/coinGecko';
import { Token } from '@/types/tokens';
import { formatToken } from '@/utils/address';
import { getTelegramUrl, getTwitterUrl } from '@/utils/socials';
import axios from 'axios';
import { Hex } from 'viem';

export class CoinGeckoService {
  private static readonly BASE_URL = 'https://api.coingecko.com/api/v3';
  private static allCoingeckoCoins: CoingeckoCoin[] = [];
  private static coingeckoCoinsByChainId: Record<number, Record<string, Token>> = {};

  static async fetchAllCoinsForChainId(chainId: number): Promise<Record<string, CoingeckoCoin>> {
    const chainCoingeckoId = chainsData[chainId]?.geckoId;
    if (!chainCoingeckoId) {
      return {};
    }
    if (CoinGeckoService.allCoingeckoCoins.length > 0) {
      return CoinGeckoService.allCoingeckoCoins.reduce((acc: Record<string, CoingeckoCoin>, coin: CoingeckoCoin) => {
        if (coin.platforms && coin.platforms[chainCoingeckoId]) {
          acc[coin.id] = coin;
        }
        return acc;
      }, {});
    }
    const url = `${this.BASE_URL}/coins/list?include_platform=true`;
    const response = (await axios.get(url)).data as CoingeckoCoin[];
    CoinGeckoService.allCoingeckoCoins = response;

    return response.reduce((acc: Record<string, CoingeckoCoin>, coin: CoingeckoCoin) => {
      if (coin.platforms && coin.platforms[chainCoingeckoId]) {
        acc[coin.id] = coin;
      }
      return acc;
    }, {});
  }

  static async getCoingeckoIdByAddress(address: Hex, chainId: number): Promise<string | null> {
    const tokensByIdForChain = await this.fetchAllCoinsForChainId(chainId);
    const chainCoingeckoId = chainsData[chainId]?.geckoId;
    if (!chainCoingeckoId) {
      return null;
    }
    for (const token of Object.values(tokensByIdForChain)) {
      if (token.platforms && token.platforms[chainCoingeckoId]?.toLowerCase() === address.toLowerCase()) {
        return token.id;
      }
    }
    return null;
  }

  static getCoingeckoLocalTokenDetails(address: Hex, chainId: number): Token | null {
    const tokensByIdForChain = CoinGeckoService.coingeckoCoinsByChainId[chainId];
    if (!tokensByIdForChain) {
      return null;
    }
    const token = tokensByIdForChain[address];
    if (!token) {
      return null;
    }
    return token;
  }

  /**
   * Fetch trending meme tokens from CoinGecko API
   * @param perPage Number of tokens to fetch (default: 10)
   * @returns Promise<MemeToken[]>
   */
  static async getMemeTokens(chainId: number): Promise<LiveFeedToken[]> {
    const url = `${this.BASE_URL}/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_change_24h_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`;

    const [marketDataResponse, tokensByIdForChain] = (await Promise.all([
      axios.get(url),
      CoinGeckoService.fetchAllCoinsForChainId(chainId),
    ])) as [{ data: CoinGeckoToken[] }, Record<string, CoingeckoCoin>];

    const chainCoingeckoId = chainsData[chainId]?.geckoId;
    if (!chainCoingeckoId) {
      console.warn(`No CoinGecko ID found for chain ID ${chainId}`);
      return [];
    }
    const marketData = marketDataResponse.data
      .filter((token: CoinGeckoToken) => {
        return tokensByIdForChain[token.id] && tokensByIdForChain[token.id].platforms[chainCoingeckoId];
      })
      .map((token: CoinGeckoToken) => {
        return {
          ...token,
          address: formatToken(tokensByIdForChain[token.id].platforms[chainCoingeckoId] as Hex),
        };
      });

    const tokenDecimals = await getTokensDecimals(
      marketData.map((token) => token.address as Hex),
      chainId,
    );
    marketData.forEach((token) => {
      const address = token.address as Hex;
      if (!CoinGeckoService.coingeckoCoinsByChainId[chainId]) {
        CoinGeckoService.coingeckoCoinsByChainId[chainId] = {};
      }
      CoinGeckoService.coingeckoCoinsByChainId[chainId][address] = {
        ...token,
        logo: token.image,
        coingeckoId: token.id,
        address,
        symbol: token.symbol.toUpperCase(),
        decimals: tokenDecimals[address] || 18,
      };
    });

    return this.transformTokenData(
      marketData.map((token) => ({
        ...token,
        address: token.address as Hex,
      })),
    );
  }

  /**
   * Transform CoinGecko response to our MemeToken format
   * @param tokens CoinGecko token data
   * @returns MemeToken[]
   */
  private static transformTokenData(tokens: (CoinGeckoToken & { address: Hex })[]): LiveFeedToken[] {
    return tokens.map((token, index) => ({
      rank: token.market_cap_rank || index + 1,
      name: token.name,
      symbol: token.symbol.toUpperCase(),
      address: token.address,
      image: token.image,
      percent: token.price_change_percentage_24h
        ? `${token.price_change_percentage_24h >= 0 ? '+' : ''}${token.price_change_percentage_24h.toFixed(2)}%`
        : '',
      price: token.current_price,
      marketCap: token.market_cap,
    }));
  }

  /**
   * Get specific token data by CoinGecko ID
   * @param tokenId CoinGecko token ID
   * @returns Promise<MemeToken | null>
   */
  static async getTokenById(tokenId: string): Promise<LiveFeedToken | null> {
    try {
      const url = `${this.BASE_URL}/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data: CoinGeckoTokenDetail = await response.json();

      return {
        rank: data.market_cap_rank || 0,
        name: data.name,
        symbol: data.symbol.toUpperCase(),
        address: data.id,
        image: data.image?.large || data.image?.small,
        percent: data.market_data?.price_change_percentage_24h
          ? `${data.market_data.price_change_percentage_24h >= 0 ? '+' : ''}${data.market_data.price_change_percentage_24h.toFixed(2)}%`
          : '',
        price: data.market_data?.current_price?.usd || 0,
        marketCap: data.market_data?.market_cap?.usd || 0,
      };
    } catch (error) {
      console.error(`Failed to fetch token ${tokenId}:`, error);
      return null;
    }
  }

  /**
   * Get detailed token information by CoinGecko ID
   * @param coingeckoId CoinGecko token ID
   * @returns Promise<TokenDetailedInfo | null>
   */
  static async getDetailedTokenInfo(coingeckoId: string): Promise<CoingeckoTokenDetailedInfo | null> {
    try {
      const url = `${this.BASE_URL}/coins/${coingeckoId}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=false&sparkline=true`;

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data: CoinGeckoTokenDetail = await response.json();

      // Calculate additional metrics from actual CoinGecko data
      const fdv =
        data.market_data?.total_supply && data.market_data?.current_price?.usd
          ? data.market_data.total_supply * data.market_data.current_price.usd
          : undefined;

      const liquidity = data.market_data?.total_volume?.usd;
      const holders = data.community_data?.twitter_followers || 0;
      const likes = data.community_data?.facebook_likes || 0;

      // Calculate sentiment based on actual price changes
      const sentiment = this.calculateSentiment(data.market_data?.price_change_percentage_24h || 0);

      // Get trading pair data (default to USDC pair)
      const tradingPair = 'USDC';
      const tradingPairPrice = data.market_data?.current_price?.usd || 0;
      const tradingPairChange = data.market_data?.price_change_24h || 0;
      const tradingPairChangePercentage = data.market_data?.price_change_percentage_24h || 0;
      const tradingPairHigh = data.market_data?.high_24h?.usd || 0;
      const tradingPairLow = data.market_data?.low_24h?.usd || 0;
      const twitter = data.links?.twitter_screen_name ? getTwitterUrl(data.links.twitter_screen_name) : undefined;
      const telegram = data.links?.telegram_channel_identifier
        ? getTelegramUrl(data.links.telegram_channel_identifier)
        : undefined;
      const website = data.links?.homepage?.[0];
      const reddit = data.links?.subreddit_url;

      return {
        id: data.id,
        name: data.name,
        symbol: data.symbol.toUpperCase(),
        description: data.description?.en,
        image: data.image?.large || data.image?.small,
        website,
        twitter,
        telegram,
        reddit,
        currentPrice: data.market_data?.current_price?.usd || 0,
        priceChange24h: data.market_data?.price_change_percentage_24h || 0,
        priceChange7d: data.market_data?.price_change_percentage_7d,
        priceChange30d: data.market_data?.price_change_percentage_30d,
        marketCap: data.market_data?.market_cap?.usd || 0,
        volume24h: data.market_data?.total_volume?.usd,
        high24h: data.market_data?.high_24h?.usd,
        low24h: data.market_data?.low_24h?.usd,
        circulatingSupply: data.market_data?.circulating_supply,
        totalSupply: data.market_data?.total_supply,
        maxSupply: data.market_data?.max_supply,
        rank: data.market_cap_rank || data.coingecko_rank,
        ath: data.market_data?.ath?.usd,
        athChangePercentage: data.market_data?.ath_change_percentage?.usd,
        athDate: data.market_data?.ath_date?.usd,
        atl: data.market_data?.atl?.usd,
        atlChangePercentage: data.market_data?.atl_change_percentage?.usd,
        atlDate: data.market_data?.atl_date?.usd,
        // Core CoinGecko data only
        fdv,
        liquidity,
        holders,
        likes,
        sentiment,
        sentimentLabel: this.getSentimentLabel(sentiment),
        tradingPair,
        tradingPairPrice,
        tradingPairChange,
        tradingPairChangePercentage,
        tradingPairHigh,
        tradingPairLow,
      };
    } catch (error) {
      console.error(`Failed to fetch detailed token info for ${coingeckoId}:`, error);
      return null;
    }
  }

  /**
   * Calculate sentiment score based on price change
   * @param priceChange24h 24h price change percentage
   * @returns sentiment score 0-100
   */
  private static calculateSentiment(priceChange24h: number): number {
    if (priceChange24h >= 20) return 90;
    if (priceChange24h >= 10) return 75;
    if (priceChange24h >= 5) return 60;
    if (priceChange24h >= 0) return 50;
    if (priceChange24h >= -5) return 40;
    if (priceChange24h >= -10) return 25;
    return 10;
  }

  /**
   * Get sentiment label based on score
   * @param sentiment sentiment score 0-100
   * @returns sentiment label
   */
  private static getSentimentLabel(sentiment: number): string {
    if (sentiment >= 70) return 'Bullish';
    if (sentiment >= 30) return 'Neutral';
    return 'Bearish';
  }

  /**
   * Fetch market chart data for a token
   * @param coingeckoId CoinGecko token ID
   * @param days Number of days or 'max' for maximum available data
   * @param currency Currency for price data (default: 'usd')
   * @returns Promise<number[][]> Array of [timestamp, price] pairs
   */
  static async getMarketChartData(
    coingeckoId: string,
    days: number | string,
    currency: string = 'usd',
  ): Promise<number[][]> {
    try {
      const url = `${this.BASE_URL}/coins/${coingeckoId}/market_chart`;
      const params = {
        vs_currency: currency,
        days: days,
      };

      const response = await axios.get(url, { params });
      return response.data.prices || [];
    } catch (error) {
      console.error(`Failed to fetch market chart for ${coingeckoId}:`, error);
      return [];
    }
  }
}
