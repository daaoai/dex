'use client';

import { Hex } from 'viem';

type TokenChartProps = {
  tokenAddress: Hex;
  dexScreenerId?: string;
  tokenName: string;
};

export const TokenChart = ({ tokenAddress, dexScreenerId, tokenName }: TokenChartProps) => {
  if (!dexScreenerId) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-800 rounded-lg">
        <div className="text-center">
          <p className="text-gray-400 mb-2">Chart not available</p>
          <p className="text-sm text-gray-500">DexScreener not supported for this chain</p>
        </div>
      </div>
    );
  }

  const chartUrl = `https://dexscreener.com/${dexScreenerId}/${tokenAddress}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15`;

  return (
    <div className="w-full">
      <iframe
        className="h-[400px] w-full border-0 rounded-lg"
        src={chartUrl}
        title={`${tokenName} Price Chart`}
        allow="fullscreen"
      />
    </div>
  );
};
