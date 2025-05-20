import { chainsData, viemChainsById } from '@/constants/chains';
import { createPublicClient, fallback, http, PublicClient } from 'viem';

export const getPublicClient = (chainId: number): PublicClient => {
  const rpcs = chainsData[chainId]?.rpcUrls || [];
  return createPublicClient({
    transport: rpcs.length ? fallback(rpcs.map((rpc) => http(rpc, { batch: { wait: 100 }, retryDelay: 400 }))) : http(),
    chain: viemChainsById[chainId],
  });
};
