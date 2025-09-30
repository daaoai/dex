'use client';

import { DexScreenerToken } from '@/types/dexScreener';

type PerformanceMetricsProps = {
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const PerformanceMetrics = ({ dexScreenerTokenDetails }: PerformanceMetricsProps) => {
  return (
    <div className="">
      <h3 className="text-lg font-semibold mb-4">Performance</h3>
      <div className="grid grid-cols-4">
        <div className="text-center border-[#1F2530] border-2 p-2 bg-black">
          <p className="text-gray-400 text-xs mb-1">1h</p>
          <p
            className={`font-semibold ${dexScreenerTokenDetails?.priceChange.h1 && dexScreenerTokenDetails.priceChange.h1 >= 0 ? 'text-[#3CE3AB]' : 'text-[#F23574]'}`}
          >
            {dexScreenerTokenDetails?.priceChange.h1
              ? `${dexScreenerTokenDetails.priceChange.h1 >= 0 ? '+' : ''}${dexScreenerTokenDetails.priceChange.h1.toFixed(2)}%`
              : 'N/A'}
          </p>
        </div>
        <div className="text-center border-[#1F2530] border-2 border-l-0 border-r-0 p-2 bg-black">
          <p className="text-gray-400 text-xs mb-1">6h</p>
          <p
            className={`font-semibold ${dexScreenerTokenDetails?.priceChange.h6 && dexScreenerTokenDetails.priceChange.h6 >= 0 ? 'text-[#3CE3AB]' : 'text-[#F23574]'}`}
          >
            {dexScreenerTokenDetails?.priceChange.h6
              ? `${dexScreenerTokenDetails.priceChange.h6 >= 0 ? '+' : ''}${dexScreenerTokenDetails.priceChange.h6.toFixed(2)}%`
              : 'N/A'}
          </p>
        </div>
        <div className="text-center border-[#1F2530] border-2 border-r-0 p-2 bg-black">
          <p className="text-gray-400 text-xs mb-1">24h</p>
          <p
            className={`font-semibold ${dexScreenerTokenDetails?.priceChange.h24 && dexScreenerTokenDetails.priceChange.h24 >= 0 ? 'text-[#3CE3AB]' : 'text-[#F23574]'}`}
          >
            {dexScreenerTokenDetails?.priceChange.h24
              ? `${dexScreenerTokenDetails.priceChange.h24 >= 0 ? '+' : ''}${dexScreenerTokenDetails.priceChange.h24.toFixed(2)}%`
              : 'N/A'}
          </p>
        </div>
        <div className="text-center border-[#1F2530] border-2 p-2 bg-black">
          <p className="text-gray-400 text-xs mb-1">Vol</p>
          <p className="text-blue-400 font-semibold">
            {dexScreenerTokenDetails?.volume.h24
              ? `$${(dexScreenerTokenDetails.volume.h24 / 1000).toFixed(1)}K`
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};
