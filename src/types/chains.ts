import { Token } from './tokens';

export type ChainsConfig = {
  slug: string;
  name: string;
  rpcUrls: string[];
  networkType: 'mainnet' | 'testnet';
  blockExplorer: string;
  nativeCurrency: Token;
  wnativeToken: Token;
  logo: string;
  subgraphURL: string;
  geckoId?: string;
  dexScreenerId?: string;
};
