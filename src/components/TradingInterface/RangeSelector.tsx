'use client';

import { Search, ZoomIn, RotateCcw } from 'lucide-react';

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
  return (
    <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium">Set price range</h3>
      <div className="grid grid-cols-2 gap-2 bg-zinc-800 p-1 rounded-md">
        <button
          className={`py-2 rounded-md text-center transition-colors ${
            selectedRange === 'full' ? 'bg-zinc-700' : 'hover:bg-zinc-700'
          }`}
          onClick={() => handleRangeSelection('full')}
        >
          Full Range
        </button>
        <button
          className={`py-2 rounded-md text-center transition-colors ${
            selectedRange === 'custom' ? 'bg-zinc-700' : 'hover:bg-zinc-700'
          }`}
          onClick={() => handleRangeSelection('custom')}
        >
          Custom Range
        </button>
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
          <div className="bg-zinc-800 p-3 rounded-md">
            <label className="text-sm text-gray-400" htmlFor="minPrice">
              Min price
            </label>
            <input
              id="minPrice"
              type="text"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              disabled={selectedRange === 'full'}
              className="text-3xl font-bold bg-transparent outline-none w-full disabled:opacity-50"
            />
            <div className="text-sm text-gray-400">USDT = 1 ETH</div>
          </div>

          <div className="bg-zinc-800 p-3 rounded-md">
            <label className="text-sm text-gray-400" htmlFor="maxPrice">
              Max price
            </label>
            <input
              id="maxPrice"
              type="text"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              disabled={selectedRange === 'full'}
              className="text-3xl font-bold bg-transparent outline-none w-full disabled:opacity-50"
            />
            <div className="text-sm text-gray-400">USDT = 1 ETH</div>
          </div>
        </div>
      </div>
    </div>
  );
}
