import { supportedChainIds } from '@/constants/chains';
import { Token } from '@/types/tokens';
import { Hex } from 'viem';
import { baseTokens } from './baseTokens';

export const tokensByChainId: { [chainId: number]: { [address: Hex]: Token } } = {
  [supportedChainIds.base]: baseTokens,
};
