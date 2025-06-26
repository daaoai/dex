'use client';

import { Button } from '@/shadcn/components/ui/button';
import { Token } from '@/types/tokens';
import { truncateNumber } from '@/utils/truncateNumber';
import { LayoutGroup, motion } from 'framer-motion';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import Text from '../ui/Text';
import { LineGraphView } from '../line-graph';
import { useEffect, useState, useRef } from 'react';
import { ChartAPI, TokenState, ZoomableChart } from '@/types/linegraph';
import { Line } from 'react-chartjs-2';

interface RangeSelectorProps {
  selectedRange: 'full' | 'custom';
  srcTokenDetails: Token;
  destTokenDetails: Token;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  handleRangeSelection: (range: 'full' | 'custom') => void;
  increaseMinPrice: () => void;
  increaseMaxPrice: () => void;
  decreaseMinPrice: () => void;
  decreaseMaxPrice: () => void;
  chartRef: React.MutableRefObject<ChartAPI | null>;
  chartContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function RangeSelector({
  srcTokenDetails,
  destTokenDetails,
  selectedRange,
  minPrice,
  maxPrice,
  currentPrice,
  handleRangeSelection,
  increaseMinPrice,
  increaseMaxPrice,
  decreaseMinPrice,
  decreaseMaxPrice,
}: RangeSelectorProps) {
  const tabs = [
    { id: '1d', duration: 1 },
    { id: '3d', duration: 3 },
    { id: '1m', duration: 30 },
    { id: '6m', duration: 1800 },
    { id: '1y', duration: 365 },
    { id: 'max', duration: 3650 },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedTab, setSelectedTab] = useState<string>(activeTab.id || '1d');
  const chartRef = useRef<Line>({} as Line);
  const [isZoomed, setIsZoomed] = useState(false);
  const [tokenState, setTokenState] = useState<TokenState>({});

  useEffect(() => {
    if (selectedTab !== activeTab.id) {
      const newActiveTab = tabs.find((tab) => tab.id === selectedTab);
      if (newActiveTab) setActiveTab(newActiveTab);
    }
  }, [selectedTab, activeTab]);

  const handleTabClick = (tabId: string) => setSelectedTab(tabId);
  const rangeOptions = ['full', 'custom'] as const;

  const handleZoomOut = () => {
    if (chartRef.current && chartRef.current.chartInstance) {
      const zoomChart = chartRef.current?.chartInstance as ZoomableChart | undefined;
      zoomChart?.resetZoom();
    }
    setIsZoomed(false);
  };

  return (
    <div className="bg-background-4 rounded-lg p-4 space-y-4">
      <Text type="p" className="text-lg font-medium">
        Set price range
      </Text>
      <div className="relative bg-background-3 p-1 rounded-md overflow-hidden">
        <LayoutGroup>
          <div className="grid grid-cols-2">
            {rangeOptions.map((option) => (
              <Button
                key={option}
                onClick={() => handleRangeSelection(option)}
                className={`py-2 rounded-md text-center transition-colors relative z-10 bg-background-3 ${
                  selectedRange === option ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                {selectedRange === option && (
                  <motion.div
                    layoutId="rangeToggle"
                    className="absolute inset-0 bg-background-4 rounded-md z-0"
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
            <Text type="p">{srcTokenDetails.symbol}</Text>
            <Text type="p">{destTokenDetails.symbol}</Text>
          </div>
        </div>
        <div className="relative h-[150px] overflow-hidden bg-zinc-800">
          <motion.div
            className="absolute inset-0 origin-center"
            animate={{ scale: isZoomed ? 1.5 : 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <LineGraphView
              tokenName={destTokenDetails.coingeckoId}
              tokenState={tokenState}
              setTokenState={setTokenState}
              tabs={tabs}
              activeTabId={activeTab.id.toString()}
              chartRef={chartRef}
            />
          </motion.div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                className={`px-3 py-1 rounded-md text-xs ${
                  activeTab.id === tab.id ? 'bg-zinc-700' : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.id}
              </Button>
            ))}
          </div>
          <div className="flex space-x-1">
            <Button className="bg-zinc-800 p-1 rounded-md" title="search" onClick={() => handleZoomOut()}>
              <ZoomOut size={16} />
            </Button>
            <Button
              className="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700"
              title="zoom"
              onClick={() => setIsZoomed(true)}
            >
              <ZoomIn size={16} />
            </Button>
            <Button
              className="bg-zinc-800 p-1 rounded-md hover:bg-zinc-700 flex items-center"
              onClick={() => {
                setIsZoomed(false);
                handleZoomOut();
                setSelectedTab('1d');
              }}
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
            <label className="text-sm text-gray-400">Min price</label>
            <div className="text-3xl font-bold mt-1">
              {selectedRange === 'full' ? '0' : truncateNumber(minPrice, 4)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {destTokenDetails.symbol} = 1 {srcTokenDetails.symbol}
            </div>
            {selectedRange !== 'full' && (
              <div className="absolute right-2 bottom-2 flex flex-col">
                <Button className="w-7 h-7 text-lg font-bold bg-zinc-700" onClick={increaseMinPrice}>
                  +
                </Button>
                <Button className="w-7 h-7 text-lg font-bold bg-zinc-700" onClick={decreaseMinPrice}>
                  −
                </Button>
              </div>
            )}
          </div>
          <div className="relative bg-zinc-800 p-3 rounded-md">
            <label className="text-sm text-gray-400">Max price</label>
            <div className="text-3xl font-bold mt-1">
              {selectedRange === 'full' ? '∞' : truncateNumber(maxPrice, 4)}
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {destTokenDetails.symbol} = 1 {srcTokenDetails.symbol}
            </div>
            {selectedRange !== 'full' && (
              <div className="absolute right-2 bottom-2 flex flex-col space-y-1">
                <Button className="w-7 h-7 text-lg font-bold bg-zinc-700" onClick={increaseMaxPrice}>
                  +
                </Button>
                <Button className="w-7 h-7 text-lg font-bold bg-zinc-700" onClick={decreaseMaxPrice}>
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
