import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { chartOptions, crosshairPlugin, gradientPlugin } from './chart-options';
import { LoaderCircle } from 'lucide-react';
import 'chartjs-plugin-zoom';
import Text from '../ui/Text';
import { fetchPrices, getTimeLabel } from '@/utils/linegraphUtils';
import axios from 'axios';
import { CachedPrices, LineGraphProps, PriceData } from '@/types/linegraph';

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

  const localRef = useRef<Line>(null);
  const ref = chartRef ?? localRef;

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
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
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
  }, [duration, tokenName, cacheKey, cachedPrices, setLoading, setTokenState]);

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
        backgroundColor: 'transparent',
        tension: 0.1,
        pointRadius: 0,
      },
    ],
  };

  return (
    <div className="w-full h-40 p-2 rounded-lg bg-magenta-2 shadow-md">
      {loading ? (
        <div className="h-[150px] flex flex-col items-center justify-center">
          {error ? (
            <Text type="p" className="text-rose text-center">
              {error}
            </Text>
          ) : (
            <div className="flex items-center justify-center h-32">
              <LoaderCircle className="h-10 w-10 text-magenta animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <Line ref={ref} data={chartData} options={chartOptions} plugins={[crosshairPlugin, gradientPlugin]} />
      )}
    </div>
  );
};
