'use client';

import Text from '@/components/ui/Text';
import { CoinGeckoService } from '@/services/coinGeckoService';
import { Token } from '@/types/tokens';
import { formatChartDate } from '@/utils/dateFormatting';
import { truncateNumber } from '@/utils/truncateNumber';
import { LineChart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import SwapModal from '../swap/SwapModal';

const chartDays = [
  { label: '24 Hours', value: 1 },
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
  { label: '1 Year', value: 365 },
  // { label: 'Max', value: 'max' },
];

// Cache for storing fetched data
const priceDataCache = new Map<string, { data: number[][]; timestamp: number }>();

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

type TokenDetailsClientProps = {
  chainId: number;
  token: Token & { coingeckoId?: string | null };
};

export const TokenDetailsClient = ({ token }: TokenDetailsClientProps) => {
  const [historicData, setHistoricData] = useState<number[][]>([]);
  const [days, setDays] = useState<number | string>(365);
  const [loading, setLoading] = useState(true);
  const [currency] = useState('usd');

  const coingeckoId = token.coingeckoId;

  // Generate cache key
  const cacheKey = `${coingeckoId}_${days}_${currency}`;

  // Get cached data if available and not expired
  const getCachedData = (key: string) => {
    const cached = priceDataCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  };

  // Set cached data
  const setCachedData = (key: string, data: number[][]) => {
    priceDataCache.set(key, { data, timestamp: Date.now() });
  };

  useEffect(() => {
    const fetchHistoricData = async () => {
      if (!coingeckoId) {
        setHistoricData([]);
        setLoading(false);
        return;
      }
      // Check cache first
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        setHistoricData(cachedData);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const priceData = await CoinGeckoService.getMarketChartData(coingeckoId, days, currency);

        if (priceData.length === 0) {
          setHistoricData([]);
        } else {
          // Cache the data
          setCachedData(cacheKey, priceData);
          setHistoricData(priceData);
        }
      } catch {
        setHistoricData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricData();
  }, [days, coingeckoId, currency, cacheKey]);

  return (
    <main className="flex flex-row gap-8 items-start justify-center bg-black p-8">
      <div className="w-full">
        <div className="bg-background-16 rounded-xl p-4">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-white font-bold text-lg">{token.name} Price Chart</span>
            <select
              className="bg-background-2 text-white rounded px-2 py-1 text-sm"
              value={days}
              onChange={(e) => setDays(e.target.value === 'max' ? 'max' : Number(e.target.value))}
            >
              {chartDays.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="flex items-center justify-center text-center text-white space-y-3 bg-background rounded-lg h-[400px]">
              <div className="flex flex-col items-center">
                <div className="bg-zinc-800 p-3 rounded-full mb-3">
                  <LineChart className="w-6 h-6 text-zinc-400 animate-pulse" />
                </div>
                <Text type="p" className="text-lg font-semibold">
                  Loading Chart...
                </Text>
              </div>
            </div>
          ) : historicData.length === 0 ? (
            <div className="flex items-center justify-center text-center text-white space-y-3 bg-background rounded-lg h-[400px]">
              <div className="flex flex-col items-center">
                <div className="bg-zinc-800 p-3 rounded-full mb-3">
                  <LineChart className="w-6 h-6 text-red-400" />
                </div>
                <Text type="p" className="text-lg font-semibold">
                  Chart Data Not Available
                </Text>
              </div>
            </div>
          ) : (
            <Line
              data={{
                labels: historicData.map((point) => {
                  return formatChartDate(point[0], days);
                }),
                datasets: [
                  {
                    data: historicData.map((point) => point[1]),
                    label: `Price (Past ${days} Days) in ${currency.toUpperCase()}`,
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34,197,94,0.1)',
                    fill: true,
                  },
                ],
              }}
              options={{
                responsive: true,
                legend: {
                  display: false,
                },
                tooltips: {
                  callbacks: {
                    label: function (tooltipItem) {
                      const value = tooltipItem.yLabel;
                      return truncateNumber(value || '0');
                    },
                  },
                },
                elements: { point: { radius: 1 } },
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        callback: function (value: number | string) {
                          return truncateNumber(value);
                        },
                      },
                    },
                  ],
                  xAxes: [
                    {
                      ticks: {
                        autoSkip: true,
                        maxTicksLimit: 8,
                      },
                    },
                  ],
                },
              }}
              height={400}
            />
          )}
        </div>
      </div>
      <div className="w-full max-w-md">
        <SwapModal initialDestToken={token} showLiveTokenFee={false} />
      </div>
    </main>
  );
};
