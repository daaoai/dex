import { TokenDetailsClient } from '@/components/Token/TokenDetails';
import { getTokenDetails } from '@/helper/token';
import { CoinGeckoService } from '@/services/coinGeckoService';
import { Hex } from 'viem';
import { supportedChainIds } from '../../../constants/chains';

type TokenPageParams = {
  address: string;
};
export default async function TokenPage({ params }: { params: TokenPageParams }) {
  const address = params?.address as Hex;
  const chainId = supportedChainIds.bsc;

  const [tokenRes, coingeckoIdRes] = await Promise.allSettled([
    getTokenDetails({
      address,
      chainId,
    }),
    CoinGeckoService.getCoingeckoIdByAddress(address, chainId),
  ]);

  if (tokenRes.status === 'rejected' || !tokenRes.value) {
    return <div className="text-red-500">Token not found</div>;
  }

  const token = tokenRes.value;
  const coingeckoId = coingeckoIdRes.status === 'fulfilled' ? coingeckoIdRes.value || undefined : undefined;

  return <TokenDetailsClient chainId={chainId} token={{ ...token, coingeckoId }} />;
}
