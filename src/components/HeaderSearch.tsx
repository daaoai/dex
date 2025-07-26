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
  onClose?: () => void;
}

interface SearchResult {
  type: 'token' | 'pool';
  data: Token | TopPool;
}

type TabType = 'all' | 'tokens' | 'pools';

export default function HeaderSearch({ className = '', onClose }: HeaderSearchProps) {
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const tokenList = Object.values(tokensByChainId[supportedChainIds.bsc]).filter(
          (token) => token.address !== zeroAddress,
        );
        setTokens(tokenList);
        setPopularTokens(tokenList.slice(0, 3));

        const poolsResponse = await fetch('/api/pools');
        if (poolsResponse.ok) {
          const poolsList = await poolsResponse.json();
          setPools(poolsList);
          setTopPools(poolsList.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to load search data:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const lowerQuery = searchQuery.toLowerCase();

      const tokenResults: SearchResult[] = tokens
        .filter(
          (token) =>
            token.name.toLowerCase().includes(lowerQuery) ||
            token.symbol.toLowerCase().includes(lowerQuery) ||
            token.address.toLowerCase().includes(lowerQuery),
        )
        .slice(0, 5)
        .map((token) => ({ type: 'token' as const, data: token }));

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

    if (searchQuery.trim()) {
      setLoading(true);
    }

    return () => clearTimeout(timeout);
  }, [searchQuery, tokens, pools, activeTab]);

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
      router.push(`/trade?destToken=${token.address}`);
    } else {
      const pool = result.data as TopPool;
      router.push(`/explore/${pool.address}`);
    }

    setIsOpen(false);
    setSearchQuery('');

    // 👇 Close the dialog if provided
    if (typeof onClose === 'function') {
      onClose();
    }
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
    <div
      ref={searchRef}
      className={`relative w-full bg-[#0a0a0a] border border-[#262626] rounded-2xl shadow-xl overflow-hidden z-50 ${className}`}
    >
      {/* Search Input */}
      <div className="relative border-b border-[#262626]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-neutral-500" />
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search tokens and pools"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={handleInputFocus}
          className="w-full bg-transparent text-white placeholder:text-neutral-500 py-3 pl-10 pr-10 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#262626]">
        {(['all', 'tokens', 'pools'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'text-white border-b-2 border-pink-500' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="w-full max-h-80 overflow-y-auto">
          {searchQuery ? (
            loading && results.length === 0 ? (
              <div className="p-4 text-center text-neutral-500">Searching...</div>
            ) : results.length === 0 ? (
              <div className="p-4 text-center text-neutral-500">
                No {activeTab === 'all' ? 'tokens or pools' : activeTab} found for “{searchQuery}”
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1a1a1a] transition-colors text-left"
                  >
                    {result.type === 'token' ? (
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
                          <p className="text-white font-medium truncate">{(result.data as Token).name}</p>
                          <p className="text-sm text-neutral-500">{(result.data as Token).symbol}</p>
                        </div>
                      </>
                    ) : (
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
                          <p className="text-white font-medium truncate">
                            {(result.data as TopPool).token0.symbol}/{(result.data as TopPool).token1.symbol}
                          </p>
                          <p className="text-sm text-neutral-500">{(result.data as TopPool).feeTier}% fee</p>
                        </div>
                      </>
                    )}
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="py-2">
              {(() => {
                const { tokens: previewTokens, pools: previewPools } = getFilteredPreviewContent();

                return (
                  <>
                    {previewTokens.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs text-neutral-500 uppercase font-semibold">
                          Tokens by 24H volume
                        </div>
                        {previewTokens.map((token, index) => (
                          <button
                            key={`popular-token-${index}`}
                            onClick={() => handleResultClick({ type: 'token', data: token })}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1a1a1a] transition-colors text-left"
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
                              <p className="text-white font-medium truncate">{token.name}</p>
                              <p className="text-sm text-neutral-500">
                                {token.symbol} <span className="ml-1">{getEllipsisTxt(token.address)}</span>
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {previewPools.length > 0 && (
                      <div>
                        <div className="px-4 py-2 text-xs text-neutral-500 uppercase font-semibold">Top Pools</div>
                        {previewPools.map((pool, index) => (
                          <button
                            key={`top-pool-${index}`}
                            onClick={() => handleResultClick({ type: 'pool', data: pool })}
                            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#1a1a1a] transition-colors text-left"
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
                              <p className="text-white font-medium truncate">
                                {pool.token0.symbol}/{pool.token1.symbol}
                              </p>
                              <p className="text-sm text-neutral-500">
                                {pool.feeTier}% fee <span className="ml-1">{getEllipsisTxt(pool.address)}</span>
                              </p>
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
