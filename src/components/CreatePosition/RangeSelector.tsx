'use client';

import { Button } from '@/shadcn/components/ui/button';
import { ChartAPI, TokenState, ZoomableChart } from '@/types/linegraph';
import { Token } from '@/types/tokens';
import { truncateNumber } from '@/utils/truncateNumber';
import { LayoutGroup, motion } from 'framer-motion';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import LineGraphView from '../line-graph';
import DynamicLogo from '../ui/logo/DynamicLogo';
import Text from '../ui/Text';
const tabs = [
  { id: '1d', duration: 1 },
  { id: '3d', duration: 3 },
  { id: '1m', duration: 30 },
  { id: '6m', duration: 1800 },
  { id: '1y', duration: 365 },
  { id: 'max', duration: 3650 },
];
interface RangeSelectorProps {
  selectedRange: 'full' | 'custom';
  srcTokenDetails: Token;
  destTokenDetails: Token;
  token0: Token;
  token1: Token;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  handleRangeSelection: (range: 'full' | 'custom') => void;
  handleSwitchToken: () => void;
  increaseMinPrice: () => void;
  increaseMaxPrice: () => void;
  decreaseMinPrice: () => void;
  decreaseMaxPrice: () => void;
  chartRef: React.MutableRefObject<ChartAPI | null>;
  chartContainerRef: React.RefObject<HTMLDivElement | null>;
  hideTokenSwitchButtons?: boolean;
}

export default function RangeSelector({
  token0,
  token1,
  srcTokenDetails,
  handleSwitchToken,
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
  hideTokenSwitchButtons = false,
}: RangeSelectorProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedTab, setSelectedTab] = useState<string>(activeTab.id || '1d');
  const chartRef = useRef<Line>({} as Line);
  const [isZoomed, setIsZoomed] = useState(false);
  const [tokenState, setTokenState] = useState<TokenState>({});
  const tabContainerRef = useRef<HTMLDivElement | null>(null);
  const [pillProps, setPillProps] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (selectedTab !== activeTab.id) {
      const newActiveTab = tabs.find((tab) => tab.id === selectedTab);
      if (newActiveTab) setActiveTab(newActiveTab);
    }
  }, [selectedTab, activeTab]);

  useEffect(() => {
    if (!tabContainerRef.current) return;
    const activeBtn = tabContainerRef.current.querySelector(`[data-tab="${activeTab.id}"]`);
    if (activeBtn instanceof HTMLElement) {
      const { offsetLeft, offsetWidth } = activeBtn;
      setPillProps({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeTab]);

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
    <div className="">
      <Text type="p" className="text-lg font-medium">
        Set price range
      </Text>
      <div className="relative bg-background-3 p-1 rounded-md overflow-hidden my-4">
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

      <Text type="p" className="text-sm text-gray-400 pb-2">
        Providing full range liquidity ensures continuous market participation across all possible prices...
      </Text>
      <div className="space-y-2">
        <div className="bg-black border border-stroke-11 p-2 rounded-md">
          <div className="flex justify-between items-center text-sm pb-4">
            <div>
              <p className="text-xs">Market price:</p>
              <Text type="p" className="font-medium text-xs">
                {truncateNumber(currentPrice)} {destTokenDetails.symbol} = 1 {srcTokenDetails.symbol}
              </Text>
            </div>
            {!hideTokenSwitchButtons && (
              <div className="flex space-x-2">
                <button
                  className={`flex items-center gap-2 px-3 py-1 rounded-2xl border transition-shadow duration-300 ${
                    token0.address === srcTokenDetails.address
                      ? 'bg-black border-stroke-7 text-white'
                      : 'bg-background-4 border-stroke-7 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => {
                    if (token0.address === srcTokenDetails.address) return;
                    handleSwitchToken();
                  }}
                  type="button"
                >
                  <DynamicLogo
                    logoUrl={token0.logo}
                    altText={token0.symbol}
                    fallbackText={token0.symbol}
                    width={10}
                    height={10}
                  />
                  <span className="font-semibold text-xs">{token0.symbol}</span>
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-1 rounded-2xl border transition-shadow duration-300 ${
                    token1.address === srcTokenDetails.address
                      ? 'bg-black border-stroke-7 text-white'
                      : 'bg-background-4 border-stroke-7 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => {
                    if (token1.address === srcTokenDetails.address) return;
                    handleSwitchToken();
                  }}
                  type="button"
                >
                  <DynamicLogo
                    logoUrl={token1.logo}
                    altText={token1.symbol}
                    fallbackText={token1.symbol}
                    width={10}
                    height={10}
                  />
                  <span className="font-semibold text-xs">{token1.symbol}</span>
                </button>
              </div>
            )}
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mt-2">
            {/* Tabs Section (Left - Scrollable) */}
            <div ref={tabContainerRef} className="relative w-full sm:w-1/2 overflow-x-auto no-scrollbar">
              <div className="relative flex w-max min-w-full bg-zinc-900 rounded-full px-1 py-1">
                {/* Animated Pill */}
                <motion.div
                  className="absolute top-1 bottom-1 bg-purple-800/40 rounded-full z-0"
                  animate={{
                    left: pillProps.left,
                    width: pillProps.width,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />

                {/* Tab Buttons */}
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    data-tab={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`relative z-10 px-2 py-1 text-xs font-medium whitespace-nowrap rounded-full transition-colors duration-200 ${
                      activeTab.id === tab.id ? 'text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls Section (Right) */}
            <div className="flex items-center justify-end space-x-2 w-full sm:w-1/2">
              <div className="flex rounded-md overflow-hidden bg-zinc-800 divide-x divide-zinc-700">
                <button className="p-2 hover:bg-zinc-700 transition-colors" onClick={handleZoomOut} title="Zoom Out">
                  <ZoomOut size={16} />
                </button>
                <button
                  className="p-2 hover:bg-zinc-700 transition-colors"
                  onClick={() => setIsZoomed(true)}
                  title="Zoom In"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
              <Button
                className="flex items-center px-3 py-1 text-sm rounded-md bg-zinc-800 text-white hover:bg-zinc-700"
                onClick={() => {
                  setIsZoomed(false);
                  handleZoomOut();
                  setSelectedTab('1d');
                }}
              >
                <RotateCcw size={16} className="mr-1" />
                Reset
              </Button>
            </div>
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
                <Button className="w-7 h-7 text-lg font-bold bg-zinc-700 p-0" onClick={increaseMinPrice}>
                  +
                </Button>
                <Button className="w-7 h-7 text-lg font-bold bg-zinc-700 p-0" onClick={decreaseMinPrice}>
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
