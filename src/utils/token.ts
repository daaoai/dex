import { chainsData } from '@/constants/chains';

export const isNativeCurrency = (address: string, chainId: number): boolean => {
  const chainInfo = chainsData[chainId];
  return chainInfo?.nativeCurrency.address === address;
};
