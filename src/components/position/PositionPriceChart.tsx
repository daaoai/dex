'use client';

import { ChartDataPoint } from '@/types/pools';
import { HistoryDuration } from '@/types/positions';
import { LineChart, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface PositionPriceChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  strokeColor?: string;
  token0Symbol: string;
  token1Symbol: string;
  currentPrice: number;
  className?: string;
  duration?: HistoryDuration;
  onDurationChange?: (duration: HistoryDuration) => void;
  loading?: boolean;
}

export const PositionPriceChart: React.FC<PositionPriceChartProps> = ({
  data,
  height = 400,
  showGrid = true,
  strokeColor = '#22c55e',
  token0Symbol,
  token1Symbol,
  currentPrice,
  className = '',
  duration = 'WEEK',
  onDurationChange,
  loading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]?.contentRect?.width) {
        setWidth(entries[0].contentRect.width - 20); // Reduced padding for more square appearance
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const validData =
    data?.filter(
      (d) =>
        d &&
        typeof d.x === 'number' &&
        typeof d.y === 'number' &&
        !isNaN(d.x) &&
        !isNaN(d.y) &&
        isFinite(d.x) &&
        isFinite(d.y) &&
        d.y > 0,
    ) || [];

  // Define helper functions before early return
  const formatPrice = (price: number) => {
    if (price < 0.0001) {
      return price.toExponential(4);
    }
    return price.toFixed(price < 1 ? 6 : 4);
  };

  if (validData.length === 0) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full rounded-lg bg-background p-3 ${className}`}
        style={{ height }}
      >
        {/* Header with duration controls - always show when onDurationChange is available */}
        {onDurationChange && (
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-400">
                  {formatPrice(currentPrice)} {token1Symbol} = 1 {token0Symbol}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-zinc-800 rounded-lg p-1">
                {(['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'] as HistoryDuration[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => onDurationChange(d)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      duration === d ? 'bg-green-500 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                    }`}
                  >
                    {d === 'HOUR' ? '1H' : d === 'DAY' ? '1D' : d === 'WEEK' ? '1W' : d === 'MONTH' ? '1M' : '1Y'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty state content */}
        <div
          className={`flex flex-col items-center justify-center text-zinc-400 ${onDurationChange ? 'h-[calc(100%-60px)]' : 'h-full'}`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mb-3"></div>
              <p className="text-lg font-semibold mb-1">Loading Price Data...</p>
              <p className="text-sm text-zinc-400 text-center max-w-xs">
                Fetching historical price information from subgraph
              </p>
            </>
          ) : (
            <>
              <div className="bg-zinc-800 p-3 rounded-full mb-3">
                <LineChart className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-lg font-semibold mb-1">No Data Available</p>
              <p className="text-sm text-zinc-400 text-center max-w-xs">
                No price data available for this timeframe. Try a different duration.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  const values = validData.map((d) => d.y);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue === minValue ? maxValue * 0.1 : maxValue - minValue;
  const padding = range * 0.1;
  const chartHeight = height - 80; // More space for header, less for removed Y-axis labels
  const firstPrice = validData[0]?.y || currentPrice;
  const lastPrice = validData[validData.length - 1]?.y || currentPrice;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;

  // Determine color based on price change
  const isPositive = priceChange >= 0;
  const dynamicColor = isPositive ? '#22c55e' : '#ef4444';
  const displayColor = strokeColor === '#22c55e' ? dynamicColor : strokeColor;

  const points = validData.map((point, index) => {
    const x = (index / Math.max(1, validData.length - 1)) * width;
    const y = chartHeight - ((point.y - minValue + padding) / (range + 2 * padding)) * chartHeight;
    return { x: isFinite(x) ? x : 0, y: isFinite(y) ? y : chartHeight / 2, originalPoint: point };
  });

  const pathD = points.length > 0 ? `M${points.map((p) => `${p.x},${p.y}`).join(' L')}` : '';

  const gradientId = `position-gradient-${validData.length}-${minValue.toFixed(2).replace('.', '-')}-${maxValue.toFixed(2).replace('.', '-')}`;

  const handleMouseMove = (event: React.MouseEvent<SVGElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - 10; // Reduced padding offset

    // Find the closest data point
    let closestPoint = null;
    let minDistance = Infinity;

    points.forEach((point) => {
      const distance = Math.abs(point.x - mouseX);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point.originalPoint;
      }
    });

    if (closestPoint && minDistance < 30) {
      // Only show tooltip if mouse is close enough
      setHoveredPoint(closestPoint);
      setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const formatTimestamp = (timestamp: number) => {
    // Handle invalid or missing timestamps
    if (!timestamp || isNaN(timestamp) || timestamp <= 0) {
      return 'Recent';
    }

    let date: Date;

    // Check if timestamp is in seconds instead of milliseconds
    if (timestamp < 1000000000000) {
      // If timestamp is less than year 2001 in milliseconds
      date = new Date(timestamp * 1000);
    } else {
      date = new Date(timestamp);
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Recent';
    }

    // Check if date is unreasonably far in the future or past
    const now = Date.now();
    const oneYearFromNow = now + 365 * 24 * 60 * 60 * 1000;
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

    if (date.getTime() > oneYearFromNow || date.getTime() < oneYearAgo) {
      console.warn('Invalid timestamp detected:', timestamp, 'converted to:', date.toISOString());
      return 'Recent';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div ref={containerRef} className={`relative w-full rounded-lg bg-background p-3 ${className}`} style={{ height }}>
      {/* Header with price info and duration controls */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">
              {formatPrice(currentPrice)} {token1Symbol} = 1 {token0Symbol}
            </span>
            {priceChangePercent !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {isPositive ? '+' : ''}
                  {priceChangePercent.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDurationChange && validData.length > 0 && (
            <div className="flex bg-zinc-800 rounded-lg p-1">
              {(['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'] as HistoryDuration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => onDurationChange(d)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    duration === d ? 'bg-green-500 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
                  }`}
                >
                  {d === 'HOUR' ? '1H' : d === 'DAY' ? '1D' : d === 'WEEK' ? '1W' : d === 'MONTH' ? '1M' : '1Y'}
                </button>
              ))}
            </div>
          )}
          {validData.length > 0 && <div className="text-xs text-zinc-500">{validData.length} data points</div>}
        </div>
      </div>

      {/* Chart SVG */}
      <svg
        width={width + 20}
        height={chartHeight + 20}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={displayColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={displayColor} stopOpacity="0.05" />
          </linearGradient>
          {showGrid && (
            <pattern id="position-grid" width="50" height="20" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3" />
            </pattern>
          )}
        </defs>

        <g transform="translate(10, 10)">
          {showGrid && <rect width={width} height={chartHeight} fill="url(#position-grid)" />}

          {/* Area fill */}
          {pathD && (
            <path
              d={`${pathD} L${width},${chartHeight} L0,${chartHeight} Z`}
              fill={`url(#${gradientId})`}
              stroke="none"
            />
          )}

          {/* Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={displayColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={hoveredPoint === point.originalPoint ? 4 : 0}
              fill={displayColor}
              className="transition-all duration-200 cursor-pointer"
              stroke="white"
              strokeWidth={hoveredPoint === point.originalPoint ? 2 : 0}
            />
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-10 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white pointer-events-none shadow-lg"
          style={{
            left: Math.min(mousePosition.x + 10, width - 150),
            top: mousePosition.y - 60,
          }}
        >
          <div className="font-semibold">
            {formatPrice(hoveredPoint.y)} {token1Symbol}
          </div>
          <div className="text-zinc-400">{formatTimestamp(hoveredPoint.timestamp)}</div>
        </div>
      )}
    </div>
  );
};
