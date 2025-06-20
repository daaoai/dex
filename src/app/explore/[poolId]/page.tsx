import React from 'react';
import Link from 'next/link';
import { fetchPoolDetails } from './fetchPoolDetails';
import Text from '@/components/ui/Text';
import { Button } from '@/shadcn/components/ui/button';
import PoolIcon from '@/components/ui/logo/PoolLogo';
import { SimpleLineChart } from '@/components/SimpleLineChart';
import { Transaction } from '@/types/pools';

interface PoolDetailsPageProps {
  params: Promise<{
    poolId: string;
  }>;
}

const PoolDetailsPage = async ({ params }: PoolDetailsPageProps) => {
  const resolvedParams = await params;
  const poolDetails = await fetchPoolDetails(resolvedParams.poolId);

  if (!poolDetails) {
    return (
      <main className="min-h-screen bg-gray-950 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-5xl text-center">
          <Text type="h1" className="text-2xl font-bold text-white mb-4">
            Pool Not Found
          </Text>
          <Link href="/explore">
            <Button variant="outline">Back to Explore</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 py-6 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-gray-400">
          <Link href="/explore" className="hover:text-white">
            Explore
          </Link>
          <span>›</span>
          <Link href="/explore" className="hover:text-white">
            Pools
          </Link>
          <span>›</span>
          <span className="text-white">
            {poolDetails.token0.symbol}/{poolDetails.token1.symbol}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <PoolIcon
              token0={{ symbol: poolDetails.token0.symbol }}
              token1={{ symbol: poolDetails.token1.symbol }}
              className="h-12 w-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
                <span>
                  {poolDetails.token0.symbol} / {poolDetails.token1.symbol}
                </span>
                <span className="text-sm bg-gray-800 px-2 py-1 rounded">v2</span>
                <span className="text-sm text-gray-400">{poolDetails.feeTier}%</span>
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-gray-400">${poolDetails.price.toLocaleString()}</span>
                <span className="text-gray-500">Past day</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <Link
              href={`/swap?token0=${poolDetails.token0.address}&token1=${poolDetails.token1.address}`}
              className="bg-pink-600 hover:bg-pink-700 text-white"
            >
              Swap
            </Link>
            <Link
              href={`/positions/create?token0=${poolDetails.token0.address}&token1=${poolDetails.token1.address}`}
              className="border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white"
            >
              Add liquidity
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price Chart */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="bg-gray-800 text-white">
                      1H
                    </Button>
                    <Button variant="ghost" size="sm">
                      1D
                    </Button>
                    <Button variant="ghost" size="sm">
                      1W
                    </Button>
                    <Button variant="ghost" size="sm">
                      1M
                    </Button>
                    <Button variant="ghost" size="sm">
                      1Y
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Volume</span>
                    <Button variant="ghost" size="sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              {poolDetails.chartData && poolDetails.chartData.length > 0 ? (
                <SimpleLineChart data={poolDetails.chartData} height={300} showGrid={true} strokeColor="#ec4899" />
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-500">No chart data available</div>
              )}
            </div>

            {/* Transactions */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 text-sm border-b border-gray-800">
                      <th className="text-left py-2">Time</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">USD</th>
                      <th className="text-left py-2">{poolDetails.token0.symbol}</th>
                      <th className="text-left py-2">{poolDetails.token1.symbol}</th>
                      <th className="text-left py-2">Wallet</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poolDetails.transactions.map((tx: Transaction, index: number) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 text-gray-300">{tx.timeAgo}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              tx.type === 'Sell' ? 'text-red-400 bg-red-400/10' : 'text-blue-400 bg-blue-400/10'
                            }`}
                          >
                            {tx.type} {poolDetails.token0.symbol}
                          </span>
                        </td>
                        <td className="py-3 text-white">${tx.usd.toLocaleString()}</td>
                        <td className="py-3 text-white">{tx.token0Amount.toLocaleString()}</td>
                        <td className="py-3 text-white">{tx.token1Amount.toLocaleString()}</td>
                        <td className="py-3 text-gray-300">{tx.wallet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="mb-4">
                <span className="text-gray-400">Total APR</span>
                <h3 className="text-2xl font-bold text-white">{poolDetails.apr.toFixed(2)}%</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-gray-400 text-sm">Stats</span>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Pool balances</span>
                  <div className="mt-1">
                    <div className="text-white">
                      {poolDetails.poolBalances.token0} {poolDetails.token0.symbol}
                    </div>
                    <div className="text-white">
                      {poolDetails.poolBalances.token1} {poolDetails.token1.symbol}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-pink-600 h-2 rounded-full"
                      style={{ width: `${poolDetails.poolBalances.token0Percentage}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">TVL</span>
                  <div className="text-white text-xl font-semibold">
                    ${poolDetails.tvl}
                    <span className="text-green-400 text-sm ml-2">↗ {poolDetails.tvlChange}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">24H volume</span>
                  <div className="text-white text-xl font-semibold">
                    ${poolDetails.volume24h}
                    <span className="text-green-400 text-sm ml-2">↗ {poolDetails.volumeChange}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">24H fees</span>
                  <div className="text-white text-xl font-semibold">${poolDetails.fees24h}</div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Links</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <PoolIcon
                    token0={{ symbol: poolDetails.token0.symbol }}
                    token1={{ symbol: poolDetails.token1.symbol }}
                    className="h-6 w-6"
                  />
                  <span className="text-white">
                    {poolDetails.token0.symbol} / {poolDetails.token1.symbol}
                  </span>
                  <span className="text-gray-400 text-sm">{poolDetails.address.slice(0, 8)}...</span>
                  <Button variant="ghost" size="sm" className="p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </Button>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">W</span>
                  </div>
                  <span className="text-white">{poolDetails.token0.symbol}</span>
                  <span className="text-gray-400 text-sm">{poolDetails.token0.address.slice(0, 8)}...</span>
                  <Button variant="ghost" size="sm" className="p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </Button>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">E</span>
                  </div>
                  <span className="text-white">{poolDetails.token1.symbol}</span>
                  <span className="text-gray-400 text-sm">{poolDetails.token1.address.slice(0, 8)}...</span>
                  <Button variant="ghost" size="sm" className="p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PoolDetailsPage;
