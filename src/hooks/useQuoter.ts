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
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'amountIn', type: 'uint256' },
          { name: 'fee', type: 'uint24' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
      },
    ],
    outputs: [
      { name: 'amountOut', type: 'uint256' },
      { name: 'sqrtPriceX96After', type: 'uint160' },
      { name: 'initializedTicksCrossed', type: 'uint32' },
      { name: 'gasEstimate', type: 'uint256' },
    ],
  },
  {
    name: 'quoteExactOutputSingle',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'tokenIn', type: 'address' },
          { name: 'tokenOut', type: 'address' },
          { name: 'amount', type: 'uint256' },
          { name: 'fee', type: 'uint24' },
          { name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
      },
    ],
    outputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'sqrtPriceX96After', type: 'uint160' },
      { name: 'initializedTicksCrossed', type: 'uint32' },
      { name: 'gasEstimate', type: 'uint256' },
    ],
  },
];

export const useQuoter = ({ chainId }: { chainId: number }) => {
  const quoterAddress = contractAddresses[chainId].v2Quoter;

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
            {
              tokenIn: tokenIn.address,
              tokenOut: tokenOut.address,
              amountIn,
              fee,
              sqrtPriceLimitX96: 0n,
            },
          ],
        });

        return (result as [bigint, bigint, number, bigint])[0]; // amountOut
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

      if (amountOut <= 0n) {
        throw new Error('Invalid amountOut for quoteExactOutputSingle');
      }

      const result = await publicClient.readContract({
        address: quoterAddress as Address,
        abi: quoterV2Abi,
        functionName: 'quoteExactOutputSingle',
        args: [
          {
            tokenIn: tokenIn.address,
            tokenOut: tokenOut.address,
            amount: amountOut,
            fee,
            sqrtPriceLimitX96: 0n,
          },
        ],
      });

      return (result as [bigint, bigint, number, bigint])[0]; // amountIn
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
