'use client';

import { useCreatePosition } from '@/hooks/useCreatePosition';
import { Token } from '@/types/tokens';
import { useEffect, useRef, useState } from 'react';
import PoolIcon from '../PoolLogo';
import DepositTokens from './DepositToken';
import RangeSelector from './RangeSelector';

interface CryptoTradingInterfaceProps {
  token0: Token;
  token1: Token;
  chainId: number;
  fee: number;
}
type ChartDataPoint = { time: number; value: number };

type ChartAPI = {
  updateData: (newData: ChartDataPoint[]) => void;
};

const generatePriceData = (days: number, volatility = 0.05) => {
  const data = [];
  const basePrice = 0.00041;
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.5) * volatility;
    currentPrice = currentPrice * (1 + change);
    if (currentPrice < 0.0001) currentPrice = 0.0001;

    data.push({
      time: date.getTime() / 1000,
      value: currentPrice,
    });
  }
  return data;
};

export default function CryptoTradingInterface({ token0, token1, chainId, fee }: CryptoTradingInterfaceProps) {
  const [isLoading] = useState<boolean>(false);

  const {
    currentPrice,
    dstTokenFormattedAmount,
    srcTokenFormattedAmount,
    lowerPrice,
    srcToken,
    increaseLowerTick,
    increaseUpperTick,
    decreaseLowerTick,
    createPosition,
    decreaseUpperTick,
    selectedRange,
    setSelectedRange,
    upperPrice,
    setSrcTokenFormattedAmount,
    setDstTokenFormattedAmount,
    fetchInitialData,
    txnState,
  } = useCreatePosition({ chainId });

  useEffect(() => {
    fetchInitialData({
      fee,
      token0: token0.address,
      token1: token1.address,
    });
  }, [token0, token1]);

  const chartContainerRef = useRef<HTMLDivElement>(null);

  const chartRef = useRef<ChartAPI | null>(null);

  const handleDestAmountChange = (value: string) => {
    if (value && !isNaN(parseFloat(value))) {
      setDstTokenFormattedAmount(value);
    } else {
      setDstTokenFormattedAmount('');
    }
  };

  const handleSrcAmountChange = (value: string) => {
    if (value && !isNaN(parseFloat(value))) {
      setSrcTokenFormattedAmount(value);
    } else {
      setSrcTokenFormattedAmount('');
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full px-4 pb-8 space-y-4">
      <div className="bg-zinc-900 rounded-lg p-4 flex items-center">
        <PoolIcon
          token0Logo={token0.logo || ''}
          token1Logo={token1.logo || ''}
          token0FallbackCharacter={token0.symbol}
          token1FallbackCharacter={token1.symbol}
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold">
            {token0.symbol} / {token1.symbol}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <p className="bg-zinc-800 px-2 py-1 rounded text-sm">V4</p>
          <p className="text-gray-400">{fee / 10000}%</p>
        </div>
      </div>

      <RangeSelector
        {...{
          srcTokenDetails: srcToken === 'token0' ? token0 : token1,
          destTokenDetails: srcToken === 'token0' ? token1 : token0,
          increaseMaxPrice: increaseUpperTick,
          increaseMinPrice: increaseLowerTick,
          decreaseMaxPrice: decreaseUpperTick,
          decreaseMinPrice: decreaseLowerTick,
          selectedRange,
          minPrice: lowerPrice,
          maxPrice: upperPrice,
          currentPrice,
          priceInUsd: 0,
          handleRangeSelection: setSelectedRange,
          setMinPrice: () => {},
          setMaxPrice: () => {},
          chartRef,
          chartContainerRef,
        }}
      />

      <DepositTokens
        {...{
          destTokenAmount: dstTokenFormattedAmount,
          destTokenDetails: token1,
          handleDestTokenAmountChange: handleDestAmountChange,
          handleSrcTokenAmountChange: handleSrcAmountChange,
          srcTokenAmount: srcTokenFormattedAmount,
          handleDeposit: createPosition,
          txnState,
          srcTokenDetails: token0,
          isLoading,
        }}
      />
    </div>
  );
}
