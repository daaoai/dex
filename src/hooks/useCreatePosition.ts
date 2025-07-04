import { contractAddresses } from '@/constants/addresses';
import { chainsData } from '@/constants/chains';
import { supportedFeeAndTickSpacing } from '@/constants/fee';
import { UniswapNFTManager } from '@/contracts/uniswap/nftManager';
import { UniswapV3Factory } from '@/contracts/uniswap/v3Factory';
import { UniswapV3Pool } from '@/contracts/uniswap/v3Pool';
import { getTokenDetails, getTokensBalance } from '@/helper/token';
import { Token } from '@/types/tokens';
import { V3PoolDetails } from '@/types/v3';
import { getPublicClient } from '@/utils/publicClient';
import { getMinAmount } from '@/utils/slippage';
import { V3PoolUtils } from '@/utils/v3Pool';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { erc20Abi, Hex, parseUnits, zeroAddress } from 'viem';
import { useAccount, useSendTransaction, useSwitchChain, useWriteContract } from 'wagmi';
import useEffectAfterMount from './useEffectAfterMount';

type CurrentPoolData = {
  tick: number;
  sqrtPriceX96: bigint;
  isInitialized: boolean;
};

// const getPriceFromPercent = (percent: number, currentPrice: number) => {
//   return currentPrice * (1 + percent / 100);
// };
export const useCreatePosition = ({ chainId }: { chainId: number }) => {
  const [srcTokenFormattedAmount, setSrcTokenFormattedAmount] = useState('');
  const [dstTokenFormattedAmount, setDstTokenFormattedAmount] = useState('');
  const [selectedRange, setSelectedRange] = useState<'full' | 'custom'>('full');
  const [balances, setBalances] = useState<{ [key: string]: bigint }>({});
  // const [selectedRange, setSelectedRange] = useState(25);
  const [slippageTolerance, setSlippageTolerance] = useState(1);
  const [srcToken, setSrcToken] = useState<'token0' | 'token1'>('token0');
  const [lowerPrice, setLowerPrice] = useState(0);
  const [upperPrice, setUpperPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lowerTick, setLowerTick] = useState(0);
  const [upperTick, setUpperTick] = useState(0);
  const [poolDetails, setPoolDetails] = useState<Omit<V3PoolDetails, 'slot0'> | null>(null);
  const [currentPoolData, setCurrentPoolData] = useState<CurrentPoolData>({
    tick: 0,
    sqrtPriceX96: 0n,
    isInitialized: false,
  });

  const [txnInProgress, setTxnInProgress] = useState(false);
  const [txnState, setTxnState] = useState<'approvingToken0' | 'approvingToken1' | 'waitingForConfirmation' | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [approvalStatus] = useState<string | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const { address: account, chainId: accountChainId } = useAccount();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  const { switchChainAsync } = useSwitchChain();

  const srcTokenDetails = srcToken === 'token0' ? poolDetails?.token0 : poolDetails?.token1;
  const destTokenDetails = srcToken === 'token0' ? poolDetails?.token1 : poolDetails?.token0;
  const nftManagerAddress = contractAddresses[chainId].nftManager;

  const updateCurrentPoolData = async (poolAddress: Hex) => {
    try {
      const pool = new UniswapV3Pool(chainId, poolAddress);
      setIsDataLoading(true);
      const [{ currentTick, sqrtPriceX96 }, liquidity] = await Promise.all([pool.slot0(), pool.liquidity()]);

      setCurrentPoolData({
        tick: currentTick,
        sqrtPriceX96,
        isInitialized: sqrtPriceX96 > 0n,
      });
      updateCurrentPrice(sqrtPriceX96);

      return {
        currentTick,
        sqrtPriceX96,
        liquidity,
        isInitialized: sqrtPriceX96 > 0n,
        hasLiquidity: liquidity > 0n,
      };
    } catch (error) {
      console.error('Error fetching pool data:', error);
      setError('Failed to fetch pool data');
    } finally {
      setIsDataLoading(false);
    }
  };

  const fetchInitialData = async ({ token0, token1, fee }: { token0: Hex; token1: Hex; fee: number }) => {
    try {
      const [poolAddress, token0Details, token1Details] = await Promise.all([
        UniswapV3Factory.getPoolAddress({
          tokenA: token0,
          tokenB: token1,
          fee,
          factoryAddress: contractAddresses[chainId].v3Factory,
          chainId,
        }),
        getTokenDetails({
          address: token0,
          chainId,
        }),
        getTokenDetails({
          address: token1,
          chainId,
        }),
      ]);
      const poolDetails = {
        address: poolAddress,
        token0: token0Details,
        token1: token1Details,
        fee,
        tickSpacing: supportedFeeAndTickSpacing.find((item) => item.fee === fee)?.tickSpacing || 0,
      };
      setPoolDetails(poolDetails);
      if (poolAddress !== zeroAddress) {
        const currentPoolData = await updateCurrentPoolData(poolAddress);
        if (currentPoolData && currentPoolData.isInitialized) {
          // Pool is initialized
          setCurrentPoolData({
            tick: currentPoolData.currentTick,
            sqrtPriceX96: currentPoolData.sqrtPriceX96,
            isInitialized: true,
          });
          setLowerTick(currentPoolData.currentTick - poolDetails.tickSpacing);
          setUpperTick(currentPoolData.currentTick + poolDetails.tickSpacing);

          if (!currentPoolData.hasLiquidity) {
            console.warn('Pool exists and is initialized but has no liquidity');
          }
        } else {
          // Pool exists but not initialized - treat as new pool
          handleUninitializedPool(poolDetails, token0Details, token1Details);
        }
      } else {
        // Pool doesn't exist
        handleUninitializedPool(poolDetails, token0Details, token1Details);
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const handleUninitializedPool = (
    poolDetails: { address: `0x${string}`; token0: Token; token1: Token; fee: number; tickSpacing: number },
    token0Details: Token,
    token1Details: Token,
  ) => {
    // Set default values for uninitialized pool
    const price = 0.5; // or get from external price feed
    const currentTick = V3PoolUtils.getTickFromPrice({
      decimal0: token0Details.decimals,
      decimal1: token1Details.decimals,
      price,
      tickSpacing: poolDetails.tickSpacing,
    });
    const sqrtPriceX96 = V3PoolUtils.getSqrtPriceX96FromTick({ tick: currentTick });

    setCurrentPoolData({
      tick: currentTick,
      sqrtPriceX96,
      isInitialized: false,
    });

    setLowerTick(currentTick - poolDetails.tickSpacing);
    setUpperTick(currentTick + poolDetails.tickSpacing);
  };

  const updateLowerPrice = (tickLower: number) => {
    if (!poolDetails) return;
    const price = V3PoolUtils.getPriceFromTick({
      decimal0: poolDetails.token0.decimals,
      decimal1: poolDetails.token1.decimals,
      tick: tickLower,
    });
    if (srcToken === 'token1') {
      setUpperPrice(1 / price); // when token1 is selected, lower price actually becomes upper price
      return 1 / price;
    }
    setLowerPrice(price);
  };

  const updateUpperPrice = (tickUpper: number) => {
    if (!poolDetails) return;
    const price = V3PoolUtils.getPriceFromTick({
      decimal0: poolDetails.token0.decimals,
      decimal1: poolDetails.token1.decimals,
      tick: tickUpper,
    });
    if (srcToken === 'token1') {
      setLowerPrice(1 / price); // when token1 is selected, upper price actually becomes lower price
      return 1 / price;
    }
    setUpperPrice(price);
  };

  const updateCurrentPrice = (sqrtPrice: bigint) => {
    if (!poolDetails) return;
    const currentPrice = V3PoolUtils.getPriceFromSqrtRatio({
      decimal0: poolDetails.token0.decimals,
      decimal1: poolDetails.token1.decimals,
      sqrtPriceX96: sqrtPrice,
    });
    if (srcToken === 'token0') {
      setCurrentPrice(currentPrice);
      return currentPrice;
    } else {
      setCurrentPrice(1 / currentPrice);
      return 1 / currentPrice;
    }
  };

  const getDstTokenAmount = (formattedSrcAmount: string) => {
    if (!poolDetails) return '0';
    if (!Number(formattedSrcAmount)) return '0';
    if (srcToken === 'token0') {
      return V3PoolUtils.getToken1Amount({
        decimal0: poolDetails.token0.decimals,
        decimal1: poolDetails.token1.decimals,
        formattedToken0Amount: Number(formattedSrcAmount),
        lowerTick,
        sqrtPriceX96: currentPoolData.sqrtPriceX96,
        upperTick,
      });
    }
    return V3PoolUtils.getToken0Amount({
      decimal0: poolDetails.token0.decimals,
      decimal1: poolDetails.token1.decimals,
      formattedToken1Amount: Number(formattedSrcAmount),
      lowerTick,
      sqrtPriceX96: currentPoolData.sqrtPriceX96,
      upperTick,
    });
  };

  const updateTokensBalance = async () => {
    if (!account || !srcTokenDetails || !destTokenDetails) return;
    const balance = await getTokensBalance([srcTokenDetails.address, destTokenDetails.address], chainId, account);
    setBalances(balance);
    return balance;
  };

  const approveToken = async (amount: bigint, token: Hex) => {
    if (!account) return;
    if (token === poolDetails?.token0.address) {
      setTxnState('approvingToken0');
    }
    if (token === poolDetails?.token1.address) {
      setTxnState('approvingToken1');
    }
    const publicClient = getPublicClient(chainId);
    const spender = nftManagerAddress;
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

  const increaseUpperTick = async () => {
    if (!poolDetails) return;
    setUpperTick((prev) => prev + poolDetails.tickSpacing);
  };

  const decreaseUpperTick = async () => {
    if (!poolDetails) return;
    setUpperTick((prev) => prev - poolDetails.tickSpacing);
  };
  const increaseLowerTick = async () => {
    if (!poolDetails) return;
    setLowerTick((prev) => prev + poolDetails.tickSpacing);
  };
  const decreaseLowerTick = async () => {
    if (!poolDetails) return;
    setLowerTick((prev) => prev - poolDetails.tickSpacing);
  };

  const createPosition = async () => {
    try {
      if (!account || !accountChainId) {
        toast.error('Please connect wallet to proceed');
        return;
      }
      if (!poolDetails || !srcTokenDetails || !destTokenDetails) {
        toast.error('Pool not found');
        return;
      }

      if (accountChainId !== chainId) {
        try {
          await switchChainAsync({ chainId });
        } catch (error) {
          console.error('Error switching chain:', error);
          toast.error(`Please switch to ${chainsData[chainId].slug} network to proceed`);
          return;
        }
      }

      if (!Number(srcTokenFormattedAmount) || !Number(dstTokenFormattedAmount)) {
        toast.error('Please enter valid amounts');
        return;
      }

      const amount0 =
        srcToken === 'token0'
          ? parseUnits(srcTokenFormattedAmount, srcTokenDetails.decimals)
          : parseUnits(dstTokenFormattedAmount, destTokenDetails.decimals);
      const amount1 =
        srcToken === 'token0'
          ? parseUnits(dstTokenFormattedAmount, destTokenDetails.decimals)
          : parseUnits(srcTokenFormattedAmount, srcTokenDetails.decimals);

      if (amount0 > balances[poolDetails.token0.address]) {
        toast.error(`Not enough balance for ${poolDetails.token0.symbol}`);
        return;
      }

      if (amount1 > balances[poolDetails.token1.address]) {
        toast.error(`Not enough balance for ${poolDetails.token1.symbol}`);
        return;
      }

      setTxnInProgress(true);

      await approveToken(amount0, poolDetails.token0.address);
      await approveToken(amount1, poolDetails.token1.address);

      if (lowerTick >= upperTick) {
        throw new Error('tickLower must be less than tickUpper');
      }

      // Check tick spacing
      const tickSpacing = supportedFeeAndTickSpacing.find((item) => item.fee === poolDetails.fee)?.tickSpacing;
      if (lowerTick % poolDetails.tickSpacing !== 0 || upperTick % poolDetails.tickSpacing !== 0) {
        throw new Error(`Ticks must be divisible by tickSpacing (${tickSpacing})`);
      }

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 5); // 5 minutes from now

      // Check deadline
      if (deadline <= Math.floor(Date.now() / 1000)) {
        throw new Error('Deadline must be in the future');
      }

      const callData = UniswapNFTManager.generateMintCallData({
        amount0Desired: amount0,
        amount1Desired: amount1,
        amount0Min: getMinAmount(amount0, Number(slippageTolerance)),
        amount1Min: getMinAmount(amount1, Number(slippageTolerance)),
        deadline,
        fee: poolDetails.fee,
        recipient: account,
        sqrtPriceX96: currentPoolData.sqrtPriceX96,
        tickLower: lowerTick,
        tickSpacing: poolDetails.tickSpacing,
        tickUpper: upperTick,
        token0: poolDetails.token0.address,
        token1: poolDetails.token1.address,
        poolAddress: poolDetails.address,
        isInitialized: currentPoolData.isInitialized,
      });

      const publicClient = getPublicClient(chainId);
      setTxnState('waitingForConfirmation');

      const hash = await sendTransactionAsync({
        account,
        to: nftManagerAddress,
        value: 0n,
        data: callData,
        chainId,
      });
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
      });

      if (receipt?.status !== 'success') {
        throw new Error('Transaction failed');
      }
      toast.success('Liquidity added successfully');
      updateTokensBalance();
      setSrcTokenFormattedAmount('');
      setDstTokenFormattedAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed');
    } finally {
      setTxnInProgress(false);
      setTxnState(null);
    }
  };

  useEffectAfterMount(() => {
    updateLowerPrice(lowerTick);
    updateUpperPrice(upperTick);
  }, [lowerTick, upperTick, currentPoolData, selectedRange]);

  useEffectAfterMount(() => {
    if (!Number(srcTokenFormattedAmount)) {
      setDstTokenFormattedAmount('');
      return;
    }
    setDstTokenFormattedAmount(getDstTokenAmount(srcTokenFormattedAmount));
  }, [lowerTick, upperTick, currentPoolData, srcTokenFormattedAmount]);

  useEffect(() => {
    updateTokensBalance();
  }, [account, srcTokenDetails, destTokenDetails]);

  useEffectAfterMount(() => {
    if (!poolDetails) return;
    if (selectedRange === 'full') {
      setLowerTick(V3PoolUtils.getLowestUsableTick({ tickSpacing: poolDetails.tickSpacing }));
      setUpperTick(V3PoolUtils.getHighestUsableTick({ tickSpacing: poolDetails.tickSpacing }));
    } else {
      setLowerTick(currentPoolData.tick - poolDetails?.tickSpacing);
      setUpperTick(currentPoolData.tick + poolDetails?.tickSpacing);
    }
  }, [selectedRange, currentPoolData, poolDetails]);

  const handleSwitch = () => {
    if (srcToken === 'token0') {
      setSrcToken('token1');
    } else {
      setSrcToken('token0');
    }
    setSrcTokenFormattedAmount('');
    setDstTokenFormattedAmount('');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDataLoading || txnInProgress || !poolDetails?.address) return;
      updateCurrentPoolData(poolDetails.address);
    }, 30000);
    return () => clearInterval(interval);
  }, [isDataLoading, txnInProgress]);

  return {
    lowerTick,
    upperTick,
    srcTokenDetails,
    destTokenDetails,
    srcTokenFormattedAmount,
    setSrcTokenFormattedAmount,
    dstTokenFormattedAmount,
    getDstTokenAmount,
    setDstTokenFormattedAmount,
    isDataLoading,
    setLowerTick,
    setUpperTick,
    slippageTolerance,
    setSlippageTolerance,
    srcToken,
    txnInProgress,
    setSrcToken,
    handleSwitch,
    createPosition,
    currentPoolData,
    setPoolDetails,
    updateCurrentPoolData,
    poolDetails,
    lowerPrice,
    increaseUpperTick,
    decreaseUpperTick,
    increaseLowerTick,
    decreaseLowerTick,
    upperPrice,
    fetchInitialData,
    selectedRange,
    setSelectedRange,
    setCurrentPoolData,
    currentPrice,
    txnState,
    error,
    approvalStatus,
  };
};
