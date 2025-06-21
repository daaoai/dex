import React from 'react';
import { ChartDataPoint } from '@/types/pools';

interface SimpleLineChartProps {
  data: ChartDataPoint[];
  height?: number;
  showGrid?: boolean;
  strokeColor?: string;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  height = 300,
  showGrid = true,
  strokeColor = '#ec4899',
}) => {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-gray-500 bg-gray-800 rounded"
        style={{ height: `${height}px` }}
      >
        No chart data available
      </div>
    );
  }

  // Find min and max values for scaling
  const values = data.map((d) => d.y);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% padding

  // Create SVG path
  const width = 600;
  const chartHeight = height - 40; // Leave space for labels

  const points = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = chartHeight - ((point.y - minValue + padding) / (range + 2 * padding)) * chartHeight;
      return `${x},${y}`;
    })
    .join(' L');

  const pathD = `M${points}`;

  // Create gradient for fill
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative bg-gray-900 rounded p-4" style={{ height: `${height}px` }}>
      <svg width="100%" height="100%" className="overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
          </linearGradient>
          {showGrid && (
            <defs>
              <pattern id="grid" width="50" height="20" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.5" />
              </pattern>
            </defs>
          )}
        </defs>

        {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}

        {/* Fill area */}
        <path d={`${pathD} L${width},${chartHeight} L0,${chartHeight} Z`} fill={`url(#${gradientId})`} stroke="none" />

        {/* Line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Hover points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = chartHeight - ((point.y - minValue + padding) / (range + 2 * padding)) * chartHeight;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
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
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-4">
          <span>${maxValue.toFixed(2)}</span>
          <span>${((maxValue + minValue) / 2).toFixed(2)}</span>
          <span>${minValue.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
};
