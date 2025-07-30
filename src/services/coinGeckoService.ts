import { chainsData } from '@/constants/chains';
import type { CoinGeckoToken, LiveFeedToken, CoinGeckoTokenDetail, CoingeckoCoin } from '@/types/coinGecko';
import { formatToken } from '@/utils/address';
import axios from 'axios';
import { Hex } from 'viem';

export class CoinGeckoService {
  private static readonly BASE_URL = 'https://api.coingecko.com/api/v3';

  private static allCoingeckoCoins: CoingeckoCoin[] = [];

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

    return this.transformTokenData(marketData);
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
