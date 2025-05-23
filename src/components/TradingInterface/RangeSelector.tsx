'use client';

import { Search, ZoomIn, RotateCcw } from 'lucide-react';
import { motion, LayoutGroup } from 'framer-motion';

type ChartDataPoint = {
  time: number;
  value: number;
};

type ChartAPI = {
  updateData: (newData: ChartDataPoint[]) => void;
};

interface RangeSelectorProps {
  selectedRange: 'full' | 'custom';
  minPrice: string;
  maxPrice: string;
  selectedTimeframe: string;
  currentPrice: number;
  priceInUsd: number;
  handleRangeSelection: (range: 'full' | 'custom') => void;
  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;
  setSelectedTimeframe: (timeframe: string) => void;
  chartRef: React.MutableRefObject<ChartAPI | null>;
  chartContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function RangeSelector({
  selectedRange,
  minPrice,
  maxPrice,
  selectedTimeframe,
  currentPrice,
  priceInUsd,
  handleRangeSelection,
  setMinPrice,
  setMaxPrice,
  setSelectedTimeframe,
  chartContainerRef,
}: RangeSelectorProps) {
  const rangeOptions = ['full', 'custom'] as const;

  return (
    <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium">Set price range</h3>
      <div className="relative bg-zinc-800 p-1 rounded-md overflow-hidden">
        <LayoutGroup>
          <div className="relative bg-zinc-800 p-1 rounded-md overflow-hidden grid grid-cols-2">
            {rangeOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleRangeSelection(option)}
                className={`py-2 rounded-md text-center transition-colors relative z-10 ${
                  selectedRange === option ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {selectedRange === option && (
                  <motion.div
                    layoutId="rangeToggle"
                    className="absolute inset-0 bg-zinc-700 rounded-md z-0"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{option === 'full' ? 'Full Range' : 'Custom Range'}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>
      <p className="text-sm text-gray-400">
        Providing full range liquidity ensures continuous market participation across all possible prices...
      </p>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div>
            Market price:
            <p className="font-medium">
              {currentPrice.toFixed(6)} ETH = 1 USDC (${priceInUsd.toFixed(3)})
            </p>
          </div>
          <div className="flex space-x-2">
            <p className="text-sm">USDC</p>
            <p className="text-sm">ETH</p>
          </div>
        </div>
        <div className="relative h-40 bg-zinc-800 rounded-md overflow-hidden">
          <div ref={chartContainerRef} className="w-full h-full" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {['1D', '1W', '1M', '1Y', 'All time'].map((period) => (
              <button
                key={period}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  selectedTimeframe === period ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
                onClick={() => setSelectedTimeframe(period)}
              >
                {period}
              </button>
            ))}
          </div>
          <div className="flex space-x-1">
            <button className="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700" title="search">
              <Search size={16} />
            </button>
            <button className="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700" title="zoom">
              <ZoomIn size={16} />
            </button>
            <button
              className="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700 flex items-center"
              onClick={() => setSelectedTimeframe('1D')}
            >
              <RotateCcw size={16} />
              <span className="ml-1 text-xs">Reset</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {/* Min Price */}
          <div className="relative bg-zinc-800 p-3 rounded-md">
            <label className="text-sm text-gray-400" htmlFor="minPrice">
              Min price
            </label>
            <div className="text-3xl font-bold mt-1">{minPrice}</div>
            <div className="text-sm text-gray-400 mt-1">USDT = 1 ETH</div>

            {/* Overlay controls */}
            <div className="absolute right-2 bottom-2 flex flex-col space-y-1">
              <button
                className="w-7 h-7 flex items-center justify-center text-lg font-bold bg-zinc-700 hover:bg-zinc-600 rounded-md"
                onClick={() => setMinPrice(Math.max(0, parseFloat(minPrice || '0') + 0.000001).toFixed(6))}
                disabled={selectedRange === 'full'}
              >
                +
              </button>
              <button
                className="w-7 h-7 flex items-center justify-center text-lg font-bold bg-zinc-700 hover:bg-zinc-600 rounded-md"
                onClick={() => setMinPrice(Math.max(0, parseFloat(minPrice || '0') - 0.000001).toFixed(6))}
                disabled={selectedRange === 'full'}
              >
                −
              </button>
            </div>
          </div>

          {/* Max Price */}
          <div className="relative bg-zinc-800 p-3 rounded-md">
            <label className="text-sm text-gray-400" htmlFor="maxPrice">
              Max price
            </label>
            <div className="text-3xl font-bold mt-1">{maxPrice}</div>
            <div className="text-sm text-gray-400 mt-1">USDT = 1 ETH</div>

            {/* Overlay controls */}
            <div className="absolute right-2 bottom-2 flex flex-col space-y-1">
              <button
                className="w-7 h-7 flex items-center justify-center text-lg font-bold bg-zinc-700 hover:bg-zinc-600 rounded-md"
                onClick={() => setMaxPrice(Math.max(0, parseFloat(maxPrice || '0') + 0.000001).toFixed(6))}
                disabled={selectedRange === 'full'}
              >
                +
              </button>
              <button
                className="w-7 h-7 flex items-center justify-center text-lg font-bold bg-zinc-700 hover:bg-zinc-600 rounded-md"
                onClick={() => setMaxPrice(Math.max(0, parseFloat(maxPrice || '0') - 0.000001).toFixed(6))}
                disabled={selectedRange === 'full'}
              >
                −
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
