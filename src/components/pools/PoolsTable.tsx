'use client';

import { TopPool } from '@/types/pools';
import PoolIcon from '../ui/logo/PoolLogo';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface PoolsTableProps {
  pools: TopPool[];
}

export default function PoolsTable({ pools }: PoolsTableProps) {
  const router = useRouter();

  const headers = ['#', 'Pool', 'Protocol', 'Fee tier', 'TVL', 'Pool APR', 'Rewards APR', '1D vol', '30D vol'];

  return (
    <div className="overflow-auto rounded-xl border border-gray-800 shadow-inner shadow-black/20">
      <table className="min-w-full text-sm text-left text-white">
        <thead>
          <tr className="bg-background-8 text-gray-400 text-xs uppercase tracking-wider">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 border-b border-gray-800 whitespace-nowrap">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pools.map((pool, index) => (
            <motion.tr
              key={pool.address}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="cursor-pointer border-b border-gray-800 hover:bg-gray-800/40 transition-colors duration-200 group"
              onClick={() => router.push(`/explore/${pool.address}`)}
            >
              <td className="px-4 py-4 font-medium text-white">#</td>
              <td className="px-4 py-4 flex items-center space-x-3">
                <PoolIcon
                  token0={{
                    symbol: pool.token0.symbol,
                    logo: pool.token0.logo,
                  }}
                  token1={{
                    symbol: pool.token1.symbol,
                    logo: pool.token1.logo,
                  }}
                  className="h-6 w-6 transition-transform group-hover:scale-105"
                />
                <span className="pl-2 font-semibold">
                  {pool.token0.symbol}/{pool.token1.symbol}
                </span>
              </td>
              {/* Vertical line before this column */}
              <td className="px-4 py-4 text-gray-300 border-l border-gray-800">v3</td>
              <td className="px-4 py-4 text-gray-300">{pool.feeTier}</td>
              <td className="px-4 py-4 text-gray-300">{pool.volumeUSD}</td>
              <td className="px-4 py-4 text-gray-300">{0}</td>
              <td className="px-4 py-4 text-[#FF6961]">{0}</td>
              <td className="px-4 py-4 text-white">{0}</td>
              <td className="px-4 py-4 text-white">{0}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
