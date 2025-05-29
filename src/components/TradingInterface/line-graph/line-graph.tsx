import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { chartOptions, crosshairPlugin, gradientPlugin, endOfLineLegendPlugin } from './chart-options';
import { LoaderCircle } from 'lucide-react';
import 'chartjs-plugin-zoom';

interface LineGraphProps {
  duration: number;
  tokenName?: string;
  setTokenState: React.Dispatch<React.SetStateAction<TokenState>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  vsCurrency: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chartRef?: any;
}

interface PriceData {
  timestamp: number;
  price: number;
}

interface TokenState {
  percentageDiff?: number;
  diff?: number;
  time?: string;
  type?: 'positive' | 'negative';
}

interface CachedPrices {
  newPrices: PriceData[];
  updatedAt: string;
}

export const LineGraph: React.FC<LineGraphProps> = ({
  duration,
  tokenName,
  setTokenState,
  loading,
  setLoading,
  vsCurrency,
  chartRef,
}) => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [error, setError] = useState<string | null>(null);
   

  const cacheKey = useMemo(() => `${tokenName}_${duration}_${vsCurrency}`, [tokenName, duration, vsCurrency]);

  const cachedPrices: CachedPrices | null = useMemo(() => {
    const cachedData = localStorage.getItem(cacheKey);
    return cachedData ? JSON.parse(cachedData) : null;
  }, [cacheKey]);

  const isCachedPricesValid = (updatedAt: string): boolean => {
    const currTime = Date.now();
    const prevUpdatedAt = Date.parse(updatedAt);
    return currTime - prevUpdatedAt < 10 * 60 * 1000;
  };

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError(null);

      try {
        let newPrices: PriceData[] = [];

        if (cachedPrices && cachedPrices.updatedAt && isCachedPricesValid(cachedPrices.updatedAt)) {
          newPrices = cachedPrices.newPrices;
        } else {
          const apiUrl = `https://api.coingecko.com/api/v3/coins/${tokenName}/market_chart`;
          const params = { vs_currency: vsCurrency, days: duration };

          const response = await axios.get(apiUrl, { params });

          newPrices = response.data.prices.map((price: number[]) => ({
            timestamp: price[0],
            price: price[1],
          }));

          localStorage.setItem(cacheKey, JSON.stringify({ newPrices, updatedAt: new Date().toISOString() }));
        }

        if (newPrices.length > 0) {
          const firstValue = newPrices[0].price || 0;
          const lastValue = newPrices[newPrices.length - 1].price || 0;
          const diff = lastValue - firstValue;
          const percentageDiff = (diff / lastValue) * 100;

          let time = '';
          switch (duration) {
            case 1:
              time = 'TODAY';
              break;
            case 3:
              time = '3 DAYS';
              break;
            case 30:
              time = '1 MONTH';
              break;
            case 180:
              time = '6 MONTH';
              break;
            case 365:
              time = '1 YEAR';
              break;
            case 365 * 5:
              time = 'ALL';
              break;
          }

          const type: 'positive' | 'negative' = diff >= 0 ? 'positive' : 'negative';

          setTokenState({
            percentageDiff: Math.abs(percentageDiff),
            diff: diff * 100,
            time,
            type,
          });
        }

        setPrices(newPrices);
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.response?.status === 429) {
          setTimeout(fetchPrices, 10000);
          if (cachedPrices) setPrices(cachedPrices.newPrices);
          console.warn('Too many requests. Retrying...');
          return;
        }

        console.error('Error fetching data:', error);
        setError('Unable to fetch data. Please try again.');
        setLoading(false);
      }
    };

    if (tokenName) fetchPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, tokenName, vsCurrency, cacheKey, cachedPrices, setTokenState]);

  const chartData = {
    labels: prices.map((p: PriceData) => {
      const formats: { [key: number]: string } = {
        1: 'MMM DD, HH:mm',
        3: 'MMM DD, HH:mm',
        30: 'MMM DD',
        180: 'MMM DD YYYY',
        365: 'MMM DD, YYYY',
        [365 * 5]: 'MMM DD, YYYY',
      };
      return moment(p.timestamp).format(formats[duration] || 'MMM DD, YYYY');
    }),
    datasets: [
      {
        label: '',
        data: prices.map((p: PriceData) => Number(p.price.toFixed(3))),
        fill: true,
        borderColor: '#ff38c7',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backgroundColor: (ctx: any) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return null;

          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          return gradient;
        },
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="w-full h-40 p-2 rounded-lg bg-[#372331] dark:bg-gray-900 shadow-md">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          {error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <div className="flex items-center justify-center h-32">
              <LoaderCircle className="h-10 w-10 text-[#ff36c7] animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <Line
          ref={chartRef}
          data={chartData}
          options={chartOptions}
          plugins={[crosshairPlugin, gradientPlugin, endOfLineLegendPlugin]}
        />
      )}
    </div>
  );
};
