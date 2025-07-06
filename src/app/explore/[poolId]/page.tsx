import { SimpleLineChart } from '@/components/SimpleLineChart';
import PoolIcon from '@/components/ui/logo/PoolLogo';
import Text from '@/components/ui/Text';
import { positionContent } from '@/content/positionContent';
import { Button } from '@/shadcn/components/ui/button';
import { Transaction } from '@/types/pools';
import { truncateNumber } from '@/utils/truncateNumber';
import { LineChart, LinkIcon, Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { fetchPoolDetails } from '../../../services/subgraph/fetchPoolDetails';
import DynamicLogo from '@/components/ui/logo/DynamicLogo';
import ClickToCopy from '@/utils/copyToClipboard';
import clsx from 'clsx';
import { getEllipsisTxt } from '@/utils/getEllipsisText';
import { generateExplorerLink } from '@/utils/address';

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

  const chainId = 56; // BSC as default

  return (
    <main className="min-h-screen bg-black py-6 px-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-6 text-gray-400">
          <Link href="/explore" className="hover:text-white">
            Explore
          </Link>

          <span>›</span>
          <span className="text-white">
            {poolDetails.token0.symbol}/{poolDetails.token1.symbol}
          </span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <PoolIcon
              token0={{ symbol: poolDetails.token0.symbol, logo: poolDetails.token0.logo }}
              token1={{ symbol: poolDetails.token1.symbol, logo: poolDetails.token1.logo }}
              className="h-12 w-12"
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center flex-wrap gap-2">
                <span>
                  {poolDetails.token0.symbol} / {poolDetails.token1.symbol}
                </span>
                <span className="text-sm bg-gray-800 px-2 py-1 rounded">v3</span>
                <span className="text-sm text-gray-400">{poolDetails.feeTier}%</span>
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                <span className="text-gray-400">${truncateNumber(poolDetails.price)}</span>
                <span className="text-gray-500">Past day</span>
              </div>
            </div>
          </div>

          {/* Right Section (Buttons) */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              prefetch={true}
              href={`/trade?srcToken=${poolDetails.token0.address}&destToken=${poolDetails.token1.address}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#1c121f] text-pink-400 hover:bg-[#2a1a33] transition"
            >
              <RefreshCw size={18} />
              <span>Swap</span>
            </Link>

            <Link
              prefetch={true}
              href={`/positions/create?token0=${poolDetails.token0.address}&token1=${poolDetails.token1.address}&fee=${poolDetails.feeTier * 10000}`}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#1c121f] text-pink-400 hover:bg-[#2a1a33] transition"
            >
              <Plus size={18} />
              <span>Add liquidity</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Section */}
          <div className="lg:col-span-2">
            {/* Price Chart */}
            <div className=" p-6">
              {poolDetails.chartData && poolDetails.chartData.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div></div>
                      {/* <div className="flex space-x-2">
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
                      </div> */}
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300">Volume</span>
                        {/* <Button variant="ghost" size="sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </Button> */}
                      </div>
                    </div>
                  </div>
                  <SimpleLineChart data={poolDetails.chartData} height={300} showGrid={true} strokeColor="#ec4899" />
                </>
              ) : (
                <div className="mt-4 rounded-lg h-[300px] flex items-center justify-center bg-background flex-1">
                  <div className="flex flex-col items-center text-center text-white space-y-3">
                    <div className="bg-zinc-800 p-3 rounded-full">
                      <LineChart className="w-6 h-6 text-zinc-400" />
                    </div>
                    <Text type="p" className="text-lg font-semibold">
                      {positionContent.noGraphTitle}
                    </Text>
                    <Text type="p" className="text-sm text-zinc-400 max-w-xs">
                      {positionContent.noGraphDesc}
                    </Text>
                  </div>
                </div>
              )}
            </div>
            {poolDetails.transactions.length > 0 && (
              <>
                <h2 className="text-xl font-semibold text-white mt-12 mb-4">Transactions</h2>

                <div className="w-full">
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                      <thead>
                        <tr className="text-gray-400 border-b border-gray-800">
                          <th className="py-2 px-4 whitespace-nowrap">Time</th>
                          <th className="py-2 px-4 whitespace-nowrap">Type</th>
                          <th className="py-2 px-4 whitespace-nowrap">{poolDetails.token0.symbol}</th>
                          <th className="py-2 px-4 whitespace-nowrap">{poolDetails.token1.symbol}</th>
                          <th className="py-2 px-4 whitespace-nowrap">Wallet</th>
                        </tr>
                      </thead>
                      <tbody>
                        {poolDetails.transactions.map((tx: Transaction, index: number) => (
                          <tr
                            key={index}
                            className="border-b border-gray-800 hover:bg-gray-800/40 transition-colors duration-200"
                          >
                            <td className="py-3 px-4 text-gray-300 whitespace-nowrap">{tx.timeAgo}</td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  tx.type === 'Sell' ? 'text-red-400 bg-red-400/10' : 'text-green-400 bg-blue-400/10'
                                }`}
                              >
                                {tx.type} {poolDetails.token0.symbol}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-white whitespace-nowrap">
                              {truncateNumber(tx.token0Amount)}
                            </td>
                            <td className="py-3 px-4 text-white whitespace-nowrap">
                              {truncateNumber(tx.token1Amount)}
                            </td>
                            <td className="py-3 px-4 text-gray-300 whitespace-nowrap">{tx.wallet}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="">
            {/* Stats */}
            <div className="md:mb-8  p-6">
              <span className="text-gray-400">Total APR</span>
              <h3 className="text-2xl font-bold text-white">{poolDetails.apr.toFixed(2)}%</h3>
            </div>
            <div className=" p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Stats</span>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">Pool balances</span>
                  <div className="mt-1">
                    <div className="text-white">
                      {truncateNumber(poolDetails.poolBalances.token0)} {poolDetails.token0.symbol}
                    </div>
                    <div className="text-white">
                      {truncateNumber(poolDetails.poolBalances.token1)} {poolDetails.token1.symbol}
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
                    {/* <span className="text-green-400 text-sm ml-2">↗ {poolDetails.tvlChange}%</span> */}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">24H volume</span>
                  <div className="text-white text-xl font-semibold">
                    ${poolDetails.volume24h}
                    {/* <span className="text-green-400 text-sm ml-2">↗ {poolDetails.volumeChange}%</span> */}
                  </div>
                </div>

                <div>
                  <span className="text-gray-400 text-sm">24H fees</span>
                  <div className="text-white text-xl font-semibold">${poolDetails.fees24h}</div>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="p-6 my-8">
              <h3 className="text-white font-semibold mb-4">Links</h3>
              <div className="">
                <div className="flex items-center">
                  <PoolIcon
                    token0={{ symbol: poolDetails.token0.symbol, logo: poolDetails.token0.logo }}
                    token1={{ symbol: poolDetails.token1.symbol, logo: poolDetails.token1.logo }}
                    className="h-6 w-6"
                  />
                  <span className="pl-4 text-white">
                    {poolDetails.token0.symbol} / {poolDetails.token1.symbol}
                  </span>
                  <div className="pl-4 flex gap-2 items-center">
                    <Text type="p" className={clsx('text-xs text-white')}>
                      {getEllipsisTxt(poolDetails.address)}
                    </Text>
                    <Button variant="ghost" size="sm" className="p-1">
                      <ClickToCopy copyText={poolDetails.address} className="cursor-pointer" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Link
                        href={generateExplorerLink(chainId, poolDetails.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View on block explorer"
                        className="flex items-center"
                      >
                        <LinkIcon className="text-gray-300 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                    <DynamicLogo
                      logoUrl={poolDetails.token0.logo}
                      alt={poolDetails.token0.symbol[0]}
                      className="rounded-full"
                    />
                  </div>
                  <span className="text-white">{poolDetails.token0.symbol}</span>
                  <div className="pl-4 flex gap-2 items-center">
                    <Text type="p" className={clsx('text-xs text-white')}>
                      {getEllipsisTxt(poolDetails.token0.address)}
                    </Text>
                    <Button variant="ghost" size="sm" className="p-1">
                      <ClickToCopy copyText={poolDetails.token0.address} className="cursor-pointer" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Link
                        href={generateExplorerLink(chainId, poolDetails.token0.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View on block explorer"
                        className="flex items-center"
                      >
                        <LinkIcon className="text-gray-300 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                    <DynamicLogo
                      logoUrl={poolDetails.token1.logo}
                      alt={poolDetails.token1.symbol[0]}
                      className="rounded-full"
                    />
                  </div>
                  <span className="text-white">{poolDetails.token1.symbol}</span>
                  <div className="pl-4 flex gap-2 items-center">
                    <Text type="p" className={clsx('text-xs text-white')}>
                      {getEllipsisTxt(poolDetails.token1.address)}
                    </Text>
                    <Button variant="ghost" size="sm" className="p-1">
                      <ClickToCopy copyText={poolDetails.token1.address} className="cursor-pointer" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1">
                      <Link
                        href={generateExplorerLink(chainId, poolDetails.token1.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View on block explorer"
                        className="flex items-center"
                      >
                        <LinkIcon className="text-gray-300 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
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
