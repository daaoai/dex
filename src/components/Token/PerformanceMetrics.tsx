'use client';

import { DexScreenerToken } from '@/types/dexScreener';

type PerformanceMetricsProps = {
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const PerformanceMetrics = ({ dexScreenerTokenDetails }: PerformanceMetricsProps) => {
  return (
    <div className=" rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Performance</h3>
      <div className="grid grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">1h</p>
          <p
            className={`font-semibold ${dexScreenerTokenDetails?.priceChange.h1 && dexScreenerTokenDetails.priceChange.h1 >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {dexScreenerTokenDetails?.priceChange.h1
              ? `${dexScreenerTokenDetails.priceChange.h1 >= 0 ? '+' : ''}${dexScreenerTokenDetails.priceChange.h1.toFixed(2)}%`
              : 'N/A'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">6h</p>
          <p
            className={`font-semibold ${dexScreenerTokenDetails?.priceChange.h6 && dexScreenerTokenDetails.priceChange.h6 >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {dexScreenerTokenDetails?.priceChange.h6
              ? `${dexScreenerTokenDetails.priceChange.h6 >= 0 ? '+' : ''}${dexScreenerTokenDetails.priceChange.h6.toFixed(2)}%`
              : 'N/A'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-1">24h</p>
          <p
            className={`font-semibold ${dexScreenerTokenDetails?.priceChange.h24 && dexScreenerTokenDetails.priceChange.h24 >= 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {dexScreenerTokenDetails?.priceChange.h24
              ? `${dexScreenerTokenDetails.priceChange.h24 >= 0 ? '+' : ''}${dexScreenerTokenDetails.priceChange.h24.toFixed(2)}%`
              : 'N/A'}
          </p>
        </div>
        <div className="text-center">
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
