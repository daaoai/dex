import { baseURL } from '@/constants/app';
import {
  HistoryDuration,
  PositionPriceData,
  UsePositionPriceDataOptions,
  UsePositionPriceDataReturn,
} from '@/types/positions';
import { useEffect, useRef, useState } from 'react';

// Global cache for position price data
const priceDataCache = new Map<
  string,
  {
    data: PositionPriceData;
    timestamp: number;
    duration: HistoryDuration;
  }
>();

// Cache TTL (Time To Live) - 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

const getCacheKey = (poolAddress: string, duration: HistoryDuration) => `${poolAddress.toLowerCase()}-${duration}`;

const getCachedData = (poolAddress: string, duration: HistoryDuration) => {
  const key = getCacheKey(poolAddress, duration);
  const cached = priceDataCache.get(key);

  if (!cached) return null;

  // Check if cache is still valid
  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    priceDataCache.delete(key);
    return null;
  }

  return cached.data;
};

const setCachedData = (poolAddress: string, duration: HistoryDuration, data: PositionPriceData) => {
  const key = getCacheKey(poolAddress, duration);
  priceDataCache.set(key, {
    data,
    timestamp: Date.now(),
    duration,
  });
};

export const usePositionPriceData = ({
  poolAddress,
  duration = 'WEEK',
  autoRefresh = false,
  refreshInterval = 60000, // 1 minute default
}: UsePositionPriceDataOptions): UsePositionPriceDataReturn => {
  const [data, setData] = useState<PositionPriceData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const fetchData = async (forceRefresh = false) => {
    if (!poolAddress) {
      setData(null);
      setError(null);
      return;
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = getCachedData(poolAddress, duration);
      if (cachedData) {
        setData(cachedData);
        setError(null);
        setLoading(false);
        return;
      }
    }

    // Prevent duplicate concurrent requests
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseURL}/api/position/price/${poolAddress}?duration=${duration}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setData(null);
          setError('Price data not found for this position');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const priceData: PositionPriceData = await response.json();

      // Cache the successful response
      setCachedData(poolAddress, duration, priceData);
      setData(priceData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch position price data';
      setError(errorMessage);
      console.error('Error fetching position price data:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const refetch = async () => {
    await fetchData(true); // Force refresh when manually refetching
  };

  useEffect(() => {
    fetchData();
  }, [poolAddress, duration]);

  useEffect(() => {
    if (!autoRefresh || !poolAddress) return;

    const interval = setInterval(() => {
      fetchData(true); // Force refresh for auto-refresh
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, poolAddress, duration]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};
