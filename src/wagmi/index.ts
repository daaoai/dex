'use client';
import { POLLING_INTERVAL } from '@/constants/app/wagmi';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { mode } from 'wagmi/chains';

// const connectors = connectorsForWallets(
//   [
//     {
//       groupName: 'Recommended',
//       wallets: [metaMaskWallet, trustWallet, frontierWallet, safepalWallet, phantomWallet, okxWallet],
//     },
//   ],
//   { appName: 'Daao.ai', projectId: '762399822f3c6326e60b27c2c2085d52' },
// );

export const getWagmiConfig = () => {
  return createConfig({
    chains: [mode],
    storage: createStorage({
      storage: cookieStorage,
    }),
    pollingInterval: POLLING_INTERVAL.ms1500,
    syncConnectedChain: true,
    transports: { [mode.id]: http() },
    ssr: true,
    // connectors,
  });
};
