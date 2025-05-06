import { zeroAddress } from 'viem';
import * as viemChains from 'viem/chains';
import { ChainsConfig } from '../types/chains';

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY || 'eF4hCbU9Y8g1Mi_wXfz1zLaIKGLz5-V1';

export const supportedChainIds = {
  bsc: 56,
  mode: 34443,
  monad: 10143,
  bera: 80094,
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
  [supportedChainIds.monad]: {
    slug: 'monad',
    name: 'Monad Testnet',
    rpcUrls: [
      `https://monad-testnet.g.alchemy.com/v2/${alchemyKey}`,
      'https://testnet-rpc.monad.xyz',
      'https://monad-testnet.drpc.org',
    ],
    blockExplorer: 'https://modescan.io',
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
    name: 'Binance Smart Chain',
    rpcUrls: [
      `https://bnb-mainnet.g.alchemy.com/v2/${alchemyKey}`,
      'https://binance.llamarpc.com',
      'https://bsc-mainnet.public.blastapi.io',
    ],
    blockExplorer: 'bscscan.com',
    networkType: 'mainnet',
    logo: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/bsc.svg',
    wnativeToken: {
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped BNB',
    },
    nativeCurrency: {
      address: zeroAddress,
      name: 'BNB Token',
      symbol: 'BNB',
      decimals: 18,
    },
    geckoId: 'bsc',
    dexScreenerId: 'bsc',
  },
  [supportedChainIds.mode]: {
    slug: 'mode',
    name: 'Mode',
    rpcUrls: ['https://mainnet.mode.network', 'https://1rpc.io/mode', 'https://mode.drpc.org'],
    blockExplorer: 'testnet.modefi.com',
    networkType: 'mainnet',
    wnativeToken: {
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      symbol: 'WETH',
      name: 'Wrapped Ether',
    },
    nativeCurrency: {
      address: zeroAddress,
      name: 'Testnet MODE Token',
      symbol: 'MODE',
      decimals: 18,
    },
    geckoId: 'mode',
    dexScreenerId: 'mode',
    logo: 'https://imgproxy-mainnet.routescan.io/4TiM8ysk8JCazvM9Ggn9ketf6l_UK9WTFTbE6SAHNLI/pr:thumb_32/aHR0cHM6Ly9jbXMtY2RuLmF2YXNjYW4uY29tL2NtczIvMzQ0NDNfbG9nby4yODU3YTI0NzdkNTQuc3Zn',
  },

  [supportedChainIds.bera]: {
    slug: 'bera',
    name: 'Bera',
    rpcUrls: [
      `https://berachain-mainnet.g.alchemy.com/v2/${alchemyKey}`,
      'https://rpc.berachain.com',
      'https://berachain.blockpi.network/v1/rpc/public',
      'https://berachain-rpc.publicnode.com',
    ],
    blockExplorer: 'https://berascan.com',
    networkType: 'mainnet',
    logo: 'https://www.berachain.com/images/icons/berachain.svg',
    nativeCurrency: {
      address: zeroAddress,
      decimals: 18,
      name: 'Bera',
      symbol: 'BERA',
    },
    wnativeToken: {
      address: '0x6969696969696969696969696969696969696969',
      decimals: 18,
      symbol: 'WBERA',
      name: 'Wrapped Bera',
    },
    geckoId: 'berachain',
    dexScreenerId: 'berachain',
  },
};

export const chainIdToChainSlugMap: {
  [key: number]: string;
} = Object.fromEntries(Object.entries(chainsData).map(([key, value]) => [Number(key), value.slug]));

export const chainSlugToChainIdMap: {
  [key: string]: number;
} = Object.fromEntries(Object.entries(chainsData).map(([key, value]) => [value.slug, Number(key)]));

export const defaultChain = chainsData[supportedChainIds.mode];
