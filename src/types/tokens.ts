import { Hex } from 'viem';

export type Token = {
  name: string;
  symbol: string;
  logo?: string;
  address: Hex;
  decimals: number;
  coingeckoId?: string;
};
