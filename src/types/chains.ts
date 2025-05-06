import { Hex } from 'viem';

export type Token = {
  address: Hex;
  decimals: number;
  symbol: string;
  name: string;
  logo?: string;
};

export type ChainsConfig = {
  slug: string;
  name: string;
  rpcUrls: string[];
  networkType: 'mainnet' | 'testnet';
  blockExplorer: string;
  nativeCurrency: Token;
  wnativeToken: Token;
  logo: string;
  geckoId?: string;
  dexScreenerId?: string;
};
