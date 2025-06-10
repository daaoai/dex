'use client';

import Text from '@/components/ui/Text';
import useHarvestLiquidity from '@/hooks/useHarvestLiquidity';
import { Button } from '@/shadcn/components/ui/button';
import { V3Position } from '@/types/v3';
import Image from 'next/image';
import { useState } from 'react';
import { formatUnits } from 'viem';

interface Props {
  onClose: () => void;
  position: V3Position;
}

const CollectRewardsModal = ({ onClose, position }: Props) => {
  const [isCollecting, setIsCollecting] = useState(false);

  const { harvestLiquidity } = useHarvestLiquidity({ chainId: position.chainId });

  const handleCollect = async () => {
    setIsCollecting(true);
    try {
      console.log('Collecting fees...');
      await harvestLiquidity({
        position,
      });
    } finally {
      setIsCollecting(false);
      onClose();
    }
  };

  const { feeEarned0, feeEarned1, token0Details, token1Details } = position;

  return (
    <div className="bg-[#0e0e0e] text-white max-w-md p-6 rounded-xl shadow-lg">
      <div className="text-lg font-semibold mb-4">Collect fees</div>

      <div className="bg-[#1b1b1b] p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Image
              width={20}
              height={20}
              src={token0Details.logo || ''}
              alt={token0Details.symbol}
              className="w-6 h-6"
            />
            <Text type="span">{token0Details.symbol}</Text>
          </div>
          <div className="text-sm text-muted-foreground">{formatUnits(BigInt(feeEarned0), token0Details.decimals)}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              width={20}
              height={20}
              src={token1Details.logo || ''}
              alt={token1Details.symbol}
              className="w-6 h-6"
            />
            <Text type="span">{token1Details.symbol}</Text>
          </div>
          <div className="text-sm text-muted-foreground">{formatUnits(BigInt(feeEarned1), token1Details.decimals)}</div>
        </div>
      </div>

      <Button
        className="w-full bg-[#ff00aa] text-white font-bold text-md py-2 rounded-full"
        disabled={isCollecting}
        onClick={handleCollect}
      >
        {isCollecting ? 'Collecting...' : 'Collect'}
      </Button>
    </div>
  );
};
export default CollectRewardsModal;
