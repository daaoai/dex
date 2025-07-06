'use client';

import { Token } from '@/types/tokens';
import { useState } from 'react';
import DynamicLogo from '../ui/logo/DynamicLogo';
import Text from '../ui/Text';

interface InitialPriceCardProps {
  token0: Token;
  token1: Token;
  initialPrice: number;
  onSetPrice: (price: number) => void;
  isVisible: boolean;
  srcToken: 'token0' | 'token1';
  handleSwitchToken: () => void;
}

export default function InitialPriceCard({
  token0,
  token1,
  initialPrice,
  onSetPrice,
  isVisible,
  srcToken,
  handleSwitchToken,
}: InitialPriceCardProps) {
  const [inputPrice, setInputPrice] = useState(initialPrice.toString());

  if (!isVisible) return null;

  const handleSetPrice = (value: string) => {
    const price = parseFloat(value);
    if (!isNaN(price) && price > 0) {
      // If token1 is active, we need to convert the price back to token0/token1 ratio
      const finalPrice = srcToken === 'token0' ? price : 1 / price;
      onSetPrice(finalPrice);
    }
  };

  const handleTokenSwitch = (token: 'token0' | 'token1') => {
    if (token !== srcToken) {
      const currentPrice = parseFloat(inputPrice);
      if (currentPrice > 0) {
        // Convert the price when switching tokens
        const newPrice = (1 / currentPrice).toFixed(6);
        setInputPrice(newPrice);
      }
      handleSwitchToken();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setInputPrice(value);
      handleSetPrice(value);
    }
  };

  // For display in the input area
  const priceText =
    srcToken === 'token0' ? `${token1.symbol} = 1 ${token0.symbol}` : `${token0.symbol} = 1 ${token1.symbol}`;

  // For market price display - show the actual price that will be used
  // const marketDisplayPrice = srcToken === 'token0' ? truncateNumber(initialPrice) : truncateNumber(1 / initialPrice);

  // const marketPriceText =
  //   activeToken === 'token0'
  //     ? `${marketDisplayPrice} ${token1.symbol} = 1 ${token0.symbol}`
  //     : `${marketDisplayPrice} ${token0.symbol} = 1 ${token1.symbol}`;

  return (
    <div className={`bg-zinc-900 rounded-lg p-6 space-y-6 ${isVisible ? 'block' : 'hidden'}`}>
      {/* Header */}
      <div className="space-y-2">
        <Text type="h2" className="text-xl font-bold text-white">
          Set initial price
        </Text>
        <Text type="p" className="text-gray-400 text-sm">
          When creating a new pool, you must set the starting exchange rate for both tokens. This rate will reflect the
          initial market price.
        </Text>
      </div>

      {/* Price Input Section */}
      <div className="space-y-4">
        <Text type="p" className="text-gray-300 text-sm">
          Initial price
        </Text>

        <div className="bg-zinc-800 rounded-lg p-4">
          <input
            type="text"
            value={inputPrice}
            onChange={handleInputChange}
            className="bg-transparent text-white text-3xl font-bold w-full outline-none"
            placeholder="0.0"
          />
          <div className="flex items-center justify-between mt-2">
            <Text type="p" className="text-gray-400">
              {priceText}
            </Text>
            <div className="flex">
              <button
                className={`flex items-center gap-2 px-3 py-1 rounded-2xl border transition-shadow duration-300 ${
                  srcToken === 'token0'
                    ? 'bg-black border-stroke-7 text-white'
                    : 'bg-background-4 border-stroke-7 text-gray-400 hover:text-white'
                }`}
                onClick={() => handleTokenSwitch('token0')}
                type="button"
              >
                <DynamicLogo
                  logoUrl={token0.logo}
                  altText={token0.symbol}
                  fallbackText={token0.symbol}
                  width={10}
                  height={10}
                />
                <span className="font-semibold text-xs">{token1.symbol}</span>
              </button>
              <button
                className={`flex items-center gap-2 px-3 py-1 rounded-2xl border transition-shadow duration-300 ${
                  srcToken === 'token1'
                    ? 'bg-black border-stroke-7 text-white'
                    : 'bg-background-4 border-stroke-7 text-gray-400 hover:text-white'
                }`}
                onClick={() => handleTokenSwitch('token1')}
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
          </div>
        </div>
      </div>

      {/* Market Price Section */}
      {/* <div className="bg-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <Text type="p" className="text-gray-300">
              Market price: {marketPriceText} ($1.52)
            </Text>
          </div>
          <button onClick={handleUseMarketPrice} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            Use market price
          </button>
        </div>
      </div> */}
    </div>
  );
}
