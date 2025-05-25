'use client';

import PositionsTable from '@/components/PositionsTable';
import { usePositions } from '@/hooks/usePositions';
import { useChainId } from 'wagmi';

export default function PositionsPage() {
  const chainId = useChainId();
  const { positions, loading } = usePositions(chainId);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Your Liquidity Positions</h1>
      <PositionsTable positions={positions} loading={loading} />
    </div>
  );
}
