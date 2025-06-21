import { TopPool } from '@/types/pools';
import PoolIcon from '../ui/logo/PoolLogo';
import Link from 'next/link';

interface PoolsTableProps {
  pools: TopPool[];
}

export default function PoolsTable({ pools }: PoolsTableProps) {
  return (
    <div className="overflow-auto rounded-lg bg-gray-800">
      <table className="min-w-full text-left">
        <thead className="border-b border-[#303030]">
          <tr>
            {['#', 'Pool', 'Protocol', 'Fee tier', 'TVL', 'Pool APR', 'Rewards APR', '1D vol', '30D vol'].map((h) => (
              <th key={h} className="px-4 py-2 text-gray-400 bg-dark-black-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pools.map((pool, idx) => (
            <Link key={idx} href={`/explore/${pool.id}`}>
              <tr className="border-b border-none hover:bg-gray-700 bg-dark-black-10 cursor-pointer">
                <td className="px-4 py-2 bg-dark-black-300 text-white">{idx + 1}</td>
                <td className="px-4 py-2 flex items-center text-white space-x-2 bg-dark-black-300">
                  <span className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs">
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
                  <span>
                    {pool.token0.symbol}/{pool.token1.symbol}
                  </span>
                </td>
                <td className="px-4 py-2 text-white">v3</td>
                <td className="px-4 py-2 text-white">{pool.feeTier}</td>
                <td className="px-4 py-2 text-white">{pool.volumeUSD}</td>
                <td className="px-4 py-2 text-white">{0}</td>
                <td className="px-4 py-2  text-dark-purple-10">{0}</td>
                <td className="px-4 py-2 text-white">{0}</td>
                <td className="px-4 py-2 text-white">{0}</td>
              </tr>
            </Link>
          ))}
        </tbody>
      </table>
    </div>
  );
}
