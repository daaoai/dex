import { TokenPage } from '@/components/Token/TokenPage';
import { getTokenDetails } from '@/helper/token';
import { CoinGeckoService } from '@/services/coinGeckoService';
import { Hex } from 'viem';
import { supportedChainIds } from '../../../constants/chains';

type TokenPageParams = {
  address: Hex;
};

export default async function TokenDetailPage({ params }: { params: Promise<TokenPageParams> }) {
  const { address } = await params;
  const chainId = supportedChainIds.bsc;

  const [tokenRes, coingeckoIdRes] = await Promise.allSettled([
    getTokenDetails({
      address,
      chainId,
    }),
    CoinGeckoService.getCoingeckoIdByAddress(address, chainId),
  ]);

  if (tokenRes.status === 'rejected' || !tokenRes.value) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Token Not Found</h1>
          <p className="text-gray-400">The requested token could not be found or loaded.</p>
        </div>
      </div>
    );
  }

  const token = tokenRes.value;
  const coingeckoId = coingeckoIdRes.status === 'fulfilled' ? coingeckoIdRes.value || undefined : undefined;

  return <TokenPage chainId={chainId} token={{ ...token, coingeckoId }} />;
}
