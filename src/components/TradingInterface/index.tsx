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
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1D');
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

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current && currentPrice) {
      const canvas = document.createElement('canvas');
      canvas.width = chartContainerRef.current.clientWidth;
      canvas.height = 160;
      chartContainerRef.current.innerHTML = '';
      chartContainerRef.current.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const data = generatePriceData(30);

      if (data.length > 0) {
      }

      const drawChart = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgb(236, 72, 153)';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#1f1f23';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#2a2a2e';
        ctx.lineWidth = 0.5;

        for (let i = 0; i < 5; i++) {
          const y = i * (canvas.height / 4);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        const values = data.map((item) => item.value);
        const minValue = Math.min(...values) * 0.95;
        const maxValue = Math.max(...values) * 1.05;
        const valueRange = maxValue - minValue;

        ctx.strokeStyle = 'rgb(236, 72, 153)';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((point, index) => {
          const x = (index / (data.length - 1)) * canvas.width;
          const normalizedValue = (point.value - minValue) / valueRange;
          const y = canvas.height - normalizedValue * canvas.height;

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(236, 72, 153, 0.1)';
        ctx.fill();
      };

      drawChart();

      chartRef.current = {
        updateData: (newData: ChartDataPoint[]) => {
          data.length = 0;
          data.push(...newData);
          drawChart();
        },
      };

      const handleResize = () => {
        if (chartContainerRef.current && canvas) {
          canvas.width = chartContainerRef.current.clientWidth;
          drawChart();
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chartRef.current = null;
      };
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      let days = 1;
      let volatility = 0.03;

      switch (selectedTimeframe) {
        case '1D':
          days = 1;
          volatility = 0.02;
          break;
        case '1W':
          days = 7;
          volatility = 0.05;
          break;
        case '1M':
          days = 30;
          volatility = 0.08;
          break;
        case '1Y':
          days = 365;
          volatility = 0.15;
          break;
        case 'All time':
          days = 730;
          volatility = 0.2;
          break;
      }

      const newData = generatePriceData(days, volatility);
      chartRef.current.updateData(newData);

      if (newData.length > 0) {
      }
    }
  }, [selectedTimeframe]);

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
          selectedTimeframe,
          currentPrice,
          priceInUsd: 0,
          handleRangeSelection: setSelectedRange,
          setMinPrice: () => {},
          setMaxPrice: () => {},
          setSelectedTimeframe,
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
