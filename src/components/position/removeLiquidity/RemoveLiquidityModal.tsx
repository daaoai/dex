'use client';

import { V3Position } from '@/types/v3';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import useRemoveLiquidity from '@/hooks/useRemoveLiquidity';
import { supportedChainIds } from '@/constants/chains';
import { formatUnits } from 'viem';
import { X, Settings, Circle } from 'lucide-react';
import clsx from 'clsx';
import Text from '@/components/ui/Text';
import PoolIcon from '@/components/ui/logo/PoolLogo';
import { removeLiquidityContent } from '@/content/positionContent';

interface Props {
  onClose: () => void;
  position: V3Position;
}

const percentages = [25, 50, 75, 100];

export default function RemoveLiquidityModal({ onClose, position }: Props) {
  const [selectedPercent, setSelectedPercent] = useState<number>(0);
  const { decreaseLiquidity } = useRemoveLiquidity({ chainId: supportedChainIds.bsc });

  const handleRemove = async () => {
    if (!selectedPercent) return;
    await decreaseLiquidity({ position, percent: selectedPercent });
    onClose();
  };

  const { amount0, amount1, token0Details, token1Details, fee } = position;

  return (
    <div className="bg-background text-white max-w-xl w-full p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onClose} className="text-white hover:text-white px-0">
          <X className="w-5 h-5" />
        </Button>
        <Text type="h2" className="text-xl font-bold text-white">
          {removeLiquidityContent.title}
        </Text>
        <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <PoolIcon token0={position.token0Details} token1={position.token1Details} />
        <div>
          <Text type="p" className="text-lg font-semibold">
            {token0Details.symbol}/{token1Details.symbol}
          </Text>
          <Text type="p" className="flex items-center gap-1 text-sm">
            <Circle
              className={clsx('w-2 h-2', position.isInRange ? 'text-green-500' : 'text-red-500')}
              fill={position.isInRange ? 'currentColor' : 'currentColor'}
            />
            <span className={position.isInRange ? 'text-green-500' : 'text-red-500'}>
              {position.isInRange ? removeLiquidityContent.inRange : removeLiquidityContent.outOfRange}
            </span>
          </Text>
        </div>
        <Text type="p" className="ml-auto text-xs bg-grey-4 px-2 py-1 rounded">
          v3 {fee / 10000}%
        </Text>
      </div>

      {/* Withdrawal input section with styled border */}
      {/* Withdrawal amount */}
      <div className="border border-gray-700 bg-grey-5 rounded-xl px-6 py-4 mb-6">
        <Text type="p" className="text-sm text-gray-400 mb-3">
          {removeLiquidityContent.withdrawalAmount}
        </Text>

        {/* Centered percentage display */}
        <div className="text-center text-white text-6xl font-extrabold tracking-wide mb-6">{selectedPercent}%</div>

        <div className="flex justify-between gap-3">
          {percentages.map((p) => (
            <Button
              key={p}
              onClick={() => setSelectedPercent(p)}
              className={`flex-1 rounded-lg py-2 font-semibold text-sm transition-all ${
                selectedPercent === p ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
              }`}
            >
              {p === 100 ? removeLiquidityContent.max : `${p} %`}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-sm mb-2">
        <Text type="span">
          {token0Details.symbol} {removeLiquidityContent.position}
        </Text>
        <Text type="span">
          {Number(formatUnits(BigInt(amount0), token0Details.decimals)).toFixed(4)} {token0Details.symbol}
        </Text>
      </div>

      <div className="flex justify-between text-sm mb-6">
        <Text type="span">{token1Details.symbol} position</Text>
        <Text type="span">
          {Number(formatUnits(BigInt(amount1), token1Details.decimals)).toFixed(4)} {token1Details.symbol}
        </Text>
      </div>

      <Button className="w-full bg-white text-black font-bold" disabled={selectedPercent === 0} onClick={handleRemove}>
        {removeLiquidityContent.remove}
      </Button>
    </div>
  );
}
