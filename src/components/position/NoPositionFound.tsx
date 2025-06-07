'use client';

import { Waves } from 'lucide-react';
import Link from 'next/link';
import Text from '../ui/Text';
import { V3Position } from '@/types/v3';

type NoPositionsProps = {
  positions: V3Position[];
};

const NoPositions = ({ positions }: NoPositionsProps) => {
  if (positions.length > 0) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 flex flex-col items-center text-center text-white space-y-6">
      <div className="bg-zinc-800 rounded-xl p-4">
        <Waves size={32} />
      </div>
      <Text type="h2" className="text-xl font-semibold">
        No positions
      </Text>
      <Text type="p" className="text-zinc-400 max-w-md">
        You don’t have any liquidity positions. Create a new position to start earning fees and rewards on eligible
        pools.
      </Text>
      <div className="flex gap-4">
        <Link
          href="/explore"
          className="bg-zinc-800 text-white font-medium py-2 px-4 rounded-xl hover:bg-zinc-700 transition"
        >
          Explore pools
        </Link>
        <Link
          href="/positions/create"
          className="bg-white text-black font-medium py-2 px-4 rounded-xl hover:bg-zinc-200 transition"
        >
          New position
        </Link>
      </div>
    </div>
  );
};

export default NoPositions;
