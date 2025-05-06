'use client';
import { POLLING_INTERVAL } from '@/constants/app/wagmi';
import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { mode } from 'wagmi/chains';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  frontierWallet,
  metaMaskWallet,
  okxWallet,
  phantomWallet,
  safepalWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [
        metaMaskWallet,
        walletConnectWallet,
        trustWallet,
        frontierWallet,
        safepalWallet,
        phantomWallet,
        okxWallet,
      ],
    },
  ],
  { appName: 'Daao.ai', projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '' },
);

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
    connectors,
  });
};
