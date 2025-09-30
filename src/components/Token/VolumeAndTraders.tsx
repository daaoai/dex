'use client';

import { DexScreenerToken } from '@/types/dexScreener';

type VolumeAndTradersProps = {
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const VolumeAndTraders = ({ dexScreenerTokenDetails }: VolumeAndTradersProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-4">Volume & Traders</h3>
      <div className="space-y-4">
        <div className="">
          <p className="text-gray-400 text-sm mb-2">24h Vol</p>
          <p className="text-lg font-semibold">
            {dexScreenerTokenDetails?.volume.h24 ? `$${dexScreenerTokenDetails.volume.h24.toLocaleString()}` : 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-2">6h Vol</p>
          <p className="text-lg font-semibold">
            {dexScreenerTokenDetails?.volume.h6 ? `$${dexScreenerTokenDetails.volume.h6.toLocaleString()}` : 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-2">1h Vol</p>
          <p className="text-lg font-semibold">
            {dexScreenerTokenDetails?.volume.h1 ? `$${dexScreenerTokenDetails.volume.h1.toLocaleString()}` : 'N/A'}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-2">Liquidity</p>
          <p className="text-lg font-semibold">
            {dexScreenerTokenDetails?.liquidity.usd
              ? `$${dexScreenerTokenDetails.liquidity.usd.toLocaleString()}`
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};
