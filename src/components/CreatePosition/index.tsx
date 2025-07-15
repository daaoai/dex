'use client';

import { useCreatePosition } from '@/hooks/useCreatePosition';
import { Token } from '@/types/tokens';
import { useEffect, useRef, useState } from 'react';
import PoolIcon from '../ui/logo/PoolLogo';
import Text from '../ui/Text';
import DepositTokens from './DepositToken';
import RangeSelector from './RangeSelector';
import InitialPriceCard from './InitialPriceCard';
import { chainsData } from '@/constants/chains';

interface CreatePositionInterfaceProps {
  token0: Token;
  token1: Token;
  chainId: number;
  fee: number;
}
type ChartDataPoint = { time: number; value: number };

type ChartAPI = {
  updateData: (newData: ChartDataPoint[]) => void;
};

export default function CreatePositionInterface({ token0, token1, chainId, fee }: CreatePositionInterfaceProps) {
  const [isLoading] = useState<boolean>(false);

  const { nativeCurrency, wnativeToken } = chainsData[chainId];
  const formattedToken0Address = (
    token0.address === nativeCurrency.address ? wnativeToken : token0
  ).address.toLowerCase();
  const formattedToken1Address = (
    token1.address === nativeCurrency.address ? wnativeToken : token1
  ).address.toLowerCase();

  [token0, token1] = formattedToken0Address < formattedToken1Address ? [token0, token1] : [token1, token0];

  const {
    currentPrice,
    token0FormattedAmount,
    token1FormattedAmount,
    setToken0FormattedAmount,
    setToken1FormattedAmount,
    getToken0Amount,
    getToken1Amount,
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
    setInputAmountForToken,
    handleUninitializedPool,
    fetchInitialData,
    txnState,
    balances,
    handleSwitch,
    currentPoolData,
    poolDetails,
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

  const showInitialPriceModal = !currentPoolData.isInitialized;

  const handleToken0AmountChange = (value: string) => {
    if (value && !isNaN(parseFloat(value))) {
      setToken0FormattedAmount(value);
      setInputAmountForToken('token0');
      if (!Number(value)) {
        setToken1FormattedAmount('');
        return;
      }
      setToken1FormattedAmount(getToken1Amount(value));
    } else {
      setToken0FormattedAmount('');
    }
  };

  const handleToken1AmountChange = (value: string) => {
    if (value && !isNaN(parseFloat(value))) {
      setToken1FormattedAmount(value);
      setInputAmountForToken('token1');
      if (!Number(value)) {
        setToken0FormattedAmount('');
        return;
      }
      setToken0FormattedAmount(getToken0Amount(value));
    } else {
      setToken1FormattedAmount('');
    }
  };

  const handleSetInitialPrice = (price: number) => {
    if (poolDetails) {
      handleUninitializedPool(poolDetails, token0, token1, price);
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

      {/* Initial Price Card - shows above range selector for uninitialized pools */}
      <InitialPriceCard
        token0={token0}
        token1={token1}
        initialPrice={0.5}
        onSetPrice={handleSetInitialPrice}
        srcToken={srcToken}
        handleSwitchToken={handleSwitch}
        isVisible={showInitialPriceModal}
      />

      <RangeSelector
        {...{
          srcTokenDetails: srcToken === 'token0' ? token0 : token1,
          destTokenDetails: srcToken === 'token0' ? token1 : token0,
          token0,
          token1,
          increaseMaxPrice: increaseUpperTick,
          increaseMinPrice: increaseLowerTick,
          decreaseMaxPrice: decreaseUpperTick,
          decreaseMinPrice: decreaseLowerTick,
          selectedRange,
          minPrice: lowerPrice,
          maxPrice: upperPrice,
          currentPrice,
          priceInUsd: 0,
          handleSwitchToken: handleSwitch,
          handleRangeSelection: setSelectedRange,
          setMinPrice: () => {},
          setMaxPrice: () => {},
          chartRef,
          chartContainerRef,
          hideTokenSwitchButtons: showInitialPriceModal, // Hide token buttons when initial price is being set
        }}
      />

      <DepositTokens
        {...{
          token0Details: token0,
          token1Details: token1,
          token0Amount: token0FormattedAmount,
          token1Amount: token1FormattedAmount,
          handleToken0AmountChange,
          handleToken1AmountChange,
          handleDeposit: createPosition,
          txnState,
          srcTokenDetails: token0,
          isLoading,
          balances,
        }}
      />
    </div>
  );
}
