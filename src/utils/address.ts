import { chainsData } from '@/constants/chains';
import { isAddress, getAddress, checksumAddress, Hex } from 'viem';

export const isNativeToken = (address: string, chainId: number): boolean => {
  const checkSumAddress = isAddress(address) ? getAddress(address) : address;
  const chainInfo = chainsData[chainId];
  return chainInfo.nativeCurrency.address === checkSumAddress;
};

export const formatToken = (address: Hex) => {
  return checksumAddress(address);
};
