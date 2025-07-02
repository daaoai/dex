'use client';

import { useCreatePosition } from '@/hooks/useCreatePosition';
import { Token } from '@/types/tokens';
import { useEffect, useRef, useState } from 'react';
import PoolIcon from '../ui/logo/PoolLogo';
import DepositTokens from './DepositToken';
import RangeSelector from './RangeSelector';
import Text from '../ui/Text';

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
        <PoolIcon token0={token0} token1={token1} />
        <div className="flex-1">
          <Text type="h2" className="text-xl font-bold ml-4">
            {token0.symbol} / {token1.symbol}
          </Text>
        </div>
        <div className="flex items-center space-x-4">
          <Text type="p" className="bg-zinc-800 px-2 py-1 rounded text-sm">
            V3
          </Text>
          <Text type="p" className="text-gray-400">
            {fee / 10000}%
          </Text>
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
