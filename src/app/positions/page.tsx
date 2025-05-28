'use client';

import PositionsTable from '@/components/PositionsTable';
import { usePositions } from '@/hooks/usePositions';
import { V3Position } from '@/types/v3';
import { useEffect, useState } from 'react';
import { useChainId } from 'wagmi';

export default function PositionsPage() {
  const chainId = useChainId();
  const { fetchPositions } = usePositions(chainId);
  const [positions, setPositions] = useState<V3Position[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleLoadPositions = async () => {
    setLoading(true);
    const positions = await fetchPositions();
    setPositions(positions);
    setLoading(false);
  };

  useEffect(() => {
    handleLoadPositions();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-white">Your Liquidity Positions</h1>
      <PositionsTable positions={positions} loading={loading} />
    </div>
  );
}
