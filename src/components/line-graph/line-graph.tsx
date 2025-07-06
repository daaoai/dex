import {
  CachedPrices,
  ChartArea,
  ChartInstance,
  LineGraphProps,
  LiquidityDataPoint,
  PriceData,
  TickData,
} from '@/types/linegraph';
import { fetchPrices, getTimeLabel } from '@/utils/linegraphUtils';
import { LoaderCircle, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Text from '../ui/Text';
import { chartOptions, crosshairPlugin, gradientPlugin } from './chart-options';

// Mock liquidity data generator - fallback if API fails
const generateLiquidityData = (prices: PriceData[]): LiquidityDataPoint[] => {
  if (prices.length === 0) return [];
  const liquidityData: LiquidityDataPoint[] = [];
  const minPrice = Math.min(...prices.map((p) => p.price));
  const maxPrice = Math.max(...prices.map((p) => p.price));
  const priceRange = maxPrice - minPrice;
  for (let i = 0; i < 40; i++) {
    const price = minPrice + (priceRange * i) / 39;
    const liquidity = Math.max(
      0,
      1000 * Math.exp(-Math.pow((price - (minPrice + priceRange * 0.3)) / (priceRange * 0.1), 2)) +
        800 * Math.exp(-Math.pow((price - (minPrice + priceRange * 0.7)) / (priceRange * 0.15), 2)) +
        500 * Math.exp(-Math.pow((price - (minPrice + priceRange * 0.5)) / (priceRange * 0.2), 2)),
    );
    liquidityData.push({ price0: price, activeLiquidity: liquidity });
  }
  return liquidityData;
};

export const LineGraph: React.FC<LineGraphProps & { poolId?: string }> = ({
  duration,
  tokenName,
  setTokenState,
  loading,
  setLoading,
  vsCurrency,
  chartRef,
  poolId,
}) => {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [liquidityData, setLiquidityData] = useState<LiquidityDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [, setZoomLevel] = useState<number>(1);
  const [, setCurrentPrice] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartJsRef = chartRef;

  const cacheKey = useMemo(() => `${tokenName}_${duration}_${vsCurrency}`, [tokenName, duration, vsCurrency]);
  const cachedPrices: CachedPrices | null = useMemo(() => {
    const cachedData = localStorage.getItem(cacheKey);
    return cachedData ? JSON.parse(cachedData) : null;
  }, [cacheKey]);

  // Fetch price data
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
          setCurrentPrice(lastValue);
        }
        setPrices(newPrices);
      } catch (error) {
        console.error('error while loading graph', error);
        setError('Unable to fetch price data.');
      } finally {
        setLoading(false);
      }
    };
    if (tokenName) load();
  }, [duration, tokenName, cacheKey, cachedPrices, setLoading, setTokenState]);

  // Fetch real tick-level liquidity data
  useEffect(() => {
    const fetchLiquidity = async () => {
      if (!poolId) {
        setLiquidityData(generateLiquidityData(prices));
        return;
      }
      try {
        const res = await fetch(`/api/pool/${poolId}/liquidity`);
        if (!res.ok) throw new Error('Failed to fetch liquidity');
        const ticks: TickData[] = await res.json();
        // Convert tick data to LiquidityDataPoint[]
        let runningLiquidity = 0;
        const points: LiquidityDataPoint[] = ticks.map((tick: TickData) => {
          runningLiquidity += Number(tick.liquidityNet);
          return {
            price0: Number(tick.price0),
            activeLiquidity: runningLiquidity,
          };
        });
        setLiquidityData(points);
      } catch (e) {
        console.error('error while fetching pool liquidity', e);
        setLiquidityData(generateLiquidityData(prices)); // fallback
      }
    };
    if (prices.length > 0) fetchLiquidity();
  }, [poolId, prices]);

  // Chart.js data for price line
  const chartData = useMemo(() => {
    return {
      labels: prices.map((p) => new Date(p.timestamp)),
      datasets: [
        {
          label: '',
          data: prices.map((p) => p.price),
          fill: true,
          borderColor: '#ff38c7',
          backgroundColor: 'rgba(255,56,199,0.1)',
          tension: 0.1,
          pointRadius: 0,
        },
      ],
    };
  }, [prices]);

  // Get y-pixel for a price value using Chart.js y-scale
  const getYPixel = (price: number): number | null => {
    const chart = chartJsRef.current?.chartInstance as ChartInstance | undefined;
    if (!chart) return null;
    const yScale = chart.scales['y-axis-0'] || chart.scales['y'];
    if (!yScale) return null;
    return yScale.getPixelForValue(price);
  };

  // Get chart area for overlay alignment
  const getChartArea = (): ChartArea | null => {
    const chart = chartJsRef.current?.chartInstance as ChartInstance | undefined;
    if (!chart) return null;
    return chart.chartArea;
  };

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    const chart = chartJsRef.current?.chartInstance as ChartInstance | undefined;
    if (chart && chart.zoom) chart.zoom(1.2);
    setZoomLevel((prev) => Math.min(prev * 1.2, 20));
  }, [chartJsRef]);
  const handleZoomOut = useCallback(() => {
    const chart = chartJsRef.current?.chartInstance as ChartInstance | undefined;
    if (chart && chart.zoom) chart.zoom(0.8);
    setZoomLevel((prev) => Math.max(prev * 0.8, 0.00001));
  }, [chartJsRef]);
  const handleResetZoom = useCallback(() => {
    const chart = chartJsRef.current?.chartInstance as ChartInstance | undefined;
    if (chart && chart.resetZoom) chart.resetZoom();
    setZoomLevel(1);
  }, [chartJsRef]);

  // Liquidity bars overlay
  const LiquidityOverlay = () => {
    const chartArea = getChartArea();
    if (!chartArea || liquidityData.length === 0) {
      console.log('No chartArea or liquidityData for overlay', { chartArea, liquidityData });
      return null;
    }
    const maxLiquidity = Math.max(...liquidityData.map((l) => l.activeLiquidity));
    const priceMin = Math.min(...prices.map((p) => p.price));
    const priceMax = Math.max(...prices.map((p) => p.price));
    console.log('Rendering LiquidityOverlay', { liquidityData, maxLiquidity, chartArea, priceMin, priceMax });
    return (
      <svg
        style={{
          position: 'absolute',
          top: chartArea.top,
          left: chartArea.right + 4,
          width: 40,
          height: chartArea.bottom - chartArea.top,
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {liquidityData.map((l, i) => {
          if (l.price0 < priceMin || l.price0 > priceMax) return null;
          const y = getYPixel(l.price0);
          if (y === null || y < chartArea.top || y > chartArea.bottom) {
            console.log('Skipping bar', { i, price0: l.price0, y });
            return null;
          }
          const barLength = Math.max(10, (l.activeLiquidity / maxLiquidity) * 36);
          console.log('Drawing bar', { i, price0: l.price0, y, barLength });
          return (
            <rect
              key={i}
              x={0}
              y={y - chartArea.top - 2}
              width={barLength}
              height={4}
              fill="#ff38c7"
              opacity={0.6}
              rx={2}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="w-full h-40 p-2 rounded-lg bg-magenta-2 shadow-md relative" ref={containerRef}>
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-1">
        <button
          onClick={handleZoomIn}
          className="p-1 bg-magenta/20 hover:bg-magenta/30 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4 text-magenta" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1 bg-magenta/20 hover:bg-magenta/30 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4 text-magenta" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1 bg-magenta/20 hover:bg-magenta/30 rounded transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="h-4 w-4 text-magenta" />
        </button>
      </div>
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
        <div className="relative h-full w-full">
          <Line
            ref={chartJsRef}
            data={chartData}
            options={chartOptions}
            plugins={[crosshairPlugin, gradientPlugin]}
            height={150}
            redraw
          />
          <LiquidityOverlay />
          {/* Chart Title */}
          <div className="absolute top-2 left-2 z-10">
            {/* <Text type="p" className="text-magenta text-sm font-medium">
              Price & Liquidity
            </Text> */}
          </div>
        </div>
      )}
    </div>
  );
};
