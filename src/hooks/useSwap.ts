// hooks/useSwap.ts
import { useAccount, useSwitchChain, useWriteContract, useSendTransaction } from 'wagmi';
import { erc20Abi, Hex, parseUnits } from 'viem';
import { toast } from 'react-toastify';

import type { Token } from '@/types/tokens';
import { contractAddresses } from '@/constants/addresses';
import { getMinAmount } from '@/utils/slippage';
import { getPublicClient } from '@/utils/publicClient';

import { encodeFunctionData } from 'viem';

export const useSwap = ({ chainId }: { chainId: number }) => {
  const { address: account, chainId: walletChainId } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();

  const approveIfNeeded = async ({
    amount,
    token,
    spender,
  }: {
    amount: bigint;
    token: Hex;
    spender: Hex;
  }) => {
    if (!account) return;
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

  const swapExactIn = async ({
    tokenIn,
    tokenOut,
    amountIn,
    amountOut,
    slippage,
  }: {
    tokenIn: Token;
    tokenOut: Token;
    amountIn: string;
    amountOut: string;
    slippage: number;
  }) => {
    try {
      if (!account) throw new Error('Wallet not connected');
      if (walletChainId !== chainId) {
        await switchChainAsync({ chainId });
      }

      const routerAddress = contractAddresses[chainId].swapRouter;
      const amountInParsed = parseUnits(amountIn, tokenIn.decimals);
      const minAmountOut = getMinAmount(parseUnits(amountOut, tokenOut.decimals), slippage);
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 5); // 5 minutes

      await approveIfNeeded({
        amount: amountInParsed,
        token: tokenIn.address,
        spender: routerAddress,
      });

      const callData = encodeFunctionData({
        abi: [
          {
            name: 'exactInputSingle',
            type: 'function',
            stateMutability: 'payable',
            inputs: [
              {
                name: 'params',
                type: 'tuple',
                components: [
                  { name: 'tokenIn', type: 'address' },
                  { name: 'tokenOut', type: 'address' },
                  { name: 'fee', type: 'uint24' },
                  { name: 'recipient', type: 'address' },
                  { name: 'deadline', type: 'uint256' },
                  { name: 'amountIn', type: 'uint256' },
                  { name: 'amountOutMinimum', type: 'uint256' },
                  { name: 'sqrtPriceLimitX96', type: 'uint160' },
                ],
              },
            ],
            outputs: [{ name: 'amountOut', type: 'uint256' }],
          },
        ],
        functionName: 'exactInputSingle',
        args: [
          {
            tokenIn: tokenIn.address,
            tokenOut: tokenOut.address,
            fee: 3000,
            recipient: account,
            deadline,
            amountIn: amountInParsed,
            amountOutMinimum: minAmountOut,
            sqrtPriceLimitX96: 0n,
          },
        ],
      });

      const hash = await sendTransactionAsync({
        account,
        to: routerAddress,
        data: callData,
        value: 0n,
        chainId,
      });

      const receipt = await getPublicClient(chainId).waitForTransactionReceipt({ hash });
      console.log(receipt)
      if (receipt.status !== 'success') throw new Error('Swap failed');

      toast.success('Swap successful');
    } catch (err) {
      console.error(err);
      toast.error('Swap failed');
    }
  };

  return {
    swapExactIn,
  };
};
