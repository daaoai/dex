'use client';

import { Button } from '@/shadcn/components/ui/button';
import { Token } from '@/types/tokens';
import { truncateNumber } from '@/utils/truncateNumber';
import { LayoutGroup, motion } from 'framer-motion';
import { RotateCcw, Search, ZoomIn } from 'lucide-react';
import Text from '../ui/Text';

type ChartDataPoint = {
  time: number;
  value: number;
};

type ChartAPI = {
  updateData: (newData: ChartDataPoint[]) => void;
};

interface RangeSelectorProps {
  selectedRange: 'full' | 'custom';
  srcTokenDetails: Token;
  destTokenDetails: Token;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  selectedTimeframe: string;
  handleRangeSelection: (range: 'full' | 'custom') => void;
  increaseMinPrice: () => void;
  increaseMaxPrice: () => void;
  decreaseMinPrice: () => void;
  decreaseMaxPrice: () => void;
  setSelectedTimeframe: (timeframe: string) => void;
  chartRef: React.MutableRefObject<ChartAPI | null>;
  chartContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function RangeSelector({
  srcTokenDetails,
  destTokenDetails,
  selectedRange,
  minPrice,
  maxPrice,
  selectedTimeframe,
  currentPrice,
  handleRangeSelection,
  increaseMinPrice,
  increaseMaxPrice,
  decreaseMinPrice,
  decreaseMaxPrice,
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
              <Button
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
              </Button>
            ))}
          </div>
        </LayoutGroup>
      </div>
      <Text type="p" className="text-sm text-gray-400">
        Providing full range liquidity ensures continuous market participation across all possible prices...
      </Text>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <div>
            Market price:
            <Text type="p" className="font-medium">
              {currentPrice} {destTokenDetails.symbol} = 1 {srcTokenDetails.symbol}
            </Text>
          </div>
          <div className="flex space-x-2">
            <Text type="p" className="text-sm">
              {srcTokenDetails.symbol}
            </Text>
            <Text type="p" className="text-sm">
              {destTokenDetails.symbol}
            </Text>
          </div>
        </div>
        <div className="relative h-40 bg-zinc-800 rounded-md overflow-hidden">
          <div ref={chartContainerRef} className="w-full h-full" />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {['1D', '1W', '1M', '1Y', 'All time'].map((period) => (
              <Button
                key={period}
                className={`px-3 py-1 rounded-md text-xs transition-colors ${
                  selectedTimeframe === period ? 'bg-zinc-700' : 'bg-zinc-800 '
                }`}
                onClick={() => setSelectedTimeframe(period)}
              >
                {period}
              </Button>
            ))}
          </div>
          <div className="flex space-x-1">
            <Button className="bg-zinc-800 p-1 rounded-md " title="search">
              <Search size={16} />
            </Button>
            <Button className="bg-zinc-800 p-1 rounded-md " title="zoom">
              <ZoomIn size={16} />
            </Button>
            <Button
              className="bg-zinc-800 p-1 rounded-md  flex items-center"
              onClick={() => setSelectedTimeframe('1D')}
            >
              <RotateCcw size={16} />
              <Text type="span" className="ml-1 text-xs">
                Reset
              </Text>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="relative bg-zinc-800 p-3 rounded-md">
            <label className="text-sm text-gray-400" htmlFor="minPrice">
              Min price
            </label>
            <div className="text-3xl font-bold mt-1">
              {selectedRange === 'full' ? '0' : truncateNumber(minPrice, 4)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {destTokenDetails.symbol} = 1 {srcTokenDetails.symbol}
            </div>

            {selectedRange !== 'full' && (
              <div className="absolute right-2 bottom-2 flex flex-col space-y-1">
                <Button
                  className="w-7 h-7 flex items-center justify-center text-lg font-bold bg-zinc-700  rounded-md"
                  onClick={increaseMinPrice}
                >
                  +
                </Button>
                <button
                  className="w-7 h-7 flex items-center justify-center text-lg font-bold bg-zinc-700  rounded-md"
                  onClick={decreaseMinPrice}
                >
                  −
                </button>
              </div>
            )}
          </div>

          <div className="relative bg-zinc-800 p-3 rounded-md">
            <label className="text-sm text-gray-400" htmlFor="maxPrice">
              Max price
            </label>
            <div className="text-3xl font-bold mt-1">
              {selectedRange === 'full' ? '∞' : truncateNumber(maxPrice, 4)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {destTokenDetails.symbol} = 1 {srcTokenDetails.symbol}
            </div>

            {/* Overlay controls */}
            {selectedRange !== 'full' && (
              <div className="absolute right-2 bottom-2 flex flex-col space-y-1">
                <Button
                  className="w-7 h-7 flex items-center justify-center text-lg font-bold bg-zinc-700  rounded-md"
                  onClick={increaseMaxPrice}
                >
                  +
                </Button>
                <Button
                  className="w-7 h-7 flex items-center justify-center text-lg font-bold bg-zinc-700  rounded-md"
                  onClick={decreaseMaxPrice}
                >
                  −
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
