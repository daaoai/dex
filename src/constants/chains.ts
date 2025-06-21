import { zeroAddress } from 'viem';
import * as viemChains from 'viem/chains';
import { ChainsConfig } from '../types/chains';

// const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY || 'eF4hCbU9Y8g1Mi_wXfz1zLaIKGLz5-V1';

export const supportedChainIds = {
  bsc: 56,
  // mode: 34443,
  // monad: 10143,
  // bera: 80094,

  // testnets
  // bsc: 10143,
};

export const viemChainsById: Record<number, viemChains.Chain> = Object.values(viemChains).reduce((acc, chainData) => {
  return chainData.id
    ? {
        ...acc,
        [chainData.id]: chainData,
      }
    : acc;
}, {});

export const chainsData: {
  [key: number]: ChainsConfig;
} = {
  // [supportedChainIds.monadTestnet]: {
  //   slug: 'monad-testnet',
  //   name: 'Monad Testnet',
  //   rpcUrls: ['https://testnet-rpc.monad.xyz', 'https://monad-testnet.drpc.org'],
  //   blockExplorer: 'https://testnet.monadexplorer.com',
  //   networkType: 'testnet',
  //   logo: 'https://tokens.pancakeswap.finance/images/monad-testnet/0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701.png',
  //   wnativeToken: {
  //     address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
  //     decimals: 18,
  //     symbol: 'WMON',
  //     name: 'Wrapped Monad',
  //   },
  //   nativeCurrency: {
  //     address: zeroAddress,
  //     name: 'Testnet MON Token',
  //     symbol: 'MON',
  //     decimals: 18,
  //   },
  //   geckoId: 'monad-testnet',
  // },
  [supportedChainIds.bsc]: {
    slug: 'bsc',
    name: 'Binance Smart Chain',
    rpcUrls: ['https://binance.llamarpc.com', 'wss://bsc-rpc.publicnode.com'],
    blockExplorer: 'https://bscscan.com',
    networkType: 'mainnet',
    logo: 'https://icons.llamao.fi/icons/chains/rsz_binance.jpg',
    wnativeToken: {
      address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped BNB',
    },
    nativeCurrency: {
      address: zeroAddress,
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    geckoId: 'binance-smart-chain',
  },
};

export const chainIdToChainSlugMap: {
  [key: number]: string;
} = Object.fromEntries(Object.entries(chainsData).map(([key, value]) => [Number(key), value.slug]));

export const chainSlugToChainIdMap: {
  [key: string]: number;
} = Object.fromEntries(Object.entries(chainsData).map(([key, value]) => [value.slug, Number(key)]));
