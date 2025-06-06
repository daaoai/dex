'use client';
import { Button } from '@/shadcn/components/ui/button';
import { ModalWrapper } from '../ModalWrapper';
import Text from '../ui/Text';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: () => void;
  position: {
    token0Symbol: string;
    token1Symbol: string;
    amount0: string;
    amount1: string;
    value0USD: string;
    value1USD: string;
    networkFee: string;
  };
}

export default function ReviewPositionModal({ isOpen, onClose, onCreate, position }: Props) {
  const { token0Symbol, token1Symbol, amount0, amount1, value0USD, value1USD, networkFee } = position;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="bg-[#0e0e0e] text-white max-w-md p-6 rounded-xl">
        <Text type="p" className="text-lg font-semibold mb-2">
          Creating position
        </Text>

        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold">
            {token0Symbol} / {token1Symbol}
          </div>
          <Text type="p" className="text-xs bg-[#333] px-2 py-1 rounded-full">
            v4 0.05%
          </Text>
        </div>

        {/* Chart image or placeholder */}
        <div className="h-24 bg-[#1c1c1c] rounded mb-6 flex items-center justify-center text-xs text-muted-foreground">
          <Image
            src="/placeholder-chart.svg"
            alt="chart"
            className="h-full w-full object-cover rounded"
            width={20}
            height={20}
          />
        </div>

        <div className="flex justify-between text-sm mb-1">
          <Text type="p">Min</Text>
          <Text type="span">0 USDT/BNB</Text>
        </div>
        <div className="flex justify-between text-sm mb-4">
          <Text type="span">Max</Text>
          <Text type="span">∞ USDT/BNB</Text>
        </div>

        <div className="text-sm mb-1">Depositing</div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex gap-2 items-center">
            <Image src="/bnb-icon.svg" className="w-5 h-5" alt="BNB" width={20} height={20} />
            <Text type="span" className="text-sm">
              {amount0} {token0Symbol}
            </Text>
          </div>
          <Text type="span" className="text-xs text-muted-foreground">
            ${value0USD}
          </Text>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2 items-center">
            <Image src="/usdt-icon.svg" className="w-5 h-5" alt="USDT" width={20} height={20} />
            <Text type="span" className="text-sm">
              {amount1} {token1Symbol}
            </Text>
          </div>
          <span className="text-xs text-muted-foreground">${value1USD}</span>
        </div>

        <div className="border-t border-[#222] pt-4 mb-4">
          <div className="flex justify-between items-center text-sm">
            <Text type="span" className="text-muted-foreground">
              Network cost
            </Text>
            <div className="flex gap-1 items-center">
              <Image src="/bnb-icon.svg" className="w-4 h-4" alt="fee" width={20} height={20} />
              <Text type="span">${networkFee}</Text>
            </div>
          </div>
        </div>

        <Button className="w-full bg-[#ff00aa] text-white font-bold text-md py-2 rounded-full" onClick={onCreate}>
          Create
        </Button>
      </div>
    </ModalWrapper>
  );
}
