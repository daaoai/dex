'use client';

import { V3Position } from '@/types/v3';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import { ModalWrapper } from '../ModalWrapper';
import Image from 'next/image';
import Text from '../ui/Text';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  position: V3Position;
}

const CollectRewardsModal = ({ isOpen, onClose }: Props) => {
  const [isCollecting, setIsCollecting] = useState(false);

  const handleCollect = async () => {
    setIsCollecting(true);
    try {
      console.log('Collecting fees...');
      await new Promise((res) => setTimeout(res, 1000));
    } finally {
      setIsCollecting(false);
      onClose();
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#0e0e0e] text-white max-w-md p-6 rounded-xl shadow-lg">
        <div className="text-lg font-semibold mb-4">Collect fees</div>

        <div className="bg-[#1b1b1b] p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Image width={20} height={20} src="/bnb-icon.svg" alt="BNB" className="w-6 h-6" />
              <Text type="span">BNB</Text>
            </div>
            <div className="text-sm text-muted-foreground">&lt;0.001 ($0.00000001)</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image width={20} height={20} src="/usdt-icon.svg" alt="USDT" className="w-6 h-6" />
              <text type="span">USDT</text>
            </div>
            <div className="text-sm text-muted-foreground">&lt;0.001 ($0.00000001)</div>
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
    </ModalWrapper>
  );
};
export default CollectRewardsModal;
