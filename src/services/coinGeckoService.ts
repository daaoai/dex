import type { CoinGeckoToken, LiveFeedToken, CoinGeckoTokenDetail } from '@/types/coinGecko';

export class CoinGeckoService {
  private static readonly BASE_URL = 'https://api.coingecko.com/api/v3';

  /**
   * Fetch trending meme tokens from CoinGecko API
   * @param perPage Number of tokens to fetch (default: 10)
   * @returns Promise<MemeToken[]>
   */
  static async getMemeTokens(perPage: number = 10): Promise<LiveFeedToken[]> {
    const url = `${this.BASE_URL}/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_change_24h_desc&per_page=${perPage}&page=1&sparkline=false&price_change_percentage=24h`;

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data: CoinGeckoToken[] = await response.json();

    return this.transformTokenData(data);
  }

  /**
   * Transform CoinGecko response to our MemeToken format
   * @param tokens CoinGecko token data
   * @returns MemeToken[]
   */
  private static transformTokenData(tokens: CoinGeckoToken[]): LiveFeedToken[] {
    return tokens.map((token, index) => ({
      rank: token.market_cap_rank || index + 1,
      name: token.name,
      symbol: token.symbol.toUpperCase(),
      address: token.id, // Use CoinGecko ID as address since we don't have contract addresses
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
}
