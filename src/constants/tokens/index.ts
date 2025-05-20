import { supportedChainIds } from '@/constants/chains';
import { Token } from '@/types/tokens';
import { Hex } from 'viem';
import { monadTestnetTokens } from './monadTestnetTokens';

export const tokensByChainId: { [chainId: number]: { [address: Hex]: Token } } = {
  [supportedChainIds.monadTestnet]: monadTestnetTokens,
};
