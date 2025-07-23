'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { isAddress } from 'viem';
import SwapModal from '../../components/swap/SwapModal';
import { Token } from '@/types/tokens';
import { getTokenDetails } from '@/helper/token';
import { supportedChainIds } from '@/constants/chains';

const TradeClient = () => {
  const searchParams = useSearchParams();
  const [srcToken, setSrcToken] = useState<Token | null>(null);
  const [destToken, setDestToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateTokensFromParams = async () => {
      setLoading(true);
      const srcTokenParam = searchParams.get('srcToken');
      const destTokenParam = searchParams.get('destToken');
      const chainId = supportedChainIds.bsc;

      let newSrcToken: Token | null = null;
      let newDestToken: Token | null = null;

      // Update source token if it exists in URL and is different from current
      if (srcTokenParam && isAddress(srcTokenParam)) {
        if (!srcToken || srcToken.address !== srcTokenParam) {
          try {
            newSrcToken = await getTokenDetails({ address: srcTokenParam, chainId });
          } catch (error) {
            console.error('Failed to fetch source token details:', error);
          }
        } else {
          newSrcToken = srcToken;
        }
      }

      // Update destination token if it exists in URL and is different from current
      if (destTokenParam && isAddress(destTokenParam)) {
        if (!destToken || destToken.address !== destTokenParam) {
          try {
            newDestToken = await getTokenDetails({ address: destTokenParam, chainId });
          } catch (error) {
            console.error('Failed to fetch destination token details:', error);
          }
        } else {
          newDestToken = destToken;
        }
      }

      // Only update state if tokens actually changed
      if (newSrcToken && newSrcToken.address !== srcToken?.address) {
        setSrcToken(newSrcToken);
      }
      if (newDestToken && newDestToken.address !== destToken?.address) {
        setDestToken(newDestToken);
      }

      // Clear tokens if they're not in URL anymore
      if (!srcTokenParam && srcToken) {
        setSrcToken(null);
      }
      if (!destTokenParam && destToken) {
        setDestToken(null);
      }

      setLoading(false);
    };

    updateTokensFromParams();
  }, [searchParams, srcToken?.address, destToken?.address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 bg-black bg-cover bg-center">
      <SwapModal initialSrcToken={srcToken} initialDestToken={destToken} />
    </main>
  );
};

export default TradeClient;
