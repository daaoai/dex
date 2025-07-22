'use client';

import { ChartDataPoint } from '@/types/pools';
import React, { useEffect, useRef, useState } from 'react';

interface MiniPriceChartProps {
  data: ChartDataPoint[];
  height?: number;
  strokeColor?: string;
  className?: string;
  loading?: boolean;
}

export const MiniPriceChart: React.FC<MiniPriceChartProps> = ({
  data,
  height = 120,
  className = '',
  loading = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]?.contentRect?.width) {
        setWidth(entries[0].contentRect.width - 20);
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

  if (loading) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full rounded-lg bg-black p-2 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-zinc-400 text-xs">Loading...</div>
      </div>
    );
  }

  if (validData.length === 0) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full rounded-lg bg-black p-2 flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-zinc-400 text-xs">No data</div>
      </div>
    );
  }

  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const xValues = validData.map((d) => d.x);
  const yValues = validData.map((d) => d.y);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  // Add small padding to y-axis to prevent touching edges
  const yPadding = (maxY - minY) * 0.1;
  const adjustedMinY = minY - yPadding;
  const adjustedMaxY = maxY + yPadding;

  const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * chartWidth + padding;
  const scaleY = (y: number) =>
    chartHeight - ((y - adjustedMinY) / (adjustedMaxY - adjustedMinY)) * chartHeight + padding;

  // Create path string
  const pathData = validData
    .map((point, index) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Create gradient fill path
  const fillPathData =
    pathData +
    ` L ${scaleX(validData[validData.length - 1].x)} ${chartHeight + padding} L ${scaleX(validData[0].x)} ${chartHeight + padding} Z`;

  // Determine trend
  const firstPrice = validData[0]?.y || 0;
  const lastPrice = validData[validData.length - 1]?.y || 0;
  const isPositive = lastPrice >= firstPrice;

  const trendColor = isPositive ? '#22c55e' : '#ef4444';

  return (
    <div ref={containerRef} className={`relative w-full rounded-lg bg-black p-2 ${className}`} style={{ height }}>
      <svg width={width} height={height} className="overflow-visible" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={`gradient-${Math.random()}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trendColor} stopOpacity={0.3} />
            <stop offset="100%" stopColor={trendColor} stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* Fill area */}
        <path d={fillPathData} fill={`url(#gradient-${Math.random()})`} stroke="none" />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke={trendColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Last point indicator */}
        {validData.length > 0 && (
          <circle
            cx={scaleX(validData[validData.length - 1].x)}
            cy={scaleY(validData[validData.length - 1].y)}
            r={2}
            fill={trendColor}
            className="drop-shadow-sm"
          />
        )}
      </svg>

      {/* Price change indicator */}
      <div className="absolute top-2 right-2">
        <div className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}
          {(((lastPrice - firstPrice) / firstPrice) * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
