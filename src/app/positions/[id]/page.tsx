'use client';
import IncreaseLiquidityModal from '@/components/position/addLiquidity/AddLiquidityModal';
import CollectRewardsModal from '@/components/position/collectFees/CollectFeesModal';
import { PositionPriceChart } from '@/components/position/PositionPriceChart';
import PriceRange from '@/components/position/PriceRanges';
import RemoveLiquidityModal from '@/components/position/removeLiquidity/RemoveLiquidityModal';
import { PositionDetailsSkeleton } from '@/components/position/shimmers/PositionDetails';
import DynamicLogo from '@/components/ui/logo/DynamicLogo';
import PoolIcon from '@/components/ui/logo/PoolLogo';
import { ModalWrapper } from '@/components/ui/ModalWrapper';
import Text from '@/components/ui/Text';
import { chainsData, supportedChainIds } from '@/constants/chains';
import { positionContent } from '@/content/positionContent';
import { usePositionPriceData } from '@/hooks/usePositionPriceData';
import { usePositions } from '@/hooks/usePositions';
import { Button } from '@/shadcn/components/ui/button';
import { HistoryDuration } from '@/types/positions';
import { V3Position } from '@/types/v3';
import { truncateNumber } from '@/utils/truncateNumber';
import clsx from 'clsx';
import { ArrowLeft, Circle, LineChart } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { formatUnits } from 'viem';
import { RootState } from '../../../../store';

export default function PositionDetails() {
  const params = useParams();
  const id = params.id as string;
  const [modalOpen, setModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<HistoryDuration>('WEEK');
  const { positions } = useSelector((state: RootState) => state.position, shallowEqual);
  const [isPositionLoading, setIsPositionLoading] = useState(true);
  const [position, setPosition] = useState<V3Position | undefined>(
    positions.find((pos: V3Position) => pos.tokenId.toString() === id),
  );

  const { fetchPositionWithId } = usePositions(supportedChainIds.bsc);

  // Fetch price data for the position's pool
  const {
    data: priceData,
    loading: priceLoading,
    error: priceError,
  } = usePositionPriceData({
    poolAddress: position?.poolAddress,
    duration: selectedTimeframe,
    autoRefresh: true,
    refreshInterval: 60000, // Refresh every minute
  });

  useEffect(() => {
    if (!id) return;
    if (!position) {
      fetchPositionWithId(BigInt(id)).then((position) => {
        setIsPositionLoading(false);
        if (!position) {
          setPosition(undefined);
          return;
        }
        setPosition(position);
      });
    } else {
      setIsPositionLoading(false);
    }
  }, [id]);

  if (isPositionLoading && !position) {
    return <PositionDetailsSkeleton />;
  }

  if (!position) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Text type="p" className="text-white">
          Position not found
        </Text>
      </div>
    );
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

  const renderModals = () => (
    <>
      <ModalWrapper isOpen={removeModalOpen} onClose={() => setRemoveModalOpen(false)}>
        <RemoveLiquidityModal position={position} onClose={() => setRemoveModalOpen(false)} />
      </ModalWrapper>
      <ModalWrapper isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <IncreaseLiquidityModal position={position} onClose={() => setModalOpen(false)} />
      </ModalWrapper>
      <ModalWrapper isOpen={collectModalOpen} onClose={() => setCollectModalOpen(false)}>
        <CollectRewardsModal position={position} onClose={() => setCollectModalOpen(false)} />
      </ModalWrapper>
    </>
  );

  return (
    <div className="p-6 text-white min-h-screen bg-grey-5">
      <div>
        <Link href="/positions" className="text-md cursor-pointer flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {positionContent.backLink}
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
            {positionContent.addLiquidity}
          </Button>
          <Button
            className="px-4 py-2 rounded font-bold bg-background text-white"
            onClick={() => setRemoveModalOpen(true)}
          >
            {positionContent.removeLiquidity}
          </Button>
          <Button className="bg-white text-black px-4 py-2 rounded font-bold" onClick={() => setCollectModalOpen(true)}>
            {positionContent.collectFees}
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
        <div className="mt-4 rounded-lg h-[300px] flex-1">
          {priceLoading ? (
            <div className="flex items-center justify-center text-center text-white space-y-3 bg-background rounded-lg h-full">
              <div className="flex flex-col items-center">
                <div className="bg-zinc-800 p-3 rounded-full mb-3">
                  <LineChart className="w-6 h-6 text-zinc-400 animate-pulse" />
                </div>
                <Text type="p" className="text-lg font-semibold">
                  Loading Chart...
                </Text>
              </div>
            </div>
          ) : priceError ? (
            <div className="flex items-center justify-center text-center text-white space-y-3 bg-background rounded-lg h-full">
              <div className="flex flex-col items-center">
                <div className="bg-zinc-800 p-3 rounded-full mb-3">
                  <LineChart className="w-6 h-6 text-red-400" />
                </div>
                <Text type="p" className="text-lg font-semibold">
                  Failed to Load Chart
                </Text>
                <Text type="p" className="text-sm text-zinc-400 max-w-xs">
                  {priceError}
                </Text>
              </div>
            </div>
          ) : (
            <div className="h-full">
              {/* Price chart - always render, let component handle empty states */}
              <PositionPriceChart
                data={priceData?.chartData || []}
                height={250}
                token0Symbol={token0Details.symbol}
                token1Symbol={token1Details.symbol}
                currentPrice={token0ToToken1.currentPrice}
                strokeColor="#22c55e"
                showGrid={true}
                duration={selectedTimeframe}
                onDurationChange={setSelectedTimeframe}
                loading={priceLoading}
              />
            </div>
          )}
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
              {positionContent.position}
            </Text>

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
            <Text type="p" className="">
              {positionContent.feesEarned}
            </Text>

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
      {renderModals()}
    </div>
  );
}
