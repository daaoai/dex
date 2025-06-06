'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../../store';

import IncreaseLiquidityModal from '@/components/modals/AddLiquidityModal';
import { V3Position } from '@/types/v3';
import Link from 'next/link';
import { Button } from '@/shadcn/components/ui/button';
import RemoveLiquidityModal from '@/components/modals/RemoveLiquidityModal';
import Image from 'next/image';
import Text from '@/components/ui/Text';
import CollectRewardsModal from '@/components/modals/CollectFeesModal';
import { ModalWrapper } from '@/components/ModalWrapper';

export default function PositionDetails() {
  const params = useParams();
  const id = params.id as string;
  const [modalOpen, setModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [collectModalOpen, setCollectModalOpen] = useState(false);

  const { positions } = useSelector((state: RootState) => state.position, shallowEqual);

  useEffect(() => {
    if (!id) return;
  }, [id]);

  const position = positions.find((pos: V3Position) => pos.tokenId.toString() === id);

  if (!position) {
    return <div className="text-white p-4 bg-grey-2 rounded-lg">Position not found</div>;
  }

  return (
    <div className="p-6 text-white min-h-screen bg-grey-5">
      <Link href="/positions" className="text-sm  cursor-pointer">
        Your positions
      </Link>

      <div className="flex justify-between border-b border-stroke-2 pb-4 mt-4">
        <div className="flex items-center mt-4">
          <div className="w-10 h-10  rounded-full" />
          <div>
            <div className="font-semibold text-lg">
              {position.token0Details.symbol} / {position.token1Details.symbol}
            </div>
            <div className="text-sm">In range</div>
          </div>
          <div className="ml-2  text-xs px-2 py-1 rounded">v4 0.01%</div>
          <div className="ml-2   text-xs px-2 py-1 rounded">BNB Smart Chain Mainnet</div>
        </div>
        <div className="flex mt-6 gap-2">
          <Button className="px-4 py-2 rounded font-bold bg-background text-white" onClick={() => setModalOpen(true)}>
            Add liquidity
          </Button>
          <Button
            className="px-4 py-2 rounded font-bold bg-background text-white"
            onClick={() => setRemoveModalOpen(true)}
          >
            Remove liquidity
          </Button>
          <Button className="bg-white text-black px-4 py-2 rounded font-bold" onClick={() => setCollectModalOpen(true)}>
            Collect fees
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-2xl font-bold">663.905 USDT = 1 {position.token0Details.symbol} ($664.35)</div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="mt-4  rounded-lg h-[300px] flex items-center justify-center  flex-1">No graph found</div>
        <div className="flex flex-col gap-6 mt-6 w-2/5">
          <div className="p-4 rounded-lg bg-background">
            <div className="">Position</div>
            <div className="text-2xl font-bold mt-2">$0.0000000133</div>
            <div className="flex justify-between text-sm mt-4">
              <div className="flex items-center space-x-1">
                <Image src="/bnb-icon.svg" alt="bnb" width={20} height={20} />
                <Text type="span">50.01%</Text>
              </div>
              <div className="flex items-center space-x-1">
                <Image src="/usdt-icon.svg" alt="usdt" width={20} height={20} />
                <Text type="span">49.99%</Text>
              </div>
            </div>

            <Text type="p" className="mt-2 text-sm ">
              &lt;0.001 BNB
            </Text>
            <Text type="p" className="text-sm ">
              &lt;0.001 USDT
            </Text>
          </div>

          <div className="p-4 rounded-lg bg-background">
            <div className="">Fees earned</div>
            <Text type="p" className="text-2xl font-bold mt-2">
              &lt;$0.00000001
            </Text>
            <div className="flex justify-between text-sm mt-4">
              <div className="flex items-center space-x-1">
                <Image src="/bnb-icon.svg" alt="bnb" width={20} height={20} />
                <Text type="span">50.72%</Text>
              </div>
              <div className="flex items-center space-x-1">
                <Image src="/usdt-icon.svg" alt="usdt" width={20} height={20} />
                <Text type="span">49.28%</Text>
              </div>
            </div>
            <Text type="p" className="mt-2 text-sm ">
              &lt;0.001 BNB
            </Text>
            <Text type="p" className="text-sm ">
              &lt;0.001 USDT
            </Text>
          </div>
        </div>
      </div>
      <ModalWrapper isOpen={removeModalOpen} onClose={() => setRemoveModalOpen(false)}>
        <RemoveLiquidityModal position={position} onClose={() => setRemoveModalOpen(false)} />
      </ModalWrapper>
      <ModalWrapper isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <IncreaseLiquidityModal position={position} onClose={() => setModalOpen(false)} />
      </ModalWrapper>
      <ModalWrapper isOpen={collectModalOpen} onClose={() => setCollectModalOpen(false)}>
        <CollectRewardsModal position={position} onClose={() => setCollectModalOpen(false)} />
      </ModalWrapper>
    </div>
  );
}
