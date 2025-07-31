import { tokensByChainId } from '@/constants/tokens';
import { Token } from '@/types/tokens';
import { isNativeToken } from '@/utils/address';
import { getPublicClient } from '@/utils/publicClient';
import { isNativeCurrency } from '@/utils/token';
import { erc20Abi, Hex } from 'viem';
import { multicallForSameContract, multicallWithSameAbi } from './multicall';

export const customTokensByChainId: Record<number, Record<Hex, Token>> = {};

export const fetchErc20Info = async ({ address, chainId }: { address: Hex; chainId: number }) => {
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

export const getTokensDecimals = async (tokens: Hex[], chainId: number): Promise<Record<Hex, number>> => {
  const multicallRes = (await multicallWithSameAbi({
    abi: erc20Abi,
    chainId,
    contracts: tokens,
    allMethods: tokens.map(() => 'decimals'),
    allParams: tokens.map(() => []),
  })) as number[];
  const decimals: Record<Hex, number> = {};
  tokens.forEach((token, idx) => {
    decimals[token] = multicallRes[idx];
  });
  return decimals;
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

export const getLocalTokenDetails = ({ address, chainId }: { address: Hex; chainId: number }): Token => {
  const tokenDetails = tokensByChainId[chainId]?.[address];
  const customTokenDetails = customTokensByChainId[chainId]?.[address];
  if (!tokenDetails && !customTokenDetails) {
    throw new Error('Token not found');
  }
  return tokenDetails || customTokenDetails;
};

export const getTokensBalance = async (
  tokens: Hex[],
  chainId: number,
  account: Hex,
): Promise<Record<string, bigint>> => {
  try {
    const tokensWithoutNative = tokens.filter((token) => !isNativeToken(token, chainId));
    const publicClient = getPublicClient(chainId);

    const [erc20Balances, nativeBalance] = await Promise.allSettled([
      multicallWithSameAbi({
        chainId,
        contracts: [...tokensWithoutNative],
        abi: erc20Abi,
        allMethods: tokensWithoutNative.map(() => 'balanceOf'),
        allParams: tokensWithoutNative.map(() => [account]),
      }),
      publicClient.getBalance({
        address: account,
      }),
    ]);

    const erc20BalancesResult: bigint[] =
      erc20Balances.status === 'fulfilled'
        ? (erc20Balances.value as bigint[])
        : tokensWithoutNative.map(() => BigInt(0));
    const nativeBalanceResult: bigint = nativeBalance.status === 'fulfilled' ? nativeBalance.value : BigInt(0);

    const balances: Record<string, bigint> = {};
    tokensWithoutNative.forEach((token, idx) => {
      balances[token] = erc20BalancesResult[idx];
    });
    tokens.forEach((token) => {
      if (isNativeToken(token, chainId)) {
        balances[token] = nativeBalanceResult;
      }
    });
    return balances;
  } catch {
    return tokens.reduce(
      (acc, token) => {
        acc[token] = BigInt(0);
        return acc;
      },
      {} as Record<string, bigint>,
    );
  }
};
