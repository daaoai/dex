import { useCallback } from 'react';
import { getPublicClient } from '@/utils/publicClient';
import { parseUnits } from 'viem';
import { Address } from 'viem';
import { Token } from '@/types/tokens';
import { contractAddresses } from '@/constants/addresses';

interface QuoteParams {
  tokenIn: Token;
  tokenOut: Token;
  amount: string;
  fee: number;
}

const quoterV2Abi = [
  {
    name: 'quoteExactInputSingle',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'fee', type: 'uint24' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'sqrtPriceLimitX96', type: 'uint160' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
  {
    name: 'quoteExactOutputSingle',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'tokenOut', type: 'address' },
      { name: 'fee', type: 'uint24' },
      { name: 'amountOut', type: 'uint256' },
      { name: 'sqrtPriceLimitX96', type: 'uint160' },
    ],
    outputs: [{ name: 'amountIn', type: 'uint256' }],
  },
];

export const useQuoter = ({ chainId }: { chainId: number }) => {
  const quoterAddress = contractAddresses[chainId].swapRouter;

  const quoteExactInputSingle = useCallback(
    async ({ tokenIn, tokenOut, amount, fee }: QuoteParams) => {
      try {
        const publicClient = getPublicClient(chainId);
        const amountIn = parseUnits(amount, tokenIn.decimals);

        const result = await publicClient.readContract({
          address: quoterAddress as Address,
          abi: quoterV2Abi,
          functionName: 'quoteExactInputSingle',
          args: [
            tokenIn.address,
            tokenOut.address,
            fee,
            amountIn,
            0, // no price limit
          ],
        });

        return result as bigint;
      } catch (error) {
        console.error('quoteExactInputSingle failed:', error);
        return BigInt(0);
      }
    },
    [chainId, quoterAddress]
  );

  const quoteExactOutputSingle = useCallback(
    async ({ tokenIn, tokenOut, amount, fee }: QuoteParams) => {
      try {
        const publicClient = getPublicClient(chainId);
        const amountOut = parseUnits(amount, tokenOut.decimals);

        const result = await publicClient.readContract({
          address: quoterAddress as Address,
          abi: quoterV2Abi,
          functionName: 'quoteExactOutputSingle',
          args: [
            tokenIn.address,
            tokenOut.address,
            fee,
            amountOut,
            0,
          ],
        });

        return result as bigint;
      } catch (error) {
        console.error('quoteExactOutputSingle failed:', error);
        return BigInt(0);
      }
    },
    [chainId, quoterAddress]
  );

  return {
    quoteExactInputSingle,
    quoteExactOutputSingle,
  };
};
