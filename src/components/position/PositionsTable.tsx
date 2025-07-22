import { V3Position } from '@/types/v3';
import { truncateNumber } from '@/utils/truncateNumber';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Text from '../ui/Text';
import PoolIcon from '../ui/logo/PoolLogo';
import { formatUnits } from 'viem';
import { Circle } from 'lucide-react';
import NoPositions from './NoPositionFound';
import DynamicLogo from '../ui/logo/DynamicLogo';
import { positionsTableContent } from '@/content/positionContent';
import { MiniPriceChart } from './MiniPriceChart';
import { usePositionPriceData } from '@/hooks/usePositionPriceData';
import { useState } from 'react';
import { HistoryDuration } from '@/types/positions';

interface PositionsTableProps {
  positions: V3Position[];
  loading: boolean;
}

interface PositionRowProps {
  position: V3Position;
  onClick: () => void;
}

function PositionRow({ position, onClick }: PositionRowProps) {
  const [selectedTimeframe] = useState<HistoryDuration>('WEEK');

  const {
    feeEarned0,
    feeEarned1,
    token0Details,
    token1Details,
    tokenId,
    amount0,
    amount1,
    isInRange,
    isInFullRange,
    fee,
    token0ToToken1,
    apr,
  } = position;

  // Fetch price data for the position's pool
  const {
    data: priceData,
    loading: priceLoading,
    error: priceError,
  } = usePositionPriceData({
    poolAddress: position.poolAddress,
    duration: selectedTimeframe,
    autoRefresh: false,
  });

  return (
    <div
      key={tokenId.toString()}
      className={clsx(
        'bg-grey-3 rounded-lg overflow-hidden shadow-md flex flex-col cursor-pointer transition border border-stroke-2',
      )}
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center p-4 gap-6 bg-background-2 justify-between">
        <div className="flex flex-col items-start md:flex-row md:items-center justify-between w-full gap-4">
          <div className="flex items-center gap-4">
            <PoolIcon token0={token0Details} token1={token1Details} />
            <div>
              <div className="text-white font-semibold text-lg">
                {token0Details.symbol} / {token1Details.symbol}
              </div>
            </div>
            <div className="flex gap-1">
              <Text type="span" className="bg-gray-700 text-white text-xs px-2 py-1 rounded-l ">
                {positionsTableContent.v3}
              </Text>
              <Text type="span" className="bg-gray-700 text-white text-xs px-2 py-1 rounded-r ">
                {fee / 10000}%
              </Text>
            </div>
          </div>

          <div>
            {' '}
            <Text type="p" className="flex items-center gap-1 text-sm">
              <Circle
                className={clsx('w-2 h-2', isInRange ? 'text-green-500' : 'text-red-500')}
                fill={isInRange ? 'currentColor' : 'currentColor'}
              />
              <span className={isInRange ? 'text-green-500' : 'text-red-500'}>
                {isInRange ? positionsTableContent.inRange : positionsTableContent.outOfRange}
              </span>
            </Text>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row bg-black p-4 gap-6">
        {/* Position Details Section */}
        <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 text-white gap-6">
          <div>
            <Text type="p" className="text-sm text-gray-400">
              {positionsTableContent.position}
            </Text>
            <div className="flex gap-2 text-sm mt-4">
              <DynamicLogo
                logoUrl={token0Details.logo}
                alt={token0Details.symbol}
                fallbackText={token0Details.symbol}
                className="rounded-full"
              />
              <Text type="p" className="mt-2 text-sm ">
                {truncateNumber(formatUnits(BigInt(amount0), token0Details.decimals), 4)} {token0Details.symbol}
              </Text>
            </div>
            <div className="flex gap-2 text-sm mt-4">
              <DynamicLogo logoUrl={token1Details.logo} alt={token1Details.symbol} className="rounded-full" />
              <Text type="p" className="text-sm ">
                {truncateNumber(formatUnits(BigInt(amount1), token1Details.decimals), 4)} {token1Details.symbol}
              </Text>
            </div>
          </div>
          <div>
            <Text type="p" className="text-sm text-gray-400">
              {positionsTableContent.fees}
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

          <div>
            <Text type="p" className="text-sm text-gray-400">
              {positionsTableContent.apr}
            </Text>
            <Text type="p">{apr}%</Text>
          </div>
          <div>
            <Text type="p" className="text-sm text-gray-400">
              {positionsTableContent.range}
            </Text>
            {isInFullRange ? (
              <Text type="p" className="text-sm text-gray-400">
                {positionsTableContent.fullRange}
              </Text>
            ) : (
              <div>
                <Text type="p" className="text-sm">
                  MinPrice {truncateNumber(token0ToToken1.minPrice, 4)} {token1Details.symbol} /{token0Details.symbol}
                </Text>
                <Text type="p" className="text-sm">
                  MaxPrice {truncateNumber(token0ToToken1.maxPrice, 4)} {token1Details.symbol} /{token0Details.symbol}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Chart Section */}
        <div className="lg:w-1/4 h-[100px]">
          {priceLoading ? (
            <div className="flex items-center justify-center h-full bg-background rounded-lg">
              <Text type="p" className="text-zinc-400">
                Loading chart...
              </Text>
            </div>
          ) : priceError ? (
            <div className="flex items-center justify-center h-full bg-background rounded-lg">
              <Text type="p" className="text-red-400 text-sm">
                {priceError}
              </Text>
            </div>
          ) : (
            <div className="h-full">
              <MiniPriceChart
                data={priceData?.chartData || []}
                height={100}
                strokeColor="#22c55e"
                loading={priceLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PositionsTable({ positions, loading }: PositionsTableProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div className="relative overflow-hidden rounded-xl bg-black h-64 shimmer" key={i} />
        ))}
      </div>
    );
  }

  if (positions.length === 0) {
    return <NoPositions positions={[]} />;
  }

  return (
    <div className="space-y-4 max-h-[800px] overflow-y-scroll">
      {positions.map((position) => (
        <PositionRow
          key={position.tokenId.toString()}
          position={position}
          onClick={() => router.push(`/positions/${position.tokenId}`)}
        />
      ))}
    </div>
  );
}
