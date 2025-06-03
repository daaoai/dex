'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useRemoveLiquidity from '@/hooks/useRemoveLiquidity';
import { supportedChainIds } from '@/constants/chains';
import { V3Position } from '@/types/v3';
import IncreaseLiquidityModal from '@/components/IncreaseLiquidityModal';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../../store';

export default function PositionDetails() {
  const params = useParams();
  const id = params.id as string;
  const [modalOpen, setModalOpen] = useState(false);
  const { decreaseLiquidity } = useRemoveLiquidity({ chainId: supportedChainIds.monadTestnet });

  const { positions } = useSelector((state: RootState) => state.position, shallowEqual);

  useEffect(() => {
    if (!id) return;
    // Fetch the position details using the id
    // Replace this with your actual data fetching logic
    // Example:
    // fetch(`/api/positions/${id}`)
    //   .then(res => res.json())
    //   .then(data => setPosition(data));
  }, [id]);

  const position = positions.find((pos: V3Position) => pos.tokenId.toString() === id);

  if (!position) {
    return <div className="text-white p-4 bg-gray-800 rounded-lg">Position not found</div>;
  }

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-md max-w-2xl mx-auto mt-8">
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
      <div className="flex flex-wrap items-center justify-start mt-4 space-x-6 text-white">
        <div className="text-center">
          <div className="text-sm text-gray-400">Position</div>
          <div>${position.liquidity}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Fees</div>
          <div>$0.00</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">APR</div>
          <div>64.39%</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400">Range</div>
          <div>
            {position.tickLower} - {position.tickUpper}
          </div>
        </div>
      </div>
      <div className="flex space-x-2 mt-6">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
          onClick={() => setModalOpen(true)}
        >
          Increase Liquidity
        </button>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
          onClick={() =>
            decreaseLiquidity({
              position,
              percent: 50,
            })
          }
        >
          Decrease Liquidity
        </button>
      </div>
      <IncreaseLiquidityModal isOpen={modalOpen} onClose={() => setModalOpen(false)} position={position} />
    </div>
  );
}
