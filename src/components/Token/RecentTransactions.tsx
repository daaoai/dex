'use client';

import { ProcessedTransaction } from '@/types/moralis';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { MoralisService } from '@/services/moralisService';
import { useState } from 'react';

type RecentTransactionsProps = {
  transactions: ProcessedTransaction[];
  transactionsLoading: boolean;
  chainId: number;
};

export const RecentTransactions = ({ transactions, transactionsLoading, chainId }: RecentTransactionsProps) => {
  const [activeTab, setActiveTab] = useState('Transactions');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const tabs = [
    { id: 'Transactions', label: 'Transactions' },
    { id: 'Holders', label: 'Holders' },
    { id: 'History', label: 'History' },
    { id: 'Orders', label: 'Orders' },
  ];

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ChevronUp className="w-3 h-3 opacity-50" />;
    return sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const formatTokenAmount = (amount: number, symbol: string) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ${symbol}`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${symbol}`;
    } else {
      return `${amount.toFixed(2)} ${symbol}`;
    }
  };

  const formatVolume = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount.toFixed(2)}`;
    }
  };

  const formatPrice = (price: number) => {
    if (price < 0.0001) {
      return `$${price.toFixed(8)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };

  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  return (
    <div className="bg-[#0B0E11] rounded-xl p-6">
      {/* Tab Navigation */}
      <div className="flex space-x-6 mb-6 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {transactionsLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-2 text-gray-400">Loading transactions...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm">
                <th className="pb-3">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    Date/Age {getSortIcon('date')}
                  </button>
                </th>
                <th className="pb-3">Type</th>
                <th className="pb-3">
                  <button
                    onClick={() => handleSort('price')}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    Price {getSortIcon('price')}
                  </button>
                </th>
                <th className="pb-3">
                  <button
                    onClick={() => handleSort('volume')}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    Volume {getSortIcon('volume')}
                  </button>
                </th>
                <th className="pb-3">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    Token Amt {getSortIcon('amount')}
                  </button>
                </th>
                <th className="pb-3">
                  <button
                    onClick={() => handleSort('trader')}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    Trader {getSortIcon('trader')}
                  </button>
                </th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.slice(0, 10).map((tx, index) => {
                  const isBuy = tx.type === 'Buy';
                  const rowColor = isBuy ? 'text-green-500' : 'text-red-500';

                  return (
                    <tr key={`${tx.id}-${index}`} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-3 text-sm text-gray-300">{tx.age}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isBuy ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>
                      <td className={`py-3 text-sm font-semibold ${rowColor}`}>{formatPrice(tx.price)}</td>
                      <td className={`py-3 text-sm font-semibold ${rowColor}`}>{formatVolume(tx.usdAmount)}</td>
                      <td className={`py-3 text-sm font-semibold ${rowColor}`}>
                        {formatTokenAmount(tx.tokenAmount, tx.tokenSymbol)}
                      </td>
                      <td className="py-3 text-sm text-white">{truncateAddress(tx.trader)}</td>
                      <td className="py-3">
                        <a
                          href={MoralisService.getExplorerUrl(tx.txHash, chainId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
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
