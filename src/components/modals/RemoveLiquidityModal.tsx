'use client';

import { V3Position } from '@/types/v3';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import useRemoveLiquidity from '@/hooks/useRemoveLiquidity';
import { supportedChainIds } from '@/constants/chains';
import { ModalWrapper } from '../ModalWrapper';
import Text from '../ui/Text';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  position: V3Position;
}

const percentages = [25, 50, 75, 100];

export default function RemoveLiquidityModal({ isOpen, onClose, position }: Props) {
  const [selectedPercent, setSelectedPercent] = useState<number>(0);
  const { decreaseLiquidity } = useRemoveLiquidity({ chainId: supportedChainIds.monadTestnet });

  const handleRemove = async () => {
    if (!selectedPercent) return;
    await decreaseLiquidity({ position, percent: selectedPercent });
    onClose();
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-background text-white max-w-md mx-auto p-6 rounded-lg">
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
            v4 0.01%
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
          <Text type="span">ETH position</Text>
          <Text type="span">{position.amount0} ETH</Text>
        </div>
        <div className="flex justify-between text-sm mb-6">
          <Text type="span">USDT position</Text>
          <Text type="span">{position.amount1} USDT</Text>
        </div>

        <Button
          className="w-full bg-white text-black font-bold"
          disabled={selectedPercent === 0}
          onClick={handleRemove}
        >
          Remove
        </Button>
      </div>
    </ModalWrapper>
  );
}
