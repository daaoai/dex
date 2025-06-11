import axios from 'axios';

export interface PriceData {
  timestamp: number;
  price: number;
}

export interface TokenState {
  percentageDiff?: number;
  diff?: number;
  time?: string;
  type?: 'positive' | 'negative';
}

interface CachedPrices {
  newPrices: PriceData[];
  updatedAt: string;
}

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

  let newPrices: PriceData[] = [];

  if (cachedPrices && cachedPrices.updatedAt && isCachedPricesValid(cachedPrices.updatedAt)) {
    return cachedPrices.newPrices;
  }

  const apiUrl = `https://api.coingecko.com/api/v3/coins/${tokenName}/market_chart`;
  const params = { vs_currency: 'usd', days: duration };

  const response = await axios.get(apiUrl, { params });

  newPrices = response.data.prices.map((price: number[]) => ({
    timestamp: price[0],
    price: price[1],
  }));

  localStorage.setItem(cacheKey, JSON.stringify({ newPrices, updatedAt: new Date().toISOString() }));

  return newPrices;
};

export const getTimeLabel = (duration: number): string => {
    switch (duration) {
      case 1:
        return 'TODAY';
      case 3:
        return '3 DAYS';
      case 30:
        return '1 MONTH';
      case 180:
        return '6 MONTH';
      case 365:
        return '1 YEAR';
      case 365 * 5:
        return 'ALL';
      default:
        return `${duration} DAYS`;
    }
  };
  