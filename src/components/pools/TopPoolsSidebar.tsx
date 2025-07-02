import { TopPool } from '@/types/pools';
import Link from 'next/link';
import PoolIcon from '../ui/logo/PoolLogo';
import Text from '../ui/Text';

function ShimmerTopPools() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-grey-3 rounded-2xl px-4 py-3 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full" />
            <div>
              <div className="w-24 h-4 bg-gray-700 rounded mb-2" />
              <div className="flex gap-2">
                <div className="w-8 h-3 bg-gray-800 rounded" />
                <div className="w-8 h-3 bg-gray-800 rounded" />
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-4 bg-gray-700 rounded mb-2" />
            <div className="flex gap-2 justify-end">
              <div className="w-10 h-3 bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TopPoolsSidebar({ topPools, loading }: { topPools: TopPool[]; loading: boolean }) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Text type="h3" className="text-lg font-semibold text-white">
        Top 3 Pools by TVL
      </Text>

      {loading ? (
        <ShimmerTopPools />
      ) : (
        topPools.map((p) => (
          <Link
            href={`/explore/${p.address}`}
            key={p.address}
            className="bg-grey-3 rounded-2xl px-4 py-3 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <PoolIcon token0={p.token0} token1={p.token1} />
              <div>
                <Text type="p" className="font-semibold text-white">
                  {`${p.token0.symbol} / ${p.token1.symbol}`}
                </Text>
                <div className="flex items-center text-xs text-gray-300 gap-2">
                  <Text type="p" className="bg-[#1f1f1f] px-2 py-0.5 rounded-md">
                    v3
                  </Text>
                  <Text type="p" className="bg-[#1f1f1f] px-2 py-0.5 rounded-md">
                    {p.feeTier}%
                  </Text>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Text type="p" className="text-white">
                $ {p.volumeUSD} TVL
              </Text>
              <div className="flex items-center justify-end gap-2">
                {/* <div className="text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md px-2 py-1 flex items-center gap-1 font-semibold"> */}
                {/* {p.rewards} */}
                {/* <FaUniswap size={16} /> */}
                {/* </div> */}
              </div>
            </div>
          </Link>
        ))
      )}
      {/* 
      <Button variant="link" className="text-white text-start px-0">
        Explore more pools →
      </Button> */}
    </div>
  );
}
