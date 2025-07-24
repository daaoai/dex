// hooks/useSwap.ts
import { toast } from 'react-toastify';
import { erc20Abi, Hex, parseUnits } from 'viem';
import { useAccount, useSendTransaction, useSwitchChain, useWriteContract } from 'wagmi';

import type { Token } from '@/types/tokens';
import { getPublicClient } from '@/utils/publicClient';

import { contractAddresses } from '@/constants/addresses';
import { RouteParams } from '@/types/route';
import { useRouteService } from './useRouteService';
import { chainsData } from '@/constants/chains';

export const useSwap = ({ chainId }: { chainId: number }) => {
  const { address: account, chainId: walletChainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const { getBestRoute } = useRouteService();

  const approveIfNeeded = async ({ amount, token, spender }: { amount: bigint; token: Hex; spender: Hex }) => {
    if (!account || token === chainsData[chainId].nativeCurrency.address) return;
    const publicClient = getPublicClient(chainId);
    const allowance = await publicClient.readContract({
      address: token,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account, spender],
    });
    if (BigInt(allowance) >= amount) return;

    const tx = await writeContractAsync({
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, amount],
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
      confirmations: 1,
    });

    if (receipt.status !== 'success') {
      throw new Error('Approval failed');
    }
  };

  const getQuote = async (params: RouteParams) => {
    const res = await getBestRoute(params);
    if (!res) return 0n;
    return parseUnits(res.response.quote.amount, params.tokenOut.decimals);
  };

  const swap = async ({
    tokenIn,
    tokenOut,
    amountIn,
    slippage,
    recipient,
    deadline,
  }: {
    tokenIn: Token;
    tokenOut: Token;
    amountIn: string;
    slippage: number;
    recipient: Hex;
    deadline: number;
  }) => {
    try {
      if (!account) throw new Error('Wallet not connected');
      if (walletChainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      const amountInParsed = parseUnits(amountIn.toString(), tokenIn.decimals);

      const router = contractAddresses[chainId].swapRouter;

      await approveIfNeeded({
        amount: amountInParsed,
        token: tokenIn.address,
        spender: router,
      });

      const route = await getBestRoute({
        tokenIn,
        amount: amountIn,
        deadline,
        recipient,
        slippage,
        tokenOut,
      });

      if (!route) {
        throw Error('could not find route');
      }
      const hash = await sendTransactionAsync({
        account,
        to: route.response.transaction.to,
        data: route.response.transaction.data,
        value: BigInt(route.response.transaction.value),
        chainId,
      });

      const receipt = await getPublicClient(chainId).waitForTransactionReceipt({ hash });
      if (receipt.status !== 'success') throw new Error('Swap failed');

      toast.success('Swap successful');
    } catch (err) {
      console.error(err);
      toast.error('Swap failed');
    }
  };

  return {
    swap,
    getQuote,
  };
};
