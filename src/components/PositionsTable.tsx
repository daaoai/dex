'use client';

import { V3Position } from '@/types/v3';
import { truncateNumber } from '@/utils/truncateNumber';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Text from './ui/Text';

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
      {positions.map((position) => (
        <div
          key={position.tokenId.toString()}
          className={clsx('bg-grey-3 rounded-xl shadow-md flex flex-col cursor-pointer transition')}
          onClick={() => router.push(`/positions/${position.tokenId}`)}
        >
          <div className="flex items-center p-4 bg-background">
            <div className="w-12 h-12 bg-gray-700 rounded-full" />
            <div>
              <div className="text-white font-semibold text-lg">
                {position.token0Details.symbol} / {position.token1Details.symbol}
              </div>
              <Text type="p" className="text-green-500 text-sm">
                In range
              </Text>
            </div>
            <Text type="span" className="bg-gray-700 text-white text-xs px-2 py-1 rounded ml-2">
              v3 {position.fee / 10000}%
            </Text>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-white bg-background-2 p-4">
            <div>
              <Text type="p" className="text-sm text-gray-400">
                Position
              </Text>
              <Text type="p">${truncateNumber(position.liquidity.toString())}</Text>
            </div>
            <div>
              <Text type="p" className="text-sm text-gray-400">
                Fees
              </Text>
              <Text type="p">$0.00</Text>
            </div>
            <div>
              <Text type="p" className="text-sm text-gray-400">
                APR
              </Text>
              <Text type="p">64.39%</Text>
            </div>
            <div>
              <Text type="p" className="text-sm text-gray-400">
                Range
              </Text>
              <Text type="span">
                {position.tickLower} - {position.tickUpper}
              </Text>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
