'use client';

import { chainsData } from '@/constants/chains';
import { CoinGeckoService } from '@/services/coinGeckoService';
import { DexScreenerService } from '@/services/dexScreenerService';
import { MoralisService } from '@/services/moralisService';
import { CoingeckoTokenDetailedInfo } from '@/types/coinGecko';
import { DexScreenerToken } from '@/types/dexScreener';
import { ProcessedTransaction } from '@/types/moralis';
import { Token } from '@/types/tokens';
import { useEffect, useState } from 'react';
import { BackButton } from './BackButton';
import { TokenOverview } from './TokenOverview';
import { FinancialData } from './FinancialData';
import { TradingData } from './TradingData';
import { Sentiment } from './Sentiment';
import { ChartSection } from './ChartSection';
import { TradingInterface } from './TradingInterface';
import { RecentTransactions } from './RecentTransactions';

type TokenPageProps = {
  chainId: number;
  token: Token & { coingeckoId?: string | null };
};

export const TokenPage = ({ token, chainId }: TokenPageProps) => {
  const [coingeckoTokenDetails, setCoingeckoTokenDetails] = useState<CoingeckoTokenDetailedInfo | null>(null);
  const [dexScreenerTokenDetails, setDexScreenerTokenDetails] = useState<DexScreenerToken | null>(null);
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  const chainData = chainsData[chainId];
  const dexScreenerId = chainData?.dexScreenerId;

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Fetch data from multiple sources in parallel
        const [coingeckoData, dexData, moralisData] = await Promise.allSettled([
          token.coingeckoId ? CoinGeckoService.getDetailedTokenInfo(token.coingeckoId) : null,
          DexScreenerService.getPrimaryPair(token.address, chainId),
          MoralisService.getSwapTransactions(token.address, chainId, 20),
        ]);

        if (coingeckoData.status === 'fulfilled' && coingeckoData.value) {
          setCoingeckoTokenDetails(coingeckoData.value);
        }

        if (dexData.status === 'fulfilled' && dexData.value) {
          setDexScreenerTokenDetails(dexData.value);
        }

        if (moralisData.status === 'fulfilled' && moralisData.value) {
          const processedTransactions = MoralisService.processTransactions(moralisData.value.result, token.address);
          setTransactions(processedTransactions);
        }
      } catch (error) {
        console.error('Failed to fetch token data:', error);
      } finally {
        setLoading(false);
        setTransactionsLoading(false);
      }
    };

    fetchTokenData();
  }, [token.coingeckoId, token.address, chainId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading token data...</p>
        </div>
      </div>
    );
  }

  if (!coingeckoTokenDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Token Data Unavailable</h1>
          <p className="text-gray-400">Unable to load token details. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto px-4 py-6">
        <BackButton />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Token Information */}
          <div className="space-y-6">
            <TokenOverview token={token} coingeckoTokenDetails={coingeckoTokenDetails} />
            <FinancialData
              coingeckoTokenDetails={coingeckoTokenDetails}
              dexScreenerTokenDetails={dexScreenerTokenDetails}
            />
            <TradingData dexScreenerTokenDetails={dexScreenerTokenDetails} />
            <Sentiment coingeckoTokenDetails={coingeckoTokenDetails} />
          </div>

          {/* Right Column - Trading Interface */}
          <div className="xl:col-span-2 space-y-6">
            <ChartSection
              token={token}
              coingeckoTokenDetails={coingeckoTokenDetails}
              dexScreenerTokenDetails={dexScreenerTokenDetails}
              dexScreenerId={dexScreenerId}
            />
            <TradingInterface
              token={token}
              coingeckoTokenDetails={coingeckoTokenDetails}
              dexScreenerTokenDetails={dexScreenerTokenDetails}
            />
            <RecentTransactions
              transactions={transactions}
              transactionsLoading={transactionsLoading}
              chainId={chainId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
