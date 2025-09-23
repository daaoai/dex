'use client';

import { CoingeckoTokenDetailedInfo } from '@/types/coinGecko';
import { DexScreenerToken } from '@/types/dexScreener';
import { formatToken } from '@/utils/address';
import { formatNumber } from '@/utils/truncateNumber';
import { Hex } from 'viem';

type FinancialDataProps = {
  coingeckoTokenDetails: CoingeckoTokenDetailedInfo | null;
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const FinancialData = ({ coingeckoTokenDetails, dexScreenerTokenDetails }: FinancialDataProps) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">Financial Data</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-400 text-sm">Mkt Cap</p>
          <p className="text-lg font-semibold">
            {dexScreenerTokenDetails?.marketCap
              ? `$${formatNumber(dexScreenerTokenDetails.marketCap)}`
              : coingeckoTokenDetails?.marketCap
                ? `$${formatNumber(coingeckoTokenDetails?.marketCap)}`
                : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">FDV</p>
          <p className="text-lg font-semibold">
            {dexScreenerTokenDetails?.fdv
              ? `$${formatNumber(dexScreenerTokenDetails.fdv)}`
              : coingeckoTokenDetails?.fdv
                ? `$${formatNumber(coingeckoTokenDetails?.fdv)}`
                : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Liquidity</p>
          <p className="text-lg font-semibold">
            {dexScreenerTokenDetails?.liquidity.usd
              ? `$${formatNumber(dexScreenerTokenDetails.liquidity.usd)}`
              : coingeckoTokenDetails?.liquidity
                ? `$${formatNumber(coingeckoTokenDetails?.liquidity)}`
                : 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Holders</p>
          <p className="text-lg font-semibold">{coingeckoTokenDetails?.holders?.toLocaleString() || 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Likes</p>
          <p className="text-lg font-semibold">{coingeckoTokenDetails?.likes?.toLocaleString() || '0'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Org Score</p>
          <p className="text-lg font-semibold">{coingeckoTokenDetails?.orgScore?.toFixed(1) || 'N/A'}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Current Price</p>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">
            {dexScreenerTokenDetails?.priceUsd
              ? `$${parseFloat(dexScreenerTokenDetails.priceUsd).toFixed(4)}`
              : formatNumber(coingeckoTokenDetails?.currentPrice || 0)}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Trading Pair</p>
        <div className="text-sm">
          <span className="text-green-400">{dexScreenerTokenDetails?.baseToken.symbol || 'N/A'}</span>
          <span className="text-gray-400"> / </span>
          <span>{dexScreenerTokenDetails?.quoteToken.symbol || 'USDT'}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Pair Address</p>
        <div className="text-xs text-gray-400 break-all">
          {dexScreenerTokenDetails?.pairAddress ? formatToken(dexScreenerTokenDetails.pairAddress as Hex) : 'N/A'}
        </div>
      </div>
    </div>
  );
};
