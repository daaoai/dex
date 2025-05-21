import { chainsData } from '@/constants/chains';
import { tokensByChainId } from '@/constants/tokens';
import { Token } from '@/types/tokens';
import { getPublicClient } from '@/utils/publicClient';
import { erc20Abi, Hex } from 'viem';
import { multicallForSameContract } from './multicall';
const fetchErc20Info = async ({ address, chainId }: { address: Hex; chainId: number }) => {
  const multicallRes = (await multicallForSameContract({
    abi: erc20Abi,
    address,
    chainId,
    functionNames: ['symbol', 'decimals', 'name'],
    params: [[], [], []],
  })) as [
    string, // symbol
    number, // decimals
    string, // name
  ];
  return {
    symbol: multicallRes[0],
    decimals: multicallRes[1],
    name: multicallRes[2] || multicallRes[0],
    address,
  };
};

export const getTokenDetails = async ({ address, chainId }: { address: Hex; chainId: number }): Promise<Token> => {
  let tokenDetails: Token | undefined;
  try {
    tokenDetails = getLocalTokenDetails({ address, chainId });
  } catch {
    console.log('Token not found in local data for:', address);
  }
  if (!tokenDetails) {
    return await fetchErc20Info({ address, chainId });
  }
  return tokenDetails;
};
export const isNativeCurrency = (address: string, chainId: number): boolean => {
  const chainInfo = chainsData[chainId];
  return chainInfo?.nativeCurrency.address === address;
};

export const fetchTokenBalance = async ({ token, account, chainId }: { token: Hex; account: Hex; chainId: number }) => {
  try {
    const publicClient = getPublicClient(chainId);
    const balance = isNativeCurrency(token, chainId)
      ? await publicClient.getBalance({ address: account })
      : await publicClient.readContract({
          address: token,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [account],
        });
    return balance;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return BigInt(0);
  }
};

export const getLocalTokenDetails = ({ address, chainId }: { address: Hex; chainId: number }): Token => {
  const tokenDetails = tokensByChainId[chainId]?.[address];
  if (!tokenDetails) {
    throw new Error('Token not found');
  }
  return tokenDetails;
};
