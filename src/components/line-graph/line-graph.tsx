import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { chartOptions, crosshairPlugin, gradientPlugin } from './chart-options';
import { LoaderCircle } from 'lucide-react';
import 'chartjs-plugin-zoom';
import Text from '../ui/Text';
import { fetchPrices, getTimeLabel } from '@/utils/linegraphUtils';

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

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const newPrices = await fetchPrices({
          tokenName: tokenName!,
          duration,
          cacheKey,
          cachedPrices,
        });

        if (newPrices.length > 0) {
          const firstValue = newPrices[0].price || 0;
          const lastValue = newPrices[newPrices.length - 1].price || 0;
          const diff = lastValue - firstValue;
          const percentageDiff = (diff / lastValue) * 100;

          const time = getTimeLabel(duration);
          const type: 'positive' | 'negative' = diff >= 0 ? 'positive' : 'negative';

          setTokenState({
            percentageDiff: Math.abs(percentageDiff),
            diff: diff * 100,
            time,
            type,
          });
        }

        setPrices(newPrices);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.response?.status === 429) {
          console.warn('Too many requests. Retrying...');
          if (cachedPrices) setPrices(cachedPrices.newPrices);
          setTimeout(load, 10000);
          return;
        }

        console.error('Error fetching data:', error);
        setError('Unable to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (tokenName) load();
  }, [duration, tokenName, cacheKey, cachedPrices]);
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
    <div className="bg-pink-500/10">
      {loading ? (
        <div className="h-[150px] flex flex-col items-center justify-center">
          {error ? (
            <Text type="p" className="text-red-500 text-center">
              {error}
            </Text>
          ) : (
            <div className="flex items-center justify-center h-32">
              <LoaderCircle className="h-10 w-10 text-primary animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <Line ref={chartRef} data={chartData} options={chartOptions} plugins={[crosshairPlugin, gradientPlugin]} />
      )}
    </div>
  );
};
