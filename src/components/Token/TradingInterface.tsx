'use client';

import { CoingeckoTokenDetailedInfo } from '@/types/coinGecko';
import { DexScreenerToken } from '@/types/dexScreener';
import { Token } from '@/types/tokens';
import { ArrowRight } from 'lucide-react';
import SwapDialog from '../swap/SwapDialog';

type TradingInterfaceProps = {
  token: Token;
  coingeckoTokenDetails: CoingeckoTokenDetailedInfo | null;
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const TradingInterface = ({ token, coingeckoTokenDetails, dexScreenerTokenDetails }: TradingInterfaceProps) => {
  const formatPrice = (num: number | undefined) => {
    if (!num || isNaN(num)) return '0.00';
    return num.toFixed(2);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {/* Buy Button */}
        <div className="bg-[#0B0E11] rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <img src="/upArrow.svg" alt="Buy" className="w-8 h-8" />
            <h3 className="text-lg font-semibold">Buy {token.symbol}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex p-4 items-center justify-between">
              <p className="text-gray-400 text-xs mb-1">Current Price</p>
              <p className="text-xl font-bold text-[#3CE3AB]">
                {dexScreenerTokenDetails?.priceUsd
                  ? `$${parseFloat(dexScreenerTokenDetails.priceUsd).toFixed(6)}`
                  : formatPrice(coingeckoTokenDetails?.currentPrice)}
              </p>
            </div>

            <SwapDialog
              initialDestToken={token}
              onSwapComplete={() => {
                // Optional: Handle swap completion
                console.log('Buy swap completed');
              }}
            >
              <button
                className="w-full bg-gradient-to-r from-[#492AFF] to-[#F49167] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 shadow-inner"
                style={{ boxShadow: 'inset 0 4px 24px 0 rgba(248, 242, 254, 0.12)' }}
              >
                <span>Buy {token.symbol}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </SwapDialog>
          </div>
        </div>

        {/* Sell Button */}
        <div className="bg-[#0B0E11] rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <img src="/downArrow.svg" alt="Sell" className="w-8 h-8" />
            <h3 className="text-lg font-semibold">Sell {token.symbol}</h3>
          </div>

          <div className="space-y-4">
            <div className="flex p-4 items-center justify-between">
              <p className="text-gray-400 text-xs mb-1">24h Change</p>
              <p
                className={`text-xl font-bold ${dexScreenerTokenDetails?.priceChange.h24 && dexScreenerTokenDetails.priceChange.h24 >= 0 ? 'text-[#3CE3AB]' : 'text-[#F23574]'}`}
              >
                {dexScreenerTokenDetails?.priceChange.h24
                  ? `${dexScreenerTokenDetails.priceChange.h24 >= 0 ? '+' : ''}${dexScreenerTokenDetails.priceChange.h24.toFixed(2)}%`
                  : 'N/A'}
              </p>
            </div>

            <SwapDialog
              initialSrcToken={token}
              onSwapComplete={() => {
                // Optional: Handle swap completion
                console.log('Sell swap completed');
              }}
            >
              <button
                className="w-full bg-gradient-to-r from-[#492AFF] to-[#F49167] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 shadow-inner"
                style={{ boxShadow: 'inset 0 4px 24px 0 rgba(248, 242, 254, 0.12)' }}
              >
                <span>Sell {token.symbol}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </SwapDialog>
          </div>
        </div>
      </div>
    </>
  );
};
