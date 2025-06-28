import { quoterV2Abi } from '@/abi/uniswap/quoter';
import { contractAddresses } from '@/constants/addresses';
import { Token } from '@/types/tokens';
import { getPublicClient } from '@/utils/publicClient';
import { useCallback } from 'react';
import { decodeFunctionResult, encodeFunctionData, parseUnits } from 'viem';
import { useAccount } from 'wagmi';

interface QuoteParams {
  tokenIn: Token;
  tokenOut: Token;
  amount: string;
  fee: number;
}

export const useQuoter = ({ chainId }: { chainId: number }) => {
  const quoterAddress = contractAddresses[chainId].v2Quoter;
  const { address: account } = useAccount();

  const quoteExactInputSingle = useCallback(
    async ({ tokenIn, tokenOut, amount, fee }: QuoteParams) => {
      try {
        const publicClient = getPublicClient(chainId);
        const amountIn = parseUnits(amount, tokenIn.decimals);

        const result = await publicClient.call({
          to: quoterAddress,
          account: account,
          data: encodeFunctionData({
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
          }),
        });

        const decoded = decodeFunctionResult({
          abi: quoterV2Abi,
          functionName: 'quoteExactInputSingle',
          data: result.data || '0x',
        });

        const [amountOut] = decoded;

        return amountOut;
      } catch (error) {
        console.error('quoteExactInputSingle failed:', error);
        return BigInt(0);
      }
    },
    [chainId, quoterAddress],
  );

  const quoteExactOutputSingle = useCallback(
    async ({ tokenIn, tokenOut, amount, fee }: QuoteParams) => {
      try {
        const publicClient = getPublicClient(chainId);
        const amountOut = parseUnits(amount, tokenOut.decimals);

        if (amountOut <= 0n) {
          throw new Error('Invalid amountOut for quoteExactOutputSingle');
        }

        const result = await publicClient.call({
          to: quoterAddress,
          account: account,
          data: encodeFunctionData({
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
          }),
        });

        const decoded = decodeFunctionResult({
          abi: quoterV2Abi,
          functionName: 'quoteExactOutputSingle',
          data: result.data || '0x',
        });

        const [amountIn] = decoded;

        return amountIn;
      } catch (error) {
        console.error('quoteExactOutputSingle failed:', error);
        return BigInt(0);
      }
    },
    [chainId, quoterAddress],
  );

  return {
    quoteExactInputSingle,
    quoteExactOutputSingle,
  };
};
