import { Hex } from 'viem';
import { supportedChainIds } from '../chains';
import { monadTestnetAddresses } from './monadTestnet';
import { bscAddresses } from './bsc';

export const contractAddresses: {
  [chainId: number]: {
    v3Factory: Hex;
    nftManager: Hex;
    nftDescriptor: Hex;
    swapRouter: Hex;
    v2Quoter: Hex;
    tickLens: Hex;
    multicall2: Hex;
  };
} = {
  [supportedChainIds.monadTestnet]: monadTestnetAddresses,
  [supportedChainIds.bsc]: bscAddresses,
};
