import { Token } from '@/types/tokens';
import { Hex } from 'viem';

/**
 * Utility functions for async token fetching
 * These functions demonstrate how you could extend the token resolution
 * to support external APIs and async operations.
 */

export interface TokenFetchOptions {
  chainId: number;
  address: string;
  timeout?: number;
}

/**
 * Fetch token data from CoinGecko API
 */
export async function fetchTokenFromCoinGecko(address: string, chainId: number, timeout = 5000): Promise<Token | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    // Map chain IDs to CoinGecko platform names
    const platformMap: Record<number, string> = {
      1: 'ethereum',
      56: 'binance-smart-chain',
      137: 'polygon-pos',
      // Add more chains as needed
    };

    const platform = platformMap[chainId];
    if (!platform) {
      console.warn(`CoinGecko platform not found for chain ${chainId}`);
      return null;
    }

    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${platform}/contract/${address}`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      address: address as Hex,
      decimals: data.detail_platforms?.[platform]?.decimal_place || 18,
      name: data.name,
      symbol: data.symbol?.toUpperCase(),
      logo: data.image?.small,
      coingeckoId: data.id,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Token fetch timeout for ${address}`);
    } else {
      console.warn(`Failed to fetch token ${address} from CoinGecko:`, error);
    }
    return null;
  }
}

/**
 * Fetch token data from 1inch API
 */
export async function fetchTokenFrom1inch(address: string, chainId: number, timeout = 5000): Promise<Token | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`https://api.1inch.dev/token/v1.2/${chainId}/${address}`, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`, // You'd need an API key
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      address: address as Hex,
      decimals: data.decimals,
      name: data.name,
      symbol: data.symbol,
      logo: data.logoURI,
      coingeckoId: undefined,
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.warn(`Token fetch timeout for ${address}`);
    } else {
      console.warn(`Failed to fetch token ${address} from 1inch:`, error);
    }
    return null;
  }
}

/**
 * Fetch token with fallback strategy
 * Tries multiple sources in order until one succeeds
 */
export async function fetchTokenWithFallback(address: string, chainId: number, timeout = 5000): Promise<Token | null> {
  const strategies = [
    () => fetchTokenFromCoinGecko(address, chainId, timeout),
    () => fetchTokenFrom1inch(address, chainId, timeout),
    // Add more strategies as needed
  ];

  for (const strategy of strategies) {
    try {
      const token = await strategy();
      if (token) {
        console.log(`Successfully fetched token ${address} using fallback strategy`);
        return token;
      }
    } catch (error) {
      console.warn(`Fallback strategy failed for ${address}:`, error);
      continue;
    }
  }

  console.warn(`All fallback strategies failed for token ${address}`);
  return null;
}

/**
 * Batch fetch multiple tokens
 */
export async function batchFetchTokens(requests: TokenFetchOptions[], concurrency = 3): Promise<(Token | null)[]> {
  const results: (Token | null)[] = new Array(requests.length).fill(null);

  // Process requests in batches to avoid overwhelming APIs
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests.slice(i, i + concurrency);
    const batchPromises = batch.map(async (request, batchIndex) => {
      const token = await fetchTokenWithFallback(request.address, request.chainId, request.timeout);
      return { token, index: i + batchIndex };
    });

    const batchResults = await Promise.allSettled(batchPromises);

    batchResults.forEach((result) => {
      if (result.status === 'fulfilled') {
        results[result.value.index] = result.value.token;
      }
    });
  }

  return results;
}
