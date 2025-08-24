'use client';

import { CoingeckoTokenDetailedInfo } from '@/types/coinGecko';
import { DexScreenerToken } from '@/types/dexScreener';
import { Token } from '@/types/tokens';
import { TokenChart } from './TokenChart';

type ChartSectionProps = {
  token: Token;
  coingeckoTokenDetails: CoingeckoTokenDetailedInfo | null;
  dexScreenerTokenDetails: DexScreenerToken | null;
  dexScreenerId: string | undefined;
};

export const ChartSection = ({
  token,
  coingeckoTokenDetails,
  dexScreenerTokenDetails,
  dexScreenerId,
}: ChartSectionProps) => {
  const formatPrice = (num: number | undefined) => {
    if (!num || isNaN(num)) return '0.00';
    return num.toFixed(2);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Chart</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Metagraph</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Distributions</button>
          <button className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Statistics</button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">
            {dexScreenerTokenDetails
              ? `${dexScreenerTokenDetails.baseToken.symbol}-${dexScreenerTokenDetails.quoteToken.symbol}`
              : `${token.symbol}-USDT`}
          </h3>
          <span className="text-gray-400 text-sm">
            {dexScreenerTokenDetails
              ? `${dexScreenerTokenDetails.baseToken.symbol}-${dexScreenerTokenDetails.quoteToken.symbol}`
              : `${token.symbol}-USDT`}{' '}
            • 1H
          </span>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div>
            <span className="text-gray-400">Current: </span>
            <span className="font-semibold">
              {dexScreenerTokenDetails?.priceUsd
                ? `$${parseFloat(dexScreenerTokenDetails.priceUsd).toFixed(4)}`
                : formatPrice(coingeckoTokenDetails?.currentPrice)}
            </span>
          </div>
          <div>
            <span className="text-gray-400">24H Change: </span>
            <span
              className={`font-semibold ${dexScreenerTokenDetails?.priceChange.h24 && dexScreenerTokenDetails.priceChange.h24 >= 0 ? 'text-green-400' : 'text-red-400'}`}
            >
              {dexScreenerTokenDetails?.priceChange.h24
                ? `${dexScreenerTokenDetails.priceChange.h24 >= 0 ? '+' : ''}${dexScreenerTokenDetails.priceChange.h24.toFixed(2)}%`
                : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Volume: </span>
            <span className="font-semibold">
              {dexScreenerTokenDetails?.volume.h24 ? `$${dexScreenerTokenDetails.volume.h24.toLocaleString()}` : 'N/A'}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Liquidity: </span>
            <span className="font-semibold">
              {dexScreenerTokenDetails?.liquidity.usd
                ? `$${dexScreenerTokenDetails.liquidity.usd.toLocaleString()}`
                : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      <TokenChart tokenAddress={token.address} dexScreenerId={dexScreenerId} tokenName={token.name} />
    </div>
  );
};
