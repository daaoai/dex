'use client';

import { CoingeckoTokenDetailedInfo } from '@/types/coinGecko';
import { DexScreenerToken } from '@/types/dexScreener';
import { formatToken } from '@/utils/address';
import { formatNumber } from '@/utils/truncateNumber';
import { Hex } from 'viem';
import { Info } from 'lucide-react';

type FinancialDataProps = {
  coingeckoTokenDetails: CoingeckoTokenDetailedInfo | null;
  dexScreenerTokenDetails: DexScreenerToken | null;
};

export const FinancialData = ({ coingeckoTokenDetails, dexScreenerTokenDetails }: FinancialDataProps) => {
  const getMarketCap = () => {
    return dexScreenerTokenDetails?.marketCap || coingeckoTokenDetails?.marketCap || 0;
  };

  const getFDV = () => {
    return dexScreenerTokenDetails?.fdv || coingeckoTokenDetails?.fdv || 0;
  };

  const getLiquidity = () => {
    return dexScreenerTokenDetails?.liquidity.usd || coingeckoTokenDetails?.liquidity || 0;
  };

  const getHolders = () => {
    return coingeckoTokenDetails?.holders || 0;
  };

  const getOrgScore = () => {
    return coingeckoTokenDetails?.orgScore || 0;
  };

  const getCurrentPrice = () => {
    if (dexScreenerTokenDetails?.priceUsd) {
      const price = parseFloat(dexScreenerTokenDetails.priceUsd);
      if (price < 0.0001) {
        return `$${price.toFixed(8)}`;
      } else if (price < 1) {
        return `$${price.toFixed(4)}`;
      } else {
        return `$${price.toFixed(2)}`;
      }
    }
    return `$${formatNumber(coingeckoTokenDetails?.currentPrice || 0)}`;
  };

  const getTradingPair = () => {
    if (dexScreenerTokenDetails?.baseToken.symbol && dexScreenerTokenDetails?.quoteToken.symbol) {
      return `${dexScreenerTokenDetails.baseToken.symbol} / ${dexScreenerTokenDetails.quoteToken.symbol}`;
    }
    return 'N/A';
  };

  const getPriceChange = (timeframe: string) => {
    if (!dexScreenerTokenDetails?.priceChange) return 0;

    switch (timeframe) {
      case '5m':
        return -2.32; // Mock data for 5m
      case '1h':
        return dexScreenerTokenDetails.priceChange.h1 || 0;
      case '6h':
        return dexScreenerTokenDetails.priceChange.h6 || 0;
      case '24h':
        return dexScreenerTokenDetails.priceChange.h24 || 0;
      default:
        return 0;
    }
  };

  const getVolume24h = () => {
    return dexScreenerTokenDetails?.volume.h24 || coingeckoTokenDetails?.volume24h || 0;
  };

  const getTraders24h = () => {
    const txns = dexScreenerTokenDetails?.txns.h24;
    if (txns) {
      return txns.buys + txns.sells || 0;
    }
    return 0;
  };

  const getBuySellRatio = () => {
    const txns = dexScreenerTokenDetails?.txns.h24;
    if (txns && txns.buys + txns.sells > 0) {
      const buyPercentage = (txns.buys / (txns.buys + txns.sells)) * 100;
      return {
        buy: Math.round(buyPercentage),
        sell: Math.round(100 - buyPercentage),
      };
    }
    return { buy: 58, sell: 42 }; // Default mock data
  };

  return (
    <div className="rounded-xl p-6 bg-gray-900/50">
      <h3 className="text-lg font-semibold mb-6">FINANCIAL DATA</h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-gray-400 text-sm">Mkt Cap</p>
          <p className="text-lg font-semibold">{getMarketCap() > 0 ? `$${formatNumber(getMarketCap())}` : 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">FDV</p>
          <p className="text-lg font-semibold">{getFDV() > 0 ? `$${formatNumber(getFDV())}` : 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Liquidity</p>
          <p className="text-lg font-semibold">{getLiquidity() > 0 ? `$${formatNumber(getLiquidity())}` : 'N/A'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Holders</p>
          <p className="text-lg font-semibold">{getHolders() > 0 ? formatNumber(getHolders()) : '0'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Likes</p>
          <p className="text-lg font-semibold">{coingeckoTokenDetails?.likes?.toLocaleString() || '0'}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Org Score</p>
          <p className="text-lg font-semibold">{getOrgScore() > 0 ? getOrgScore().toFixed(1) : 'N/A'}</p>
        </div>
      </div>

      {/* Supply and Pool Data */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400 text-sm">Circulating Supply</p>
            <Info className="w-3 h-3 text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">$1.35</span>
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">6.45%</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400 text-sm">Alpha in Pool</p>
            <Info className="w-3 h-3 text-gray-400" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">$243.14k</p>
            <p className="text-lg font-semibold">24.6k</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400 text-sm">TAO in Pool</p>
            <Info className="w-3 h-3 text-gray-400" />
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="flex h-2 rounded-full">
              <div className="bg-green-500 w-[9.19%]"></div>
              <div className="bg-pink-500 w-[90.81%]"></div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>9.19%</span>
            <span>90.81%</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        <div className="text-center">
          <p className="text-gray-400 text-xs">5m</p>
          <p className={`text-sm font-semibold ${getPriceChange('5m') < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {getPriceChange('5m') > 0 ? '+' : ''}
            {getPriceChange('5m').toFixed(2)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">1h</p>
          <p className={`text-sm font-semibold ${getPriceChange('1h') < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {getPriceChange('1h') > 0 ? '+' : ''}
            {getPriceChange('1h').toFixed(2)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">6h</p>
          <p className={`text-sm font-semibold ${getPriceChange('6h') < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {getPriceChange('6h') > 0 ? '+' : ''}
            {getPriceChange('6h').toFixed(2)}%
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">24h</p>
          <p className={`text-sm font-semibold ${getPriceChange('24h') < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {getPriceChange('24h') > 0 ? '+' : ''}
            {getPriceChange('24h') > 1000
              ? `${(getPriceChange('24h') / 1000).toFixed(0)}x`
              : `${getPriceChange('24h').toFixed(2)}%`}
          </p>
        </div>
      </div>

      {/* Volume and Traders */}
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">24h Vol</p>
          <p className="text-lg font-semibold">${formatNumber(getVolume24h())}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Net Vol</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">${formatNumber(getVolume24h() * 0.02)}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div className="flex h-2 rounded-full">
                <div className="bg-pink-500 w-[51%]"></div>
                <div className="bg-gray-600 w-[49%]"></div>
              </div>
            </div>
            <span className="text-xs text-gray-400">51% Sell</span>
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-sm">24h Traders</p>
          <p className="text-lg font-semibold">{formatNumber(getTraders24h())}</p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Net Vol</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{formatNumber(getTraders24h() * 0.58)}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div className="flex h-2 rounded-full">
                <div className="bg-green-500 w-[58%]"></div>
                <div className="bg-gray-600 w-[42%]"></div>
              </div>
            </div>
            <span className="text-xs text-gray-400">58% Buy</span>
          </div>
        </div>

        {/* Trading Pair and Address */}
        <div className="pt-4 border-t border-gray-700">
          <div className="mb-3">
            <p className="text-gray-400 text-sm">Current Price</p>
            <p className="text-lg font-semibold">{getCurrentPrice()}</p>
          </div>

          <div className="mb-3">
            <p className="text-gray-400 text-sm">Trading Pair</p>
            <div className="text-sm">
              <span className="text-green-400">{dexScreenerTokenDetails?.baseToken.symbol || 'N/A'}</span>
              <span className="text-gray-400"> / </span>
              <span>{dexScreenerTokenDetails?.quoteToken.symbol || 'WBNB'}</span>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-sm">Pair Address</p>
            <div className="text-xs text-gray-400 break-all">
              {dexScreenerTokenDetails?.pairAddress ? formatToken(dexScreenerTokenDetails.pairAddress as Hex) : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
