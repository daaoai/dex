'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import useRemoveLiquidity from '@/hooks/useRemoveLiquidity';
import { supportedChainIds } from '@/constants/chains';
import IncreaseLiquidityModal from '@/components/IncreaseLiquidityModal';
import { V3Position } from '@/types/v3';
import Link from 'next/link';

export default function PositionDetails() {
  const params = useParams();
  const id = params.id as string;
  const [modalOpen, setModalOpen] = useState(false);
  const { decreaseLiquidity } = useRemoveLiquidity({ chainId: supportedChainIds.monadTestnet });

  const { positions } = useSelector((state: RootState) => state.position, shallowEqual);

  useEffect(() => {
    if (!id) return;
  }, [id]);

  const position = positions.find((pos: V3Position) => pos.tokenId.toString() === id);

  if (!position) {
    return <div className="text-white p-4 bg-gray-800 rounded-lg">Position not found</div>;
  }

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <Link href="/positions" className="text-sm text-gray-400 cursor-pointer">
        Your positions
      </Link>

      <div className="flex items-center mt-4 space-x-4">
        <div className="w-10 h-10 bg-yellow-400 rounded-full" />
        <div>
          <div className="font-semibold text-lg">
            {position.token0Details.symbol} / {position.token1Details.symbol}
          </div>
          <div className="text-green-500 text-sm">In range</div>
        </div>
        <div className="ml-2 bg-gray-700 text-xs px-2 py-1 rounded">v4 0.01%</div>
        <div className="ml-2 bg-green-800 text-green-400 text-xs px-2 py-1 rounded">BNB Smart Chain Mainnet</div>
      </div>

      <div className="mt-6">
        <div className="text-2xl font-bold">663.905 USDT = 1 {position.token0Details.symbol} ($664.35)</div>
      </div>
      <div className="flex space-x-4 mt-6">
        <button
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-bold"
          onClick={() => setModalOpen(true)}
        >
          Add liquidity
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded font-bold"
          onClick={() =>
            decreaseLiquidity({
              position,
              percent: 50,
            })
          }
        >
          Remove liquidity
        </button>
        <button
          className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded font-bold"
          onClick={() => {
            console.log('Collecting fees...');
          }}
        >
          Collect fees
        </button>
      </div>

      <div className="flex gap-4 w-full">
        <div className="mt-4 bg-gray-800 rounded-lg h-[300px] flex items-center justify-center text-gray-500 flex-1">
          No graph found
        </div>
        <div className="flex flex-col gap-4 gap-6 mt-6 w-2/5">
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="text-gray-400">Position</div>
            <div className="text-2xl font-bold mt-2">$0.0000000133</div>
            <div className="flex justify-between text-sm mt-4">
              <div className="flex items-center space-x-1">
                <img src="/bnb-icon.svg" alt="bnb" className="w-4 h-4" />
                <span>50.01%</span>
              </div>
              <div className="flex items-center space-x-1">
                <img src="/usdt-icon.svg" alt="usdt" className="w-4 h-4" />
                <span>49.99%</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">&lt;0.001 BNB</div>
            <div className="text-sm text-gray-400">&lt;0.001 USDT</div>
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="text-gray-400">Fees earned</div>
            <div className="text-2xl font-bold mt-2">&lt;$0.00000001</div>
            <div className="flex justify-between text-sm mt-4">
              <div className="flex items-center space-x-1">
                <img src="/bnb-icon.svg" alt="bnb" className="w-4 h-4" />
                <span>50.72%</span>
              </div>
              <div className="flex items-center space-x-1">
                <img src="/usdt-icon.svg" alt="usdt" className="w-4 h-4" />
                <span>49.28%</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-400">&lt;0.001 BNB</div>
            <div className="text-sm text-gray-400">&lt;0.001 USDT</div>
          </div>
        </div>
      </div>

      {/* Increase Liquidity Modal */}
      <IncreaseLiquidityModal isOpen={modalOpen} onClose={() => setModalOpen(false)} position={position} />
    </div>
  );
}
