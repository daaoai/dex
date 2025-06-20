import TradeClient from '@/components/swap/TradeClient';
import { supportedChainIds } from '@/constants/chains';
import { getTokenDetails } from '@/helper/token';
import { Token } from '@/types/tokens';
import { isAddress } from 'viem';

interface PageProps {
  searchParams: Promise<{
    srcToken?: string;
    destToken?: string;
  }>;
}

export default async function TradePage({ searchParams }: PageProps) {
  // Await the searchParams
  const params = await searchParams;

  const { srcToken, destToken } = params;

  // Determine chain ID (default to BSC)
  const chainId = supportedChainIds.bsc;

  // Initialize tokens
  let initialSrcToken: Token | null = null;
  let initialDestToken: Token | null = null;

  if (srcToken && isAddress(srcToken)) {
    initialSrcToken = await getTokenDetails({ address: srcToken, chainId });
  }

  // Resolve token1
  if (destToken && isAddress(destToken)) {
    initialDestToken = await getTokenDetails({ address: destToken, chainId });
  }

  return <TradeClient initialSrcToken={initialSrcToken} initialDestToken={initialDestToken} />;
}
