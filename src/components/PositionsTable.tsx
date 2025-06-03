'use client';

import { V3Position } from '@/types/v3';
import { truncateNumber } from '@/utils/truncateNumber';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import PositionRecordShimmer from './shimmer/PositionRecordShimmer';

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
          <PositionRecordShimmer key={i} />
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
          className={clsx(
            'bg-grey-3 rounded-xl p-4 shadow-md flex flex-col cursor-pointer hover:bg-gray-800 transition',
          )}
          onClick={() => router.push(`/positions/${position.tokenId}`)}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-700 rounded-full" />
            <div>
              <div className="text-white font-semibold text-lg">
                {position.token0Details.symbol} / {position.token1Details.symbol}
              </div>
              <div className="text-green-500 text-sm">In range</div>
            </div>
            <div className="bg-gray-700 text-white text-xs px-2 py-1 rounded ml-2">v3 {position.fee / 10000}%</div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-white">
            <div>
              <div className="text-sm text-gray-400">Position</div>
              <div>${truncateNumber(position.liquidity.toString())}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Fees</div>
              <div>$0.00</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">APR</div>
              <div>64.39%</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Range</div>
              <div>
                {position.tickLower} - {position.tickUpper}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
