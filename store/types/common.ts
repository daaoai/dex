import { LiveFeedToken } from '@/types/coinGecko';

export type CommonReducerState = {
  appChainId: number;
  memeTokens: { [chainId: number]: LiveFeedToken[] };
  altTokens: { [chainId: number]: LiveFeedToken[] };
};
