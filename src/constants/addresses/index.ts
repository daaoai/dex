import { Hex } from 'viem';
import { supportedChainIds } from '../chains';
import { monadTestnetAddresses } from './monadTestnet';

export const contractAddresses: {
  [chainId: number]: {
    v3Factory: Hex;
    nftManager: Hex;
  };
} = {
  [supportedChainIds.monadTestnet]: monadTestnetAddresses,
};
