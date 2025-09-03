'use client';

import { DexScreenerToken } from '@/types/dexScreener';

type TradingDataProps = {
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const TradingData = ({ dexScreenerTokenDetails }: TradingDataProps) => {
  return (
    <div className=" rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Trading Data</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">24h Buys</p>
          <div className="bg-green-500 h-3 rounded mb-1"></div>
          <p className="text-sm font-semibold">{dexScreenerTokenDetails?.txns.h24.buys?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">24h Sells</p>
          <div className="bg-pink-500 h-3 rounded mb-1"></div>
          <p className="text-sm font-semibold">{dexScreenerTokenDetails?.txns.h24.sells?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">6h Buys</p>
          <div className="bg-green-500 h-3 rounded mb-1"></div>
          <p className="text-sm font-semibold">{dexScreenerTokenDetails?.txns.h6.buys?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">6h Sells</p>
          <div className="bg-pink-500 h-3 rounded mb-1"></div>
          <p className="text-sm font-semibold">{dexScreenerTokenDetails?.txns.h6.sells?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">1h Buys</p>
          <div className="bg-green-500 h-3 rounded mb-1"></div>
          <p className="text-sm font-semibold">{dexScreenerTokenDetails?.txns.h1.buys?.toLocaleString() || 'N/A'}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">1h Sells</p>
          <div className="bg-pink-500 h-3 rounded mb-1"></div>
          <p className="text-sm font-semibold">{dexScreenerTokenDetails?.txns.h1.sells?.toLocaleString() || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};
