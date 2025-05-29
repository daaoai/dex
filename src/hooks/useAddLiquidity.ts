import { contractAddresses } from '@/constants/addresses';
import { chainsData } from '@/constants/chains';
import { UniswapNFTManager } from '@/contracts/uniswap/nftManager';
import { UniswapV3Pool } from '@/contracts/uniswap/v3Pool';
import { getTokensBalance } from '@/helper/balance';
import { V3Position } from '@/types/v3';
import { getPublicClient } from '@/utils/publicClient';
import { getMinAmount } from '@/utils/slippage';
import { V3PoolUtils } from '@/utils/v3Pool';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { erc20Abi, Hex, parseUnits } from 'viem';
import { useAccount, useSendTransaction, useSwitchChain, useWriteContract } from 'wagmi';
import useEffectAfterMount from './useEffectAfterMount';

const useAddLiquidity = ({ chainId, position }: { chainId: number; position: V3Position }) => {
  const { switchChainAsync } = useSwitchChain();
  const { chainId: accountChainId, address: account } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  const { nftManager } = contractAddresses[chainId];
  const [loading, setLoading] = useState(false);

  const [token0FormattedAmount, setToken0FormattedAmount] = useState<string>('0');
  const [token1FormattedAmount, setToken1FormattedAmount] = useState<string>('0');
  const [poolSlot0, setPoolSlot0] = useState<{
    sqrtPriceX96: bigint;
    currentTick: number;
  } | null>(null);

  const [balances, setBalances] = useState<{ [key: string]: bigint }>({});

  const switchChain = async () => {
    if (accountChainId !== chainId) {
      try {
        await switchChainAsync({ chainId });
        return true;
      } catch (error) {
        console.error('Error switching chain:', error);
        toast.error(`Please switch to ${chainsData[chainId].slug} network to proceed`);
        return false;
      }
    }
    return true;
  };

  const approveToken = async (amount: bigint, token: Hex) => {
    if (!account) return;
    const publicClient = getPublicClient(chainId);
    const spender = nftManager;
    const allowance = await publicClient.readContract({
      address: token,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [account, spender],
    });
    if (BigInt(allowance) >= amount) {
      return;
    }
    const tx = await writeContractAsync({
      address: token,
      abi: erc20Abi,
      functionName: 'approve',
      args: [spender, amount],
    });
    if (!tx) throw new Error('Approval transaction failed to send');
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
      confirmations: 1,
    });
    if (receipt?.status !== 'success') {
      throw new Error('Approval transaction did not succeed');
    }
    return tx;
  };

  const updatePoolSlot0 = async () => {
    if (!position.poolAddress) return;
    setLoading(true);
    try {
      const pool = new UniswapV3Pool(chainId, position.poolAddress);
      const slot0 = await pool.slot0();
      setPoolSlot0({
        sqrtPriceX96: slot0.sqrtPriceX96,
        currentTick: slot0.currentTick,
      });
    } catch (error) {
      console.error('Error fetching pool slot0:', error);
      toast.error('Failed to fetch pool data');
    } finally {
      setLoading(false);
    }
  };

  const getToken1FormattedAmount = (formattedToken0Amount: string) => {
    if (!Number(formattedToken0Amount)) return '0';
    if (!poolSlot0) {
      toast.error('Pool slot0 data not available');
      return '0';
    }
    return V3PoolUtils.getToken1Amount({
      decimal0: position.token0Details.decimals,
      decimal1: position.token1Details.decimals,
      formattedToken0Amount: Number(formattedToken0Amount),
      lowerTick: position.tickLower,
      sqrtPriceX96: poolSlot0.sqrtPriceX96,
      upperTick: position.tickUpper,
    });
  };

  const getToken0FormattedAmount = (formattedToken1Amount: string) => {
    if (!Number(formattedToken1Amount)) return '0';
    if (!poolSlot0) {
      toast.error('Pool slot0 data not available');
      return '0';
    }
    return V3PoolUtils.getToken0Amount({
      decimal0: position.token0Details.decimals,
      decimal1: position.token1Details.decimals,
      formattedToken1Amount: Number(formattedToken1Amount),
      lowerTick: position.tickLower,
      sqrtPriceX96: poolSlot0.sqrtPriceX96,
      upperTick: position.tickUpper,
    });
  };

  const updateTokensBalance = async () => {
    if (!account || !chainId) return;
    const balance = await getTokensBalance([position.token1, position.token0], chainId, account);
    setBalances(balance);
    return balance;
  };

  const addLiquidity = async () => {
    if (!account || !chainId) {
      toast.error('Invalid parameters to add liquidity');
      return;
    }
    const { nftManager } = contractAddresses[chainId];

    if (!Number(token0FormattedAmount) || !Number(token1FormattedAmount)) {
      toast.error('Please enter valid amounts for both tokens');
      return;
    }

    const amount0 = parseUnits(token0FormattedAmount, position.token0Details.decimals);
    const amount1 = parseUnits(token1FormattedAmount, position.token1Details.decimals);
    if (amount0 > balances[position.token0] || amount1 > balances[position.token1]) {
      toast.error('Insufficient token balance');
      return;
    }

    const amount0Min = getMinAmount(amount0, 0.5);
    const amount1Min = getMinAmount(amount1, 0.5);

    await approveToken(amount0, position.token0);
    await approveToken(amount1, position.token1);

    const callData = UniswapNFTManager.generateAddLiquidityCallData({
      tokenId: position.tokenId,
      amount0Desired: amount0,
      amount1Desired: amount1,
      amount0Min,
      amount1Min,
    });
    if (accountChainId !== chainId) {
      const switched = await switchChain();
      if (!switched) return;
    }
    try {
      const hash = await sendTransactionAsync({
        to: nftManager,
        data: callData,
      });
      const publicClient = getPublicClient(chainId);
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });
      if (receipt.status !== 'success') {
        toast.error('Transaction failed');
        return;
      }
      toast.success('Liquidity added successfully');
    } catch (error) {
      console.error('Error adding liquidity:', error);
      toast.error('Failed to add liquidity');
    }
  };

  useEffectAfterMount(() => {
    if (!Number(token0FormattedAmount)) {
      setToken1FormattedAmount('0');
      return;
    }
    setToken1FormattedAmount(getToken1FormattedAmount(token0FormattedAmount));
  }, [token0FormattedAmount, poolSlot0]);

  useEffectAfterMount(() => {
    if (!Number(token1FormattedAmount)) {
      setToken0FormattedAmount('0');
      return;
    }
    setToken0FormattedAmount(getToken0FormattedAmount(token1FormattedAmount));
  }, [token1FormattedAmount, poolSlot0]);

  useEffect(() => {
    updatePoolSlot0();
    updateTokensBalance();
  }, [position.poolAddress, chainId, account]);

  return {
    setToken0FormattedAmount,
    setToken1FormattedAmount,
    token0FormattedAmount,
    token1FormattedAmount,
    addLiquidity,
    loading,
    poolSlot0,
  };
};

export default useAddLiquidity;
