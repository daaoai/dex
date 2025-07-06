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

export const useCreatePosition = ({ chainId }: { chainId: number }) => {
  const [token0FormattedAmount, setToken0FormattedAmount] = useState('');
  const [token1FormattedAmount, setToken1FormattedAmount] = useState('');
  const [selectedRange, setSelectedRange] = useState<'full' | 'custom'>('full');
  const [balances, setBalances] = useState<{ [key: string]: bigint }>({});
  const [slippageTolerance, setSlippageTolerance] = useState(1);
  const [srcToken, setSrcToken] = useState<'token0' | 'token1'>('token0');
  const [inputAmountForToken, setInputAmountForToken] = useState<'token0' | 'token1'>('token0');
  const [lowerPrice, setLowerPrice] = useState(0);
  const [upperPrice, setUpperPrice] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lowerTick, setLowerTick] = useState(0);
  const [upperTick, setUpperTick] = useState(0);
  const [poolDetails, setPoolDetails] = useState<Omit<V3PoolDetails, 'slot0'> | null>(null);
  const [currentPoolData, setCurrentPoolData] = useState<CurrentPoolData>({
    tick: 0,
    sqrtPriceX96: 0n,
    isInitialized: true,
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
  const wNativeToken = chainsData[chainId].wnativeToken;
  const nativeToken = chainsData[chainId].nativeCurrency;

  const updateCurrentPoolData = async (poolAddress: Hex, poolDetails: Omit<V3PoolDetails, 'slot0'>) => {
    try {
      const pool = new UniswapV3Pool(chainId, poolAddress);
      setIsDataLoading(true);
      const [{ currentTick, sqrtPriceX96 }, liquidity] = await Promise.all([pool.slot0(), pool.liquidity()]);

      setCurrentPoolData({
        tick: currentTick,
        sqrtPriceX96,
        isInitialized: sqrtPriceX96 > 0n,
      });
      updateCurrentPrice(sqrtPriceX96, poolDetails);

      return {
        tick: currentTick,
        sqrtPriceX96,
        liquidity,
        isInitialized: sqrtPriceX96 > 0n,
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
          tokenA: token0 === nativeToken.address ? wNativeToken.address : token0,
          tokenB: token1 === nativeToken.address ? wNativeToken.address : token1,
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
      const tickSpacing = supportedFeeAndTickSpacing.find((item) => item.fee === fee)?.tickSpacing || 0;

      const poolDetails = {
        address: poolAddress,
        token0: token0Details,
        token1: token1Details,
        fee,
        tickSpacing,
      };
      setPoolDetails(() => poolDetails);
      if (poolAddress !== zeroAddress) {
        const currentPoolData = await updateCurrentPoolData(poolAddress, poolDetails);
        if (currentPoolData && currentPoolData.isInitialized) {
          // Pool is initialized
          setCurrentPoolData({
            tick: currentPoolData.tick,
            sqrtPriceX96: currentPoolData.sqrtPriceX96,
            isInitialized: true,
          });
          setLowerTick(
            V3PoolUtils.nearestUsableTick({ tick: currentPoolData.tick - poolDetails.tickSpacing, tickSpacing }),
          );
          setUpperTick(
            V3PoolUtils.nearestUsableTick({ tick: currentPoolData.tick + poolDetails.tickSpacing, tickSpacing }),
          );
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
    price: number = 0.5, // Default price if not provided
  ) => {
    // Set default values for uninitialized pool
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
    setToken0FormattedAmount('');
    setToken1FormattedAmount('');
    setLowerTick(
      V3PoolUtils.nearestUsableTick({
        tick: currentTick - poolDetails.tickSpacing,
        tickSpacing: poolDetails.tickSpacing,
      }),
    );
    setUpperTick(
      V3PoolUtils.nearestUsableTick({
        tick: currentTick + poolDetails.tickSpacing,
        tickSpacing: poolDetails.tickSpacing,
      }),
    );
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

  const updateCurrentPrice = (sqrtPrice: bigint, details?: Omit<V3PoolDetails, 'slot0'>) => {
    const info = details || poolDetails;
    if (!info) return;
    const currentPrice = V3PoolUtils.getPriceFromSqrtRatio({
      decimal0: info.token0.decimals,
      decimal1: info.token1.decimals,
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

  const getToken1Amount = (formattedToken0Amount: string) => {
    if (!poolDetails) return '0';
    if (!Number(formattedToken0Amount)) return '0';
    return V3PoolUtils.getToken1Amount({
      decimal0: poolDetails.token0.decimals,
      decimal1: poolDetails.token1.decimals,
      formattedToken0Amount: Number(formattedToken0Amount),
      lowerTick,
      sqrtPriceX96: currentPoolData.sqrtPriceX96,
      upperTick,
    });
  };

  const getToken0Amount = (formattedToken1mount: string) => {
    if (!poolDetails) return '0';
    if (!Number(formattedToken1mount)) return '0';
    return V3PoolUtils.getToken0Amount({
      decimal0: poolDetails.token0.decimals,
      decimal1: poolDetails.token1.decimals,
      formattedToken1Amount: Number(formattedToken1mount),
      lowerTick,
      sqrtPriceX96: currentPoolData.sqrtPriceX96,
      upperTick,
    });
  };

  const updateTokensBalance = async () => {
    if (!account || !srcTokenDetails || !destTokenDetails) return;
    const balance = await getTokensBalance(
      [srcTokenDetails.address, destTokenDetails.address, nativeToken.address],
      chainId,
      account,
    );
    setBalances(balance);
    return balance;
  };

  const approveToken = async (amount: bigint, token: Hex) => {
    if (!account || token === nativeToken.address) return;
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
    if (srcToken === 'token0') {
      setUpperTick((prev) => prev + poolDetails.tickSpacing);
    } else {
      setLowerTick((prev) => prev - poolDetails.tickSpacing);
    }
  };

  const decreaseUpperTick = async () => {
    if (!poolDetails) return;
    if (srcToken === 'token0') {
      setUpperTick((prev) => prev - poolDetails.tickSpacing);
    } else {
      setLowerTick((prev) => prev + poolDetails.tickSpacing);
    }
  };
  const increaseLowerTick = async () => {
    if (!poolDetails) return;
    if (srcToken === 'token0') {
      setLowerTick((prev) => prev + poolDetails.tickSpacing);
    } else {
      setUpperTick((prev) => prev - poolDetails.tickSpacing);
    }
  };
  const decreaseLowerTick = async () => {
    if (!poolDetails) return;
    if (srcToken === 'token0') {
      setLowerTick((prev) => prev - poolDetails.tickSpacing);
    } else {
      setUpperTick((prev) => prev + poolDetails.tickSpacing);
    }
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

      if (!Number(token0FormattedAmount) || !Number(token1FormattedAmount)) {
        toast.error('Please enter valid amounts');
        return;
      }

      const token0Details = poolDetails.token0;
      const token1Details = poolDetails.token1;

      const amount0 = parseUnits(token0FormattedAmount, token0Details.decimals);
      const amount1 = parseUnits(token1FormattedAmount, token1Details.decimals);

      if (amount0 > balances[token0Details.address]) {
        toast.error(`Not enough balance for ${token0Details.symbol}`);
        return;
      }

      if (amount1 > balances[token1Details.address]) {
        toast.error(`Not enough balance for ${token1Details.symbol}`);
        return;
      }

      setTxnInProgress(true);

      await approveToken(amount0, token0Details.address);
      await approveToken(amount1, token1Details.address);

      if (lowerTick >= upperTick) {
        throw new Error('tickLower must be less than tickUpper');
      }

      if (lowerTick % poolDetails.tickSpacing !== 0 || upperTick % poolDetails.tickSpacing !== 0) {
        throw new Error(`Ticks must be divisible by tickSpacing (${poolDetails.tickSpacing})`);
      }

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 5); // 5 minutes from now

      // Check deadline
      if (deadline <= Math.floor(Date.now() / 1000)) {
        throw new Error('Deadline must be in the future');
      }

      const value =
        nativeToken.address === token0Details.address
          ? amount0
          : nativeToken.address === token1Details.address
            ? amount1
            : 0n;

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
        token0: token0Details.address === nativeToken.address ? wNativeToken.address : token0Details.address,
        token1: token1Details.address === nativeToken.address ? wNativeToken.address : token1Details.address,
        poolAddress: poolDetails.address,
        isInitialized: currentPoolData.isInitialized,
        value,
      });

      const publicClient = getPublicClient(chainId);
      setTxnState('waitingForConfirmation');

      const hash = await sendTransactionAsync({
        account,
        to: nftManagerAddress,
        value,
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
      setToken0FormattedAmount('');
      setToken1FormattedAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
      toast.error('Transaction failed');
    } finally {
      setTxnInProgress(false);
      setTxnState(null);
    }
  };

  const handleSwitch = () => {
    if (srcToken === 'token0') {
      setSrcToken('token1');
    } else {
      setSrcToken('token0');
    }
    setToken0FormattedAmount('');
    setToken1FormattedAmount('');
  };

  useEffectAfterMount(() => {
    updateLowerPrice(lowerTick);
    updateUpperPrice(upperTick);

    if (inputAmountForToken === 'token0') {
      if (!Number(token0FormattedAmount)) {
        setToken1FormattedAmount('');
        return;
      }
      setToken1FormattedAmount(getToken1Amount(token0FormattedAmount));
    } else {
      if (!Number(token1FormattedAmount)) {
        setToken0FormattedAmount('');
        return;
      }
      setToken0FormattedAmount(getToken0Amount(token1FormattedAmount));
    }
  }, [lowerTick, upperTick, currentPoolData, selectedRange]);

  useEffect(() => {
    updateTokensBalance();
  }, [account, srcTokenDetails, destTokenDetails]);

  useEffectAfterMount(() => {
    if (!poolDetails) return;
    if (selectedRange === 'full') {
      setLowerTick(V3PoolUtils.getLowestUsableTick({ tickSpacing: poolDetails.tickSpacing }));
      setUpperTick(V3PoolUtils.getHighestUsableTick({ tickSpacing: poolDetails.tickSpacing }));
    } else {
      if (!currentPoolData.tick || !poolDetails.tickSpacing) return;
      setLowerTick(
        V3PoolUtils.nearestUsableTick({
          tick: currentPoolData.tick - poolDetails.tickSpacing,
          tickSpacing: poolDetails.tickSpacing,
        }),
      );
      setUpperTick(
        V3PoolUtils.nearestUsableTick({
          tick: currentPoolData.tick + poolDetails.tickSpacing,
          tickSpacing: poolDetails.tickSpacing,
        }),
      );
    }
  }, [selectedRange, poolDetails]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDataLoading || txnInProgress || !poolDetails?.address) return;
      updateCurrentPoolData(poolDetails.address, poolDetails);
    }, 30000);
    return () => clearInterval(interval);
  }, [isDataLoading, txnInProgress]);

  useEffectAfterMount(() => {
    updateCurrentPrice(currentPoolData.sqrtPriceX96);
    updateLowerPrice(lowerTick);
    updateUpperPrice(upperTick);
  }, [srcToken]);

  return {
    lowerTick,
    upperTick,
    srcTokenDetails,
    destTokenDetails,
    setInputAmountForToken,
    token0FormattedAmount,
    setToken0FormattedAmount,
    balances,
    token1FormattedAmount,
    setToken1FormattedAmount,
    getToken0Amount,
    getToken1Amount,
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
    handleUninitializedPool,
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
