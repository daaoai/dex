import { supportedChainIds } from '@/constants/chains';
import { tokensByChainId } from '@/constants/tokens';
import type { LiveFeedToken } from '@/types/coinGecko';
import { CoinMarketCapCryptoCurrency } from '@/types/coinMarketCap';
import { Token } from '@/types/tokens';
import { formatToken } from '@/utils/address';
import axios from 'axios';

export type CoinMarketCapResponse = {
  data: {
    cryptoCurrencyList: CoinMarketCapCryptoCurrency[];
  };
};

export class CoinMarketCapService {
  private static readonly API_URL = '/api/coinmarketcap';

  private static liveFeedTokensByChainId: Record<number, LiveFeedToken[]> = {};

  /**
   * Fetch live token feed from CoinMarketCap API for Binance Smart Chain
   * Returns empty array for other chains
   * @param chainId Chain ID
   * @returns Promise<LiveFeedToken[]>
   */
  private static async getLiveTrendingTokens(chainId: number): Promise<LiveFeedToken[]> {
    // Only return data for BSC, empty for other chains
    if (chainId !== supportedChainIds.base) {
      return [];
    }

    if (this.liveFeedTokensByChainId[chainId]?.length) {
      return this.liveFeedTokensByChainId[chainId];
    }

    try {
      // Use our API route as a proxy to avoid CORS issues
      const params = new URLSearchParams({
        start: '1',
        limit: '100',
        sortBy: 'trending_24h',
        sortType: 'desc',
        convert: 'USD',
        cryptoType: 'all',
        tagType: 'all',
        audited: 'false',
        tagSlugs: 'bnb-chain-ecosystem',
        platformId: '',
        aux: 'ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,max_supply,circulating_supply,total_supply,volume_7d,volume_30d,self_reported_circulating_supply,self_reported_market_cap',
      });

      const url = `${this.API_URL}?${params.toString()}`;

      const response = await axios.get<CoinMarketCapResponse>(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      const cryptoCurrencyList = response.data.data.cryptoCurrencyList;

      // Get local token list for BSC
      const localTokens = tokensByChainId[chainId] || {};

      // Match tokens by symbol and transform to LiveFeedToken format
      const liveTokens: LiveFeedToken[] = [];

      for (const cmcToken of cryptoCurrencyList) {
        const matchingLocalToken = Object.values(localTokens).find(
          (localToken: Token) => localToken.symbol.toLowerCase() === cmcToken.symbol.toLowerCase(),
        );

        if (matchingLocalToken) {
          const usdQuote = cmcToken.quotes.find((quote) => quote.name === 'USD');

          if (usdQuote) {
            liveTokens.push({
              rank: cmcToken.cmcRank || 0,
              name: cmcToken.name,
              symbol: cmcToken.symbol.toUpperCase(),
              address: formatToken(matchingLocalToken.address),
              image: matchingLocalToken.logo,
              percent: usdQuote.percentChange24h
                ? `${usdQuote.percentChange24h >= 0 ? '+' : ''}${usdQuote.percentChange24h.toFixed(2)}%`
                : '',
              price: usdQuote.price || 0,
              marketCap: usdQuote.marketCap || 0,
            });
          }
        }
      }

      // Sort by rank and return top tokens
      const res = liveTokens.sort((a, b) => a.rank - b.rank).slice(0, 50); // Limit to top 50 tokens
      CoinMarketCapService.liveFeedTokensByChainId[chainId] = res;
      return res;
    } catch (error) {
      console.error('Failed to fetch CoinMarketCap live token feed:', error);
      return [];
    }
  }

  /**
   * Get trending tokens from BNB Chain ecosystem
   * @param chainId Chain ID
   * @param limit Number of tokens to return (default: 20)
   * @returns Promise<LiveFeedToken[]>
   */
  static async getTrendingTokens(chainId: number, limit: number = 20): Promise<LiveFeedToken[]> {
    const tokens = await this.getLiveTrendingTokens(chainId);
    return tokens.slice(0, limit);
  }

  /**
   * Clear cached data for a specific chain
   * @param chainId Chain ID
   */
  static clearCache(chainId?: number): void {
    if (chainId) {
      delete this.liveFeedTokensByChainId[chainId];
    } else {
      this.liveFeedTokensByChainId = {};
    }
  }
}
