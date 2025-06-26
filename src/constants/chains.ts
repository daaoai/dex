import { zeroAddress } from 'viem';
import * as viemChains from 'viem/chains';
import { ChainsConfig } from '../types/chains';

export const supportedChainIds = {
  monadTestnet: 10143,
  bsc: 56,
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
  [supportedChainIds.monadTestnet]: {
    slug: 'monad-testnet',
    name: 'Monad Testnet',
    rpcUrls: ['https://testnet-rpc.monad.xyz', 'https://monad-testnet.drpc.org'],
    blockExplorer: 'https://testnet.monadexplorer.com',
    networkType: 'testnet',
    logo: 'https://tokens.pancakeswap.finance/images/monad-testnet/0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701.png',
    wnativeToken: {
      address: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
      decimals: 18,
      symbol: 'WMON',
      name: 'Wrapped Monad',
    },
    nativeCurrency: {
      address: zeroAddress,
      name: 'Testnet MON Token',
      symbol: 'MON',
      decimals: 18,
    },
    geckoId: 'monad-testnet',
  },

  [supportedChainIds.bsc]: {
    slug: 'bsc',
    name: 'BNB Smart Chain',
    rpcUrls: ['https://bsc-dataseed1.binance.org', 'https://bsc.publicnode.com'],
    blockExplorer: 'https://bscscan.com',
    networkType: 'mainnet',
    logo: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
    wnativeToken: {
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped BNB',
    },
    nativeCurrency: {
      address: zeroAddress,
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    geckoId: 'binancecoin',
  },
};

export const chainIdToChainSlugMap: {
  [key: number]: string;
} = Object.fromEntries(Object.entries(chainsData).map(([key, value]) => [Number(key), value.slug]));

export const chainSlugToChainIdMap: {
  [key: string]: number;
} = Object.fromEntries(Object.entries(chainsData).map(([key, value]) => [value.slug, Number(key)]));
