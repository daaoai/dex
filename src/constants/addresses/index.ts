import { Hex } from 'viem';
import { supportedChainIds } from '../chains';
import { baseAddresses } from './base';

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
  [supportedChainIds.base]: baseAddresses,
};
