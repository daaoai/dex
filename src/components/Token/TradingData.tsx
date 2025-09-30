'use client';

import { DexScreenerToken } from '@/types/dexScreener';

type TradingDataProps = {
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const TradingData = ({ dexScreenerTokenDetails }: TradingDataProps) => {
  const getBuyPercentage = (buys: number, sells: number) => {
    const total = buys + sells;
    return total > 0 ? (buys / total) * 100 : 50;
  };

  const getSellPercentage = (buys: number, sells: number) => {
    const total = buys + sells;
    return total > 0 ? (sells / total) * 100 : 50;
  };

  const formatNumber = (num: number | undefined) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Trading Data</h3>
      <div className="bg-[#0B0E11] border border-[#1F2530] rounded-xl p-6">
        <div className="space-y-6">
          {/* 24h Trading */}
          <div>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-gray-400 text-sm">24h Buys</p>
                <p className="text-white font-semibold">{formatNumber(dexScreenerTokenDetails?.txns.h24.buys)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">24h Sells</p>
                <p className="text-white font-semibold">{formatNumber(dexScreenerTokenDetails?.txns.h24.sells)}</p>
              </div>
            </div>
            <div className="w-full  rounded-sm h-3 overflow-hidden">
              <div className="flex h-3">
                <div
                  className="bg-[#3CE3AB] mr-2"
                  style={{
                    width: `${getBuyPercentage(dexScreenerTokenDetails?.txns.h24.buys || 0, dexScreenerTokenDetails?.txns.h24.sells || 0)}%`,
                  }}
                ></div>
                <div
                  className="bg-[#F23574]"
                  style={{
                    width: `${getSellPercentage(dexScreenerTokenDetails?.txns.h24.buys || 0, dexScreenerTokenDetails?.txns.h24.sells || 0)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* 6h Trading */}
          <div>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-gray-400 text-sm">6h Buys</p>
                <p className="text-white font-semibold">{formatNumber(dexScreenerTokenDetails?.txns.h6.buys)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">6h Sells</p>
                <p className="text-white font-semibold">{formatNumber(dexScreenerTokenDetails?.txns.h6.sells)}</p>
              </div>
            </div>
            <div className="w-full rounded-sm h-3 overflow-hidden">
              <div className="flex h-3">
                <div
                  className="bg-[#3CE3AB] mr-2"
                  style={{
                    width: `${getBuyPercentage(dexScreenerTokenDetails?.txns.h6.buys || 0, dexScreenerTokenDetails?.txns.h6.sells || 0)}%`,
                  }}
                ></div>
                <div
                  className="bg-[#F23574]"
                  style={{
                    width: `${getSellPercentage(dexScreenerTokenDetails?.txns.h6.buys || 0, dexScreenerTokenDetails?.txns.h6.sells || 0)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* 1h Trading */}
          <div>
            <div className="flex justify-between mb-2">
              <div>
                <p className="text-gray-400 text-sm">1h Buys</p>
                <p className="text-white font-semibold">{formatNumber(dexScreenerTokenDetails?.txns.h1.buys)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">1h Sells</p>
                <p className="text-white font-semibold">{formatNumber(dexScreenerTokenDetails?.txns.h1.sells)}</p>
              </div>
            </div>
            <div className="w-full rounded-sm h-3 overflow-hidden">
              <div className="flex h-3">
                <div
                  className="bg-[#3CE3AB] mr-2"
                  style={{
                    width: `${getBuyPercentage(dexScreenerTokenDetails?.txns.h1.buys || 0, dexScreenerTokenDetails?.txns.h1.sells || 0)}%`,
                  }}
                ></div>
                <div
                  className="bg-[#F23574]"
                  style={{
                    width: `${getSellPercentage(dexScreenerTokenDetails?.txns.h1.buys || 0, dexScreenerTokenDetails?.txns.h1.sells || 0)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
