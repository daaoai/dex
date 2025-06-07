'use client';

import { V3Position } from '@/types/v3';
import { truncateNumber } from '@/utils/truncateNumber';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Text from './ui/Text';
import PoolIcon from './PoolLogo';
import Image from 'next/image';
import { formatUnits } from 'viem';

interface PositionsTableProps {
  positions: V3Position[];
  loading: boolean;
}

export default function PositionsTable({ positions, loading }: PositionsTableProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div className="relative overflow-hidden rounded-xl bg-grey-3 h-24 shimmer" key={i} />
        ))}
      </div>
    );
  }

  if (positions.length === 0) {
    return <p className="text-white p-4 bg-gray-800 rounded-lg">No positions found</p>;
  }

  return (
    <div className="space-y-4">
      {positions.map((position) => {
        const {
          feeEarned0,
          feeEarned1,
          token0Details,
          token1Details,
          tokenId,
          amount0,
          amount1,
          isInRange,
          isInFullRange,
          fee,
          token0ToToken1,
          apr,
        } = position;
        return (
          <div
            key={tokenId.toString()}
            className={clsx('bg-grey-3 rounded-xl shadow-md flex flex-col cursor-pointer transition')}
            onClick={() => router.push(`/positions/${tokenId}`)}
          >
            <div className="flex items-center p-4 bg-background">
              <PoolIcon token0={token0Details} token1={token1Details} />
              <div>
                <div className="text-white font-semibold text-lg">
                  {token0Details.symbol} / {token1Details.symbol}
                </div>
                <Text type="p" className={`${isInRange ? 'text-green-500' : 'text-red-500'} text-sm`}>
                  {isInRange ? 'In Range' : 'Out of Range'}
                </Text>
              </div>
              <Text type="span" className="bg-gray-700 text-white text-xs px-2 py-1 rounded ml-2">
                v3 {fee / 10000}%
              </Text>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-white bg-background-2 p-4">
              <div>
                <Text type="p" className="text-sm text-gray-400">
                  Position
                </Text>
                <div className="flex gap-2 text-sm mt-4">
                  <Image
                    src={token0Details.logo || '/placeholder.png'}
                    alt={token0Details.symbol}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <Text type="p" className="mt-2 text-sm ">
                    {truncateNumber(formatUnits(BigInt(amount0), token0Details.decimals), 4)} {token0Details.symbol}
                  </Text>
                </div>
                <div className="flex gap-2 text-sm mt-4">
                  <Image
                    src={token1Details.logo || '/placeholder.png'}
                    alt={token1Details.symbol}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <Text type="p" className="text-sm ">
                    {truncateNumber(formatUnits(BigInt(amount1), token1Details.decimals), 4)} {token1Details.symbol}
                  </Text>
                </div>
              </div>
              <div className="flex gap-2 text-sm mt-4">
                <Image
                  src={token0Details.logo || '/placeholder.png'}
                  alt={token0Details.symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <Text type="p" className="mt-2 text-sm ">
                  {truncateNumber(formatUnits(BigInt(feeEarned0), token0Details.decimals), 4)} {token0Details.symbol}
                </Text>
              </div>
              <div className="flex gap-2 text-sm mt-4">
                <Image
                  src={token1Details.logo || '/placeholder.png'}
                  alt={token1Details.symbol}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <Text type="p" className="text-sm ">
                  {truncateNumber(formatUnits(BigInt(feeEarned1), token1Details.decimals), 4)} {token1Details.symbol}
                </Text>
              </div>
              <div>
                <Text type="p" className="text-sm text-gray-400">
                  APR
                </Text>
                <Text type="p">{apr}%</Text>
              </div>
              <div>
                <Text type="p" className="text-sm text-gray-400">
                  Range
                </Text>
                {isInFullRange ? (
                  <Text type="p" className="text-sm text-gray-400">
                    Full Range
                  </Text>
                ) : (
                  <div>
                    <Text type="p" className="text-sm">
                      MinPrice {truncateNumber(token0ToToken1.minPrice, 4)} {token1Details.symbol} /{' '}
                      {token0Details.symbol}
                    </Text>
                    <Text type="p" className="text-sm">
                      MaxPrice {truncateNumber(token0ToToken1.maxPrice, 4)} {token1Details.symbol} /{' '}
                      {token0Details.symbol}
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
