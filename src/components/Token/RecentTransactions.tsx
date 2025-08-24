'use client';

import { ProcessedTransaction } from '@/types/moralis';
import { ExternalLink } from 'lucide-react';
import { MoralisService } from '@/services/moralisService';

type RecentTransactionsProps = {
  transactions: ProcessedTransaction[];
  transactionsLoading: boolean;
  chainId: number;
};

export const RecentTransactions = ({ transactions, transactionsLoading, chainId }: RecentTransactionsProps) => {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <div className="flex space-x-2 text-sm">
          <button className="px-3 py-1 bg-blue-600 text-white rounded">Recent</button>
          <button className="px-3 py-1 text-gray-400 hover:text-white transition-colors">All</button>
          <button className="px-3 py-1 text-gray-400 hover:text-white transition-colors">Analytics</button>
        </div>
      </div>

      {transactionsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-2 text-gray-400">Loading transactions...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                <th className="pb-2">Age</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">USD Value</th>
                <th className="pb-2">Trader</th>
                <th className="pb-2">Tx</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.slice(0, 10).map((tx, index) => (
                  <tr
                    key={`${tx.id}-${index}`}
                    className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="py-3 text-sm text-gray-300">{tx.age}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          tx.type === 'Buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 text-sm font-mono">${tx.price.toFixed(6)}</td>
                    <td className="py-3 text-sm">
                      {tx.tokenAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                      })}{' '}
                      {tx.tokenSymbol}
                    </td>
                    <td className="py-3 text-sm font-semibold">
                      $
                      {tx.usdAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-3 text-sm font-mono text-blue-400">{tx.trader}</td>
                    <td className="py-3">
                      <a
                        href={MoralisService.getExplorerUrl(tx.txHash, chainId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    No recent transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
