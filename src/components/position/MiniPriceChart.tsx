'use client';

import { ChartDataPoint } from '@/types/pools';
import React, { useEffect, useRef, useState } from 'react';

interface MiniPriceChartProps {
  data: ChartDataPoint[];
  height?: number;
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
        className={`relative w-full rounded-lg p-2 flex items-center justify-center ${className}`}
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
        className={`relative w-full rounded-lg p-2 flex items-center justify-center ${className}`}
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

  const yPadding = (maxY - minY) * 0.1;
  const adjustedMinY = minY - yPadding;
  const adjustedMaxY = maxY + yPadding;

  const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * chartWidth + padding;
  const scaleY = (y: number) =>
    chartHeight - ((y - adjustedMinY) / (adjustedMaxY - adjustedMinY)) * chartHeight + padding;

  const pathData = validData
    .map((point, index) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const fillPathData =
    pathData +
    ` L ${scaleX(validData[validData.length - 1].x)} ${chartHeight + padding} L ${scaleX(validData[0].x)} ${chartHeight + padding} Z`;

  const trendColor = '#a855f7';

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl p-2 ${className}`}
      style={{ height, background: 'transparent' }}
    >
      <svg width={width} height={height} className="overflow-visible" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="mini-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={trendColor} stopOpacity={0.4} />
            <stop offset="100%" stopColor={trendColor} stopOpacity={0} />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path d={fillPathData} fill="url(#mini-gradient)" stroke="none" />

        <path
          d={pathData}
          fill="none"
          stroke={trendColor}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />

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
    </div>
  );
};
