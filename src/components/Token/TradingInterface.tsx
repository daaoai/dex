'use client';

import { CoingeckoTokenDetailedInfo } from '@/types/coinGecko';
import { DexScreenerToken } from '@/types/dexScreener';
import { Token } from '@/types/tokens';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type TradingInterfaceProps = {
  token: Token;
  coingeckoTokenDetails: CoingeckoTokenDetailedInfo | null;
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const TradingInterface = ({ token, coingeckoTokenDetails, dexScreenerTokenDetails }: TradingInterfaceProps) => {
  const router = useRouter();

  const formatPrice = (num: number | undefined) => {
    if (!num || isNaN(num)) return '0.00';
    return num.toFixed(2);
  };

  const handleBuyClick = () => {
    // Redirect to trade page with destination token set
    const queryParams = new URLSearchParams({
      destToken: token.address,
    });
    router.push(`/trade?${queryParams.toString()}`);
  };

  const handleSellClick = () => {
    // Redirect to trade page with source token set
    const queryParams = new URLSearchParams({
      srcToken: token.address,
    });
    router.push(`/trade?${queryParams.toString()}`);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Buy Button */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">↑</span>
          </div>
          <h3 className="text-lg font-semibold">Buy {token.symbol}</h3>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Buy {token.symbol} tokens using other cryptocurrencies with the best rates available.
          </p>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Current Price</p>
              <p className="text-xl font-bold text-green-400">
                {dexScreenerTokenDetails?.priceUsd
                  ? `$${parseFloat(dexScreenerTokenDetails.priceUsd).toFixed(6)}`
                  : formatPrice(coingeckoTokenDetails?.currentPrice)}
              </p>
            </div>
          </div>

          <button
            onClick={handleBuyClick}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            <span>Buy {token.symbol}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sell Button */}
      <div className="bg-gray-900 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">↓</span>
          </div>
          <h3 className="text-lg font-semibold">Sell {token.symbol}</h3>
        </div>

        <div className="space-y-4">
          <p className="text-gray-400 text-sm">
            Sell your {token.symbol} tokens for other cryptocurrencies with minimal slippage.
          </p>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">24h Change</p>
              <p
                className={`text-xl font-bold ${dexScreenerTokenDetails?.priceChange.h24 && dexScreenerTokenDetails.priceChange.h24 >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                {dexScreenerTokenDetails?.priceChange.h24
                  ? `${dexScreenerTokenDetails.priceChange.h24 >= 0 ? '+' : ''}${dexScreenerTokenDetails.priceChange.h24.toFixed(2)}%`
                  : 'N/A'}
              </p>
            </div>
          </div>

          <button
            onClick={handleSellClick}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            <span>Sell {token.symbol}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
