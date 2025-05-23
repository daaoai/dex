'use client';

import { useState, useEffect, useRef } from 'react';
import RangeSelector from './RangeSelector';
import DepositTokens from './DepositToken';

export default function CryptoTradingInterface() {
  const [selectedRange, setSelectedRange] = useState<'full' | 'custom'>('full');
  const [minPrice, setMinPrice] = useState<string>('0');
  const [maxPrice, setMaxPrice] = useState<string>('0');
  const [ethAmount, setEthAmount] = useState<string>('0');
  const [usdtAmount, setUsdtAmount] = useState<string>('0');
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1D');
  const [currentPrice, setCurrentPrice] = useState<number>(0.00041);
  const [priceInUsd, setPriceInUsd] = useState<number>(0.987);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  type ChartDataPoint = { time: number; value: number };

  type ChartAPI = {
    updateData: (newData: ChartDataPoint[]) => void;
  };

  const chartRef = useRef<ChartAPI | null>(null);

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

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = chartContainerRef.current.clientWidth;
      canvas.height = 160;
      chartContainerRef.current.innerHTML = '';
      chartContainerRef.current.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const data = generatePriceData(30);

      if (data.length > 0) {
        setCurrentPrice(data[data.length - 1].value);
        setPriceInUsd(data[data.length - 1].value * 2407);
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
        setCurrentPrice(newData[newData.length - 1].value);
        setPriceInUsd(newData[newData.length - 1].value * 2407);
      }
    }
  }, [selectedTimeframe]);

  const calculateEthUsdValue = () => ((parseFloat(ethAmount) || 0) * 2407).toFixed(2);
  const calculateUsdtUsdValue = () => (parseFloat(usdtAmount) || 0).toFixed(2);

  const handleRangeSelection = (range: 'full' | 'custom') => {
    setSelectedRange(range);
    if (range === 'full') {
      setMinPrice('0');
      setMaxPrice('∞');
    } else {
      setMinPrice((currentPrice * 0.8).toFixed(6));
      setMaxPrice((currentPrice * 1.2).toFixed(6));
    }
  };

  const connectWallet = () => {
    setIsLoading(true);
    setTimeout(() => {
      setWalletConnected(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleDeposit = () => {
    if (parseFloat(ethAmount) <= 0 && parseFloat(usdtAmount) <= 0) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEthAmount('0');
      setUsdtAmount('0');
    }, 2000);
  };

  const handleEthAmountChange = (value: string) => {
    setEthAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const usdtVal = parseFloat(value) / currentPrice;
      setUsdtAmount(usdtVal.toFixed(6));
    }
  };

  const handleUsdtAmountChange = (value: string) => {
    setUsdtAmount(value);
    if (value && !isNaN(parseFloat(value))) {
      const ethVal = parseFloat(value) * currentPrice;
      setEthAmount(ethVal.toFixed(6));
    }
  };

  return (
    <div className="max-w-lg mx-auto w-full px-4 pb-8 space-y-4">
      <div className="bg-zinc-900 rounded-lg p-4 flex items-center">
        <div className="bg-green-500 rounded-full p-3 mr-3">
          <div className="w-6 h-6 flex items-center justify-center text-green-500 bg-white rounded-md">$</div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">USDC/USDT0</h2>
        </div>
        <div className="flex items-center space-x-4">
          <p className="bg-zinc-800 px-2 py-1 rounded text-sm">V4</p>
          <p className="text-gray-400">0.01%</p>
        </div>
      </div>

      <RangeSelector
        {...{
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
          chartRef,
          chartContainerRef,
        }}
      />

      <DepositTokens
        {...{
          ethAmount,
          usdtAmount,
          handleEthAmountChange,
          handleUsdtAmountChange,
          calculateEthUsdValue,
          calculateUsdtUsdValue,
          walletConnected,
          isLoading,
          connectWallet,
          handleDeposit,
        }}
      />
    </div>
  );
}
