'use client';

import { DexScreenerToken } from '@/types/dexScreener';

type VolumeAndTradersProps = {
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const VolumeAndTraders = ({ dexScreenerTokenDetails }: VolumeAndTradersProps) => {
  const formatVolume = (volume: number | undefined) => {
    if (!volume) return 'N/A';
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(1)}K`;
    } else {
      return `$${volume.toFixed(2)}`;
    }
  };

  const formatLiquidity = (liquidity: number | undefined) => {
    if (!liquidity) return 'N/A';
    if (liquidity >= 1000000) {
      return `$${(liquidity / 1000000).toFixed(1)}M`;
    } else if (liquidity >= 1000) {
      return `$${(liquidity / 1000).toFixed(1)}K`;
    } else {
      return `$${liquidity.toFixed(2)}`;
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-gray-400 text-sm mb-4">Volume & Traders</h3>

      {/* Dotted top border */}

      <div className="bg-[#0D1117] rounded-lg p-4">
        <div className="grid grid-cols-4 gap-4">
          {/* 24h Vol */}
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">24hr Vol</p>
            <p className="text-white font-bold text-sm">{formatVolume(dexScreenerTokenDetails?.volume.h24)}</p>
          </div>

          {/* 6h Vol */}
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">6hr Vol</p>
            <p className="text-white font-bold text-sm">{formatVolume(dexScreenerTokenDetails?.volume.h6)}</p>
          </div>

          {/* 1h Vol */}
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">1hr Vol</p>
            <p className="text-white font-bold text-sm">{formatVolume(dexScreenerTokenDetails?.volume.h1)}</p>
          </div>

          {/* Liquidity */}
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Liquidity</p>
            <p className="text-white font-bold text-sm">{formatLiquidity(dexScreenerTokenDetails?.liquidity.usd)}</p>
          </div>
        </div>
      </div>

      {/* Dotted bottom border */}
    </div>
  );
};
