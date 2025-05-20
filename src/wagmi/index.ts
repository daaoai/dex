'use client';
import { POLLING_INTERVAL } from '@/constants/app/wagmi';
import { supportedChainIds, viemChainsById } from '@/constants/chains';
import { Transport } from 'viem';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: 'Recommended',
//       wallets: [metaMaskWallet, trustWallet, frontierWallet, safepalWallet, phantomWallet, okxWallet],
//     },
//   ],
//   { appName: 'Daao.ai', projectId: '762399822f3c6326e60b27c2c2085d52' },
// );

const supportedChains = Object.values(supportedChainIds).map((chainId) => {
  return viemChainsById[chainId];
});

export const getWagmiConfig = () => {
  return createConfig({
    chains: [supportedChains[0], ...supportedChains.slice(1)],
    storage: createStorage({
      storage: cookieStorage,
    }),
    pollingInterval: POLLING_INTERVAL.ms1500,
    syncConnectedChain: true,
    transports: supportedChains.reduce(
      (acc, chain) => {
        acc[chain.id] = http();
        return acc;
      },
      {} as Record<number, Transport>,
    ),
    ssr: true,
    // connectors,
  });
};
