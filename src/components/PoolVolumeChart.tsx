'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChartDataPoint } from '@/types/pools';

interface PoolVolumeChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  strokeColor?: string;
}

export const PoolVolumeChart: React.FC<PoolVolumeChartProps> = ({
  data,
  height = 300,
  showGrid = true,
  strokeColor = '#ec4899',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (entries[0]?.contentRect?.width) {
        setWidth(entries[0].contentRect.width);
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
        isFinite(d.y),
    ) || [];

  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500  rounded" style={{ height: `${height}px` }}>
        No chart data available
      </div>
    );
  }

  const values = validData.map((d) => d.y);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue === minValue ? 0 : maxValue - minValue;
  const padding = range === 0 ? maxValue * 0.05 || 0.1 : range * 0.1;
  const chartHeight = height - 40;

  const points = validData
    .map((point, index) => {
      const x = (index / Math.max(1, validData.length - 1)) * width;
      const y = chartHeight - ((point.y - minValue + padding) / (range + 2 * padding)) * chartHeight;
      return `${isFinite(x) ? x : 0},${isFinite(y) ? y : chartHeight / 2}`;
    })
    .join(' L');

  const pathD = points ? `M${points}` : '';
  const gradientId = `gradient-${validData.length}-${minValue.toFixed(2).replace('.', '-')}-${maxValue
    .toFixed(2)
    .replace('.', '-')}`;

  return (
    <div ref={containerRef} className="relative w-full rounded p-4 " style={{ height }}>
      <svg width={width} height="100%" className="overflow-visible pl-5">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
          </linearGradient>
          {showGrid && (
            <pattern id="grid" width="50" height="20" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.5" />
            </pattern>
          )}
        </defs>

        {showGrid && <rect width={width} height={height} fill="url(#grid)" />}

        {/* Area fill */}
        <path d={`${pathD} L${width},${chartHeight} L0,${chartHeight} Z`} fill={`url(#${gradientId})`} stroke="none" />

        {/* Line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {validData.map((point, index) => {
          const x = (index / Math.max(1, validData.length - 1)) * width;
          const y = chartHeight - ((point.y - minValue + padding) / (range + 2 * padding)) * chartHeight;
          return (
            <circle
              key={index}
              cx={isFinite(x) ? x : 0}
              cy={isFinite(y) ? y : chartHeight / 2}
              r="0"
              fill={strokeColor}
              className="hover:r-2 transition-all duration-200"
            >
              <title>${point.y.toFixed(2)}</title>
            </circle>
          );
        })}
      </svg>

      {/* Y-axis labels */}
      {showGrid && (
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-4 pointer-events-none">
          <span>${maxValue.toFixed(2)}</span>
          <span>${((maxValue + minValue) / 2).toFixed(2)}</span>
          <span>${minValue.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};
