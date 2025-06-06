'use client';

import { V3Position } from '@/types/v3';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import useRemoveLiquidity from '@/hooks/useRemoveLiquidity';
import { supportedChainIds } from '@/constants/chains';
import Text from '../ui/Text';
import Image from 'next/image';
import { formatUnits } from 'viem';
import { X, Settings } from 'lucide-react';

interface Props {
  onClose: () => void;
  position: V3Position;
}

const percentages = [25, 50, 75, 100];

export default function RemoveLiquidityModal({ onClose, position }: Props) {
  const [selectedPercent, setSelectedPercent] = useState<number>(0);
  const { decreaseLiquidity } = useRemoveLiquidity({ chainId: supportedChainIds.monadTestnet });

  const handleRemove = async () => {
    if (!selectedPercent) return;
    await decreaseLiquidity({ position, percent: selectedPercent });
    onClose();
  };

  const { amount0, amount1, token0Details, token1Details, fee } = position;

  return (
    <div className="bg-background text-white max-w-md mx-auto p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onClose} className="text-white hover:text-white px-0">
          <X className="w-5 h-5" />
        </Button>
        <Text type="h2" className="text-xl font-bold text-white">
          Remove Liquidity
        </Text>
        <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
      </div>
      <div className="flex items-center gap-3 mb-4">
        <Image src="/favicon.png" alt="Logo" width={10} height={10} />
        <div>
          <Text type="p" className="text-lg font-semibold">
            {position.token0Details.symbol}/{position.token1Details.symbol}
          </Text>
          <Text type="p" className="text-green-400 text-sm">
            In range
          </Text>
        </div>
        <Text type="p" className="ml-auto text-xs bg-grey-4 px-2 py-1 rounded">
          v3 {fee / 10000}%
        </Text>
      </div>

      <Text type="h2" className="text-sm mb-2">
        Withdrawal amount
      </Text>
      <Text type="p" className="bg-grey-4 p-4 rounded text-3xl font-bold text-center mb-4">
        {selectedPercent}%
      </Text>

      <div className="flex justify-between gap-2 mb-6">
        {percentages.map((p) => (
          <Button
            key={p}
            className={`flex-1 ${selectedPercent === p ? 'bg-white text-black' : 'bg-grey-3'}`}
            onClick={() => setSelectedPercent(p)}
          >
            {p === 100 ? 'Max' : `${p} %`}
          </Button>
        ))}
      </div>

      <div className="flex justify-between text-sm mb-2">
        <Text type="span">{token0Details.symbol} position</Text>
        <Text type="span">
          {formatUnits(BigInt(amount0), token0Details.decimals)} {token0Details.symbol}
        </Text>
      </div>
      <div className="flex justify-between text-sm mb-6">
        <Text type="span">{token1Details.symbol} position</Text>
        <Text type="span">
          {formatUnits(BigInt(amount1), token1Details.decimals)} {token1Details.symbol}
        </Text>
      </div>

      <Button className="w-full bg-white text-black font-bold" disabled={selectedPercent === 0} onClick={handleRemove}>
        Remove
      </Button>
    </div>
  );
}
