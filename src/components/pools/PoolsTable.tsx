'use client';
import { TopPool } from '@/types/pools';
import PoolIcon from '../ui/logo/PoolLogo';
import { useRouter } from 'next/navigation';

interface PoolsTableProps {
  pools: TopPool[];
}

export default function PoolsTable({ pools }: PoolsTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-auto">
      <table className="min-w-full text-left border border-gray-700">
        <thead className="border-b">
          <tr>
            {['#', 'Pool', 'Protocol', 'Fee tier', 'TVL', 'Pool APR', 'Rewards APR', '1D vol', '30D vol'].map((h) => (
              <th key={h} className={`px-4 py-2 text-gray-400 bg-background-8 border-b border-gray-700 `}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pools.map((pool) => (
            <tr
              key={pool.id}
              className="border-b border-gray-700 hover:bg-background-19 bg-black cursor-pointer transition-colors"
              onClick={() => router.push(`/explore/${pool.id}`)}
            >
              <td className="px-4 py-5 text-white">{'#'}</td>
              <td className="px-4 py-5 flex items-center text-white space-x-2 border-r border-gray-700">
                <span className="flex items-center justify-center text-xs">
                  <PoolIcon
                    token0={{
                      symbol: pool.token0.symbol,
                    }}
                    token1={{
                      symbol: pool.token1.symbol,
                    }}
                    className="h-6 w-6"
                  />
                </span>
                <span className="pl-4">
                  {pool.token0.symbol}/{pool.token1.symbol}
                </span>
              </td>
              <td className="px-4 py-5 text-white ">v3</td>
              <td className="px-4 py-5 text-white">{pool.feeTier}</td>
              <td className="px-4 py-5 text-white">{pool.volumeUSD}</td>
              <td className="px-4 py-5 text-white">{0}</td>
              <td className="px-4 py-5 text-white">{0}</td>
              <td className="px-4 py-5 text-white">{0}</td>
              <td className="px-4 py-5 text-white">{0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
