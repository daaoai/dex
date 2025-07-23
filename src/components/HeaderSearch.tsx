'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Token } from '@/types/tokens';
import { TopPool } from '@/types/pools';
import { supportedChainIds } from '@/constants/chains';
import { tokensByChainId } from '@/constants/tokens';
import DynamicLogo from './ui/logo/DynamicLogo';
import PoolIcon from './ui/logo/PoolLogo';
import { getEllipsisTxt } from '@/utils/getEllipsisText';
import { zeroAddress } from 'viem';

interface HeaderSearchProps {
  className?: string;
}

interface SearchResult {
  type: 'token' | 'pool';
  data: Token | TopPool;
}

type TabType = 'all' | 'tokens' | 'pools';

export default function HeaderSearch({ className = '' }: HeaderSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<TopPool[]>([]);
  const [popularTokens, setPopularTokens] = useState<Token[]>([]);
  const [topPools, setTopPools] = useState<TopPool[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load tokens and pools on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load tokens
        const tokenList = Object.values(tokensByChainId[supportedChainIds.bsc]).filter(
          (token) => token.address !== zeroAddress,
        );
        setTokens(tokenList);

        // Set popular tokens (first 3 as examples)
        setPopularTokens(tokenList.slice(0, 3));

        // Load pools
        const poolsResponse = await fetch('/api/pools');
        if (poolsResponse.ok) {
          const poolsList = await poolsResponse.json();
          setPools(poolsList);

          // Set top pools (first 3)
          setTopPools(poolsList.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load search data:', error);
      }
    };

    loadData();
  }, []);

  // Handle search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const lowerQuery = searchQuery.toLowerCase();

      // Search tokens
      const tokenResults: SearchResult[] = tokens
        .filter(
          (token) =>
            token.name.toLowerCase().includes(lowerQuery) ||
            token.symbol.toLowerCase().includes(lowerQuery) ||
            token.address.toLowerCase().includes(lowerQuery),
        )
        .slice(0, 5)
        .map((token) => ({ type: 'token' as const, data: token }));

      // Search pools
      const poolResults: SearchResult[] = pools
        .filter(
          (pool) =>
            pool.token0.symbol.toLowerCase().includes(lowerQuery) ||
            pool.token1.symbol.toLowerCase().includes(lowerQuery) ||
            `${pool.token0.symbol}/${pool.token1.symbol}`.toLowerCase().includes(lowerQuery) ||
            pool.address.toLowerCase().includes(lowerQuery),
        )
        .slice(0, 5)
        .map((pool) => ({ type: 'pool' as const, data: pool }));

      // Filter results based on active tab
      let filteredResults: SearchResult[] = [];
      if (activeTab === 'all') {
        filteredResults = [...tokenResults, ...poolResults].slice(0, 8);
      } else if (activeTab === 'tokens') {
        filteredResults = tokenResults;
      } else if (activeTab === 'pools') {
        filteredResults = poolResults;
      }

      setResults(filteredResults);
      setLoading(false);
    }, 300);

    // Set loading immediately when user starts typing
    if (searchQuery.trim()) {
      setLoading(true);
    }

    return () => clearTimeout(timeout);
  }, [searchQuery, tokens, pools, activeTab]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'token') {
      const token = result.data as Token;
      // Navigate to swap page with token as destination
      router.push(`/trade?destToken=${token.address}`);
    } else {
      const pool = result.data as TopPool;
      // Navigate to pool details page
      router.push(`/explore/${pool.address}`);
    }

    setIsOpen(false);
    setSearchQuery('');
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
    setActiveTab('all');
    inputRef.current?.focus();
  };

  const getFilteredPreviewContent = () => {
    if (activeTab === 'tokens') {
      return { tokens: popularTokens, pools: [] };
    } else if (activeTab === 'pools') {
      return { tokens: [], pools: topPools };
    } else {
      return { tokens: popularTokens, pools: topPools };
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tokens or pools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          className="w-full bg-gray-800 text-white rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:bg-gray-750 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto z-50">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {(['all', 'tokens', 'pools'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-white bg-gray-700 border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white hover:bg-gray-750'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {searchQuery ? (
            // Show search results when typing
            loading && results.length === 0 ? (
              // Show only loading spinner
              <div className="p-4 text-center text-gray-400">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span className="ml-2">Searching...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No {activeTab === 'all' ? 'tokens or pools' : activeTab} found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors text-left"
                  >
                    {result.type === 'token' ? (
                      // Token Result
                      <>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                          <DynamicLogo
                            logoUrl={(result.data as Token).logo}
                            alt={(result.data as Token).symbol}
                            width={32}
                            height={32}
                            fallbackText={(result.data as Token).symbol}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Token</span>
                            <p className="font-medium text-white truncate">{(result.data as Token).name}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-400">{(result.data as Token).symbol}</p>
                            <p className="text-xs text-gray-500">{getEllipsisTxt((result.data as Token).address)}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Pool Result
                      <>
                        <div className="w-8 h-8">
                          <PoolIcon
                            token0={{
                              symbol: (result.data as TopPool).token0.symbol,
                              logo: (result.data as TopPool).token0.logo,
                            }}
                            token1={{
                              symbol: (result.data as TopPool).token1.symbol,
                              logo: (result.data as TopPool).token1.logo,
                            }}
                            className="h-8 w-8"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">Pool</span>
                            <p className="font-medium text-white truncate">
                              {(result.data as TopPool).token0.symbol}/{(result.data as TopPool).token1.symbol}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-400">{(result.data as TopPool).feeTier}% fee</p>
                            <p className="text-xs text-gray-500">{getEllipsisTxt((result.data as TopPool).address)}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            )
          ) : (
            // Show preview when no search query
            <div className="py-2">
              {(() => {
                const { tokens: previewTokens, pools: previewPools } = getFilteredPreviewContent();

                return (
                  <>
                    {/* Popular Tokens Section */}
                    {previewTokens.length > 0 && (
                      <div className="mb-2">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
                          Popular Tokens
                        </div>
                        {previewTokens.map((token, index) => (
                          <button
                            key={`popular-token-${index}`}
                            onClick={() => handleResultClick({ type: 'token', data: token })}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors text-left"
                          >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                              <DynamicLogo
                                logoUrl={token.logo}
                                alt={token.symbol}
                                width={32}
                                height={32}
                                fallbackText={token.symbol}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Token</span>
                                <p className="font-medium text-white truncate">{token.name}</p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-gray-400">{token.symbol}</p>
                                <p className="text-xs text-gray-500">{getEllipsisTxt(token.address)}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Top Pools Section */}
                    {previewPools.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700">
                          Top Pools
                        </div>
                        {previewPools.map((pool, index) => (
                          <button
                            key={`top-pool-${index}`}
                            onClick={() => handleResultClick({ type: 'pool', data: pool })}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-700 transition-colors text-left"
                          >
                            <div className="w-8 h-8">
                              <PoolIcon
                                token0={{
                                  symbol: pool.token0.symbol,
                                  logo: pool.token0.logo,
                                }}
                                token1={{
                                  symbol: pool.token1.symbol,
                                  logo: pool.token1.logo,
                                }}
                                className="h-8 w-8"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">Pool</span>
                                <p className="font-medium text-white truncate">
                                  {pool.token0.symbol}/{pool.token1.symbol}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-gray-400">{pool.feeTier}% fee</p>
                                <p className="text-xs text-gray-500">{getEllipsisTxt(pool.address)}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* No data message */}
                    {previewTokens.length === 0 && previewPools.length === 0 && (
                      <div className="p-4 text-center text-gray-400">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="ml-2">Loading...</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
