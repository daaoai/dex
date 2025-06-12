import { CachedPrices, PriceData } from '@/types/linegraph';
import axios from 'axios';

const COINGECKO_MARKET_CHART_URL = 'https://api.coingecko.com/api/v3/coins';

const isCachedPricesValid = (updatedAt: string): boolean => {
  const currTime = Date.now();
  const prevUpdatedAt = Date.parse(updatedAt);
  return currTime - prevUpdatedAt < 10 * 60 * 1000;
};

export const fetchPrices = async ({
    tokenName,
    duration,
    cacheKey,
    cachedPrices,
  }: {
    tokenName: string;
    duration: number;
    cacheKey: string;
    cachedPrices: CachedPrices | null;
  }): Promise<PriceData[]> => {
    if (!tokenName) return [];
  
    if (cachedPrices && cachedPrices.updatedAt && isCachedPricesValid(cachedPrices.updatedAt)) {
      return cachedPrices.newPrices;
    }
  
    const url = `${COINGECKO_MARKET_CHART_URL}/${tokenName}/market_chart`;
    const params = { vs_currency: 'usd', days: duration };
  
    const response = await axios.get(url, { params });
  
    const newPrices: PriceData[] = response.data.prices.map((price: number[]) => ({
      timestamp: price[0],
      price: price[1],
    }));
  
    localStorage.setItem(cacheKey, JSON.stringify({ newPrices, updatedAt: new Date().toISOString() }));
  
    return newPrices;
  };

export const getTimeLabel = (duration: number): string => {
    const labels: Record<number, string> = {
      1: 'TODAY',
      3: '3 DAYS',
      30: '1 MONTH',
      180: '6 MONTH',
      365: '1 YEAR',
      [365 * 5]: 'ALL',
    };
  
    return labels[duration] || `${duration} DAYS`;
  };
  