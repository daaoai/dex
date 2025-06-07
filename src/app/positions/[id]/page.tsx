'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import Image from 'next/image';
import IncreaseLiquidityModal from '@/components/modals/AddLiquidityModal';
import CollectRewardsModal from '@/components/modals/CollectFeesModal';
import RemoveLiquidityModal from '@/components/modals/RemoveLiquidityModal';
import { ModalWrapper } from '@/components/ModalWrapper';
import Text from '@/components/ui/Text';
import { chainsData } from '@/constants/chains';
import { Button } from '@/shadcn/components/ui/button';
import { V3Position } from '@/types/v3';
import { truncateNumber } from '@/utils/truncateNumber';
import Link from 'next/link';
import { formatUnits } from 'viem';
import PoolIcon from '@/components/PoolLogo';
import PriceRange from '@/components/position/PriceRanges';

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

  const {
    amount0,
    amount1,
    feeEarned0,
    feeEarned1,
    token0Details,
    token1Details,
    fee,
    isInRange,
    chainId,
    token0ToToken1,
    isInFullRange,
  } = position;

  return (
    <div className="p-6 text-white min-h-screen bg-grey-5">
      <Link href="/positions" className="text-sm  cursor-pointer">
        Your positions
      </Link>

      <div className="flex justify-between border-b border-stroke-2 pb-4 mt-4">
        <div className="flex items-center mt-4">
          <div className="w-10 h-10  rounded-full" />
          <div>
            <PoolIcon token0={token0Details} token1={token1Details} />
            <div className="font-semibold text-lg">
              {position.token0Details.symbol} / {position.token1Details.symbol}
            </div>
            <div className={`text-sm ${isInRange ? 'text-green-500' : 'text-red-500'}`}>
              {isInRange ? 'In range' : 'Out of range'}
            </div>
          </div>
          <div className="ml-2  text-xs px-2 py-1 rounded">v3 {fee / 1000}%</div>
          <div className="ml-2   text-xs px-2 py-1 rounded">{chainsData[chainId].name}</div>
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
        <div className="text-2xl font-bold">
          {`${truncateNumber(token0ToToken1.currentPrice, 4)} ${token1Details.symbol}`} = 1{' '}
          {position.token0Details.symbol}
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <div className="mt-4  rounded-lg h-[300px] flex items-center justify-center  flex-1">No graph found</div>
        <div className="flex flex-col gap-6 mt-6 w-2/5">
          {!isInFullRange && (
            <PriceRange
              minPrice={truncateNumber(token0ToToken1.minPrice, 4)}
              maxPrice={truncateNumber(token0ToToken1.maxPrice, 4)}
              marketPrice={truncateNumber(token0ToToken1.currentPrice, 4)}
              token0Symbol={token0Details.symbol}
              token1Symbol={token1Details.symbol}
            />
          )}
          <div className="p-4 rounded-lg bg-background">
            <div className="">Position</div>
            {/* <div className="text-2xl font-bold mt-2">$0.0000000133</div> */}
            {/* Percent seems to be calculated based on dollar value of the position 
            <div className="flex justify-between text-sm mt-4">
              <div className="flex items-center space-x-1">
                <Image src="/bnb-icon.svg" alt="bnb" width={20} height={20} />
                <Text type="span">50.01%</Text>
              </div>
              <div className="flex items-center space-x-1">
                <Image src="/usdt-icon.svg" alt="usdt" width={20} height={20} />
                <Text type="span">49.99%</Text>
              </div>
            </div> */}
            <div className="flex gap-2 text-sm mt-4">
              <Image
                src={token0Details.logo || '/placeholder.png'}
                alt={token0Details.symbol}
                width={20}
                height={20}
                className="rounded-full"
              />
              <Text type="p" className="mt-2 text-sm ">
                {truncateNumber(formatUnits(BigInt(amount0), token0Details.decimals), 4)} {token0Details.symbol}
              </Text>
            </div>
            <div className="flex gap-2 text-sm mt-4">
              <Image
                src={token1Details.logo || '/placeholder.png'}
                alt={token1Details.symbol}
                width={20}
                height={20}
                className="rounded-full"
              />
              <Text type="p" className="text-sm ">
                {truncateNumber(formatUnits(BigInt(amount1), token1Details.decimals), 4)} {token1Details.symbol}
              </Text>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-background">
            <div className="">Fees earned</div>
            {/* <Text type="p" className="text-2xl font-bold mt-2">
              &lt;$0.00000001
            </Text> */}
            {/* <div className="flex justify-between text-sm mt-4">
              <div className="flex items-center space-x-1">
                <Image src="/bnb-icon.svg" alt="bnb" width={20} height={20} />
                <Text type="span">50.72%</Text>
              </div>
              <div className="flex items-center space-x-1">
                <Image src="/usdt-icon.svg" alt="usdt" width={20} height={20} />
                <Text type="span">49.28%</Text>
              </div>
            </div> */}
            <div className="flex gap-2 text-sm mt-4">
              <Image
                src={token0Details.logo || '/placeholder.png'}
                alt={token0Details.symbol}
                width={20}
                height={20}
                className="rounded-full"
              />
              <Text type="p" className="mt-2 text-sm ">
                {truncateNumber(formatUnits(BigInt(feeEarned0), token0Details.decimals), 4)} {token0Details.symbol}
              </Text>
            </div>
            <div className="flex gap-2 text-sm mt-4">
              <Image
                src={token1Details.logo || '/placeholder.png'}
                alt={token1Details.symbol}
                width={20}
                height={20}
                className="rounded-full"
              />
              <Text type="p" className="text-sm ">
                {truncateNumber(formatUnits(BigInt(feeEarned1), token1Details.decimals), 4)} {token1Details.symbol}
              </Text>
            </div>
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
