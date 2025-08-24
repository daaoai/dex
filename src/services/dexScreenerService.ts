import { DexScreenerToken } from '@/types/dexScreener';
import { Hex } from 'viem';

export class DexScreenerService {
  private static readonly BASE_URL = 'https://api.dexscreener.com';

  private static CHAIN_ID_MAP: Record<number, string> = {
    56: 'bsc',
    1: 'ethereum',
    137: 'polygon',
    8453: 'base',
    42161: 'arbitrum',
    10: 'optimism',
    43114: 'avalanche',
  };

  /**
   * Get token data from DexScreener by address and chain
   * @param address Token address
   * @param chainId Chain ID (e.g., 'bsc', 'ethereum')
   * @returns Promise<DexScreenerToken[]>
   */
  static async getTokenData(address: Hex, chainId: number): Promise<DexScreenerToken[]> {
    try {
      const url = `${this.BASE_URL}/tokens/v1/${this.CHAIN_ID_MAP[chainId]}/${address}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`DexScreener API error: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch DexScreener data for ${address}:`, error);
      return [];
    }
  }

  /**
   * Get the primary trading pair for a token (usually the highest volume pair)
   * @param address Token address
   * @param chainId Chain ID
   * @returns Promise<DexScreenerToken | null>
   */
  static async getPrimaryPair(address: Hex, chainId: number): Promise<DexScreenerToken | null> {
    const pairs = await this.getTokenData(address, chainId);

    if (pairs.length === 0) {
      return null;
    }

    // Sort by volume and return the highest volume pair
    return pairs.sort((a, b) => b.volume.h24 - a.volume.h24)[0];
  }

  /**
   * Get transaction counts for different timeframes
   * @param pair DexScreener pair data
   * @returns Object with transaction counts
   */
  static getTransactionCounts(pair: DexScreenerToken) {
    return {
      buys5m: pair.txns.m5.buys,
      sells5m: pair.txns.m5.sells,
      buys1h: pair.txns.h1.buys,
      sells1h: pair.txns.h1.sells,
      buys6h: pair.txns.h6.buys,
      sells6h: pair.txns.h6.sells,
      buys24h: pair.txns.h24.buys,
      sells24h: pair.txns.h24.sells,
      totalBuys: pair.txns.h24.buys,
      totalSells: pair.txns.h24.sells,
    };
  }

  /**
   * Get volume data for different timeframes
   * @param pair DexScreener pair data
   * @returns Object with volume data
   */
  static getVolumeData(pair: DexScreenerToken) {
    return {
      volume24h: pair.volume.h24,
      volume6h: pair.volume.h6,
      volume1h: pair.volume.h1,
      volume5m: pair.volume.m5,
    };
  }

  /**
   * Get price change data for different timeframes
   * @param pair DexScreener pair data
   * @returns Object with price change data
   */
  static getPriceChangeData(pair: DexScreenerToken) {
    return {
      priceChange1h: pair.priceChange.h1,
      priceChange6h: pair.priceChange.h6,
      priceChange24h: pair.priceChange.h24,
    };
  }

  /**
   * Get liquidity and market data
   * @param pair DexScreener pair data
   * @returns Object with liquidity and market data
   */
  static getLiquidityData(pair: DexScreenerToken) {
    return {
      liquidityUsd: pair.liquidity.usd,
      liquidityBase: pair.liquidity.base,
      liquidityQuote: pair.liquidity.quote,
      fdv: pair.fdv,
      marketCap: pair.marketCap,
      currentPrice: parseFloat(pair.priceUsd),
    };
  }
}
