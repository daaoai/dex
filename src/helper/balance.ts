import { getPublicClient } from '@/utils/publicClient';
import { erc20Abi, Hex } from 'viem';
import { multicallWithSameAbi } from './multicall';
import { isNativeToken } from '@/utils/address';

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
