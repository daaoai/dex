import { supportedChainIds } from '@/constants/chains';
import useRemoveLiquidity from '@/hooks/useRemoveLiquidity';
import { V3Position } from '@/types/v3';
import { truncateNumber } from '@/utils/truncateNumber';

interface PositionsTableProps {
  positions: V3Position[];
  loading: boolean;
}

export default function PositionsTable({ positions, loading }: PositionsTableProps) {
  const { decreaseLiquidity } = useRemoveLiquidity({ chainId: supportedChainIds.monadTestnet });
  if (loading) {
    return (
      <div className="overflow-auto rounded-lg bg-gray-800 p-4">
        <p className="text-white">Loading positions...</p>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="overflow-auto rounded-lg bg-gray-800 p-4">
        <p className="text-white">No positions found</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg bg-gray-800">
      <table className="min-w-full text-left">
        <thead className="border-b border-gray-700">
          <tr>
            {['ID', 'Token Pair', 'Fee Tier', 'Tick Range', 'Liquidity', 'Fees Earned'].map((h) => (
              <th key={h} className="px-4 py-2 text-gray-400 bg-dark-black-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr
              key={position.tokenId.toString()}
              className="border-b border-gray-700 hover:bg-gray-700 bg-dark-black-10"
            >
              <td className="px-4 py-2 bg-dark-black-300 text-white">#{position.tokenId.toString()}</td>
              <td className="px-4 py-2 flex items-center text-white space-x-2 bg-dark-black-300">
                {`${position.token0Details.symbol}-${position.token1Details.symbol}`}
              </td>
              <td className="px-4 py-2 text-white">{position.fee / 10000}%</td>
              <td className="px-4 py-2 text-white">{`${position.tickLower} - ${position.tickUpper}`}</td>
              <td className="px-4 py-2 text-white">{truncateNumber(position.liquidity.toString())}</td>
              <td className="px-4 py-2 text-white">
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                  onClick={() =>
                    decreaseLiquidity({
                      position,
                      percent: 50, // Example: Decrease by 50%
                    })
                  }
                >
                  Decrease Liquidity
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
