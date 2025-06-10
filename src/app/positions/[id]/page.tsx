'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import Text from '@/components/ui/Text';
import { chainsData } from '@/constants/chains';
import { Button } from '@/shadcn/components/ui/button';
import { V3Position } from '@/types/v3';
import { truncateNumber } from '@/utils/truncateNumber';
import Link from 'next/link';
import { formatUnits } from 'viem';
import PoolIcon from '@/components/ui/logo/PoolLogo';
import PriceRange from '@/components/position/PriceRanges';
import { ArrowLeft, Circle, LineChart } from 'lucide-react';
import clsx from 'clsx';
import IncreaseLiquidityModal from '@/components/position/addLiquidity/AddLiquidityModal';
import CollectRewardsModal from '@/components/position/collectFees/CollectFeesModal';
import RemoveLiquidityModal from '@/components/position/removeLiquidity/RemoveLiquidityModal';
import DynamicLogo from '@/components/ui/logo/DynamicLogo';

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
      <div>
        <Link href="/positions" className="text-md cursor-pointer flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Your positions
        </Link>
      </div>

      <div className="flex justify-between border-b border-stroke-2 pb-4 mt-4">
        <div className="flex items-center mt-4">
          <div className="flex gap-6 items-center">
            <PoolIcon token0={token0Details} token1={token1Details} />
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Text type="p" className="font-semibold text-lg">
                  {position.token0Details.symbol} / {position.token1Details.symbol}
                </Text>
                <div>
                  <div className="flex gap-1">
                    <Text type="span" className="bg-gray-700 text-white text-xs px-2 py-1 rounded-l ">
                      v3
                    </Text>
                    <Text type="span" className="bg-gray-700 text-white text-xs px-2 py-1 rounded-r ">
                      {fee / 10000}%
                    </Text>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Text type="p" className="flex items-center gap-1 text-sm">
                  <Circle
                    className={clsx('w-2 h-2', isInRange ? 'text-green-500' : 'text-red-500')}
                    fill={isInRange ? 'currentColor' : 'currentColor'}
                  />
                  <span className={isInRange ? 'text-green-500' : 'text-red-500'}>
                    {isInRange ? 'In Range' : 'Out of Range'}
                  </span>
                </Text>

                <Text type="p" className="ml-2   text-xs px-2 py-1 rounded">
                  {chainsData[chainId].name}
                </Text>
              </div>
            </div>
          </div>
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

      <div className="flex gap-4 w-full items-start">
        <div className="mt-4 rounded-lg h-[300px] flex items-center justify-center bg-background flex-1">
          <div className="flex flex-col items-center text-center text-white space-y-3">
            <div className="bg-zinc-800 p-3 rounded-full">
              <LineChart className="w-6 h-6 text-zinc-400" />
            </div>
            <p className="text-lg font-semibold">No Graph Data</p>
            <p className="text-sm text-zinc-400 max-w-xs">
              We couldn’t generate a graph for this data. Try adjusting your filters or come back later.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-4 w-2/5">
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
            <Text type="p" className="">
              Position
            </Text>
            {/* <div className="text-2xl font-bold mt-2">$0.0000000133</div> */}
            {/* Percent seems to be calculated based on dollar value of the position 
            <div className="flex justify-between text-sm mt-4">
              <div className="flex items-center space-x-1">
                <Image logoUrl="/bnb-icon.svg" alt="bnb" width={20} height={20} />
                <Text type="span">50.01%</Text>
              </div>
              <div className="flex items-center space-x-1">
                <Image logoUrl="/usdt-icon.svg" alt="usdt" width={20} height={20} />
                <Text type="span">49.99%</Text>
              </div>
            </div> */}
            <div className="flex gap-2 text-sm mt-4">
              <DynamicLogo
                logoUrl={token0Details.logo}
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
              <DynamicLogo
                logoUrl={token1Details.logo}
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
                <Image logoUrl="/bnb-icon.svg" alt="bnb" width={20} height={20} />
                <Text type="span">50.72%</Text>
              </div>
              <div className="flex items-center space-x-1">
                <Image logoUrl="/usdt-icon.svg" alt="usdt" width={20} height={20} />
                <Text type="span">49.28%</Text>
              </div>
            </div> */}
            <div className="flex gap-2 text-sm mt-4">
              <DynamicLogo
                logoUrl={token0Details.logo}
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
              <DynamicLogo
                logoUrl={token1Details.logo}
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
