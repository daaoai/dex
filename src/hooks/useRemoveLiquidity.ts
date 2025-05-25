import { contractAddresses } from '@/constants/addresses';
import { chainsData } from '@/constants/chains';
import { UniswapNFTManager } from '@/contracts/uniswap/nftManager';
import { UniswapV3Pool } from '@/contracts/uniswap/v3Pool';
import { V3Position } from '@/types/v3';
import { getPublicClient } from '@/utils/publicClient';
import { getMinAmount } from '@/utils/slippage';
import { V3PoolUtils } from '@/utils/v3Pool';
import { toast } from 'react-toastify';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';

const useRemoveLiquidity = ({ chainId }: { chainId: number }) => {
  const { sendTransactionAsync } = useSendTransaction();
  const { switchChainAsync } = useSwitchChain();
  const { chainId: accountChainId, address: account } = useAccount();

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
  };

  const removeLiquidity = async ({ position, percent }: { position: V3Position; percent: number }) => {
    if (!account || !chainId) {
      toast.error('Invalid parameters for decreasing liquidity');
      return;
    }
    const { nftManager } = contractAddresses[chainId];

    let { amount0, amount1 } = position;

    const liquidityToRemove = (position.liquidity * BigInt(percent)) / 100n;

    if (percent < 100) {
      const pool = new UniswapV3Pool(chainId, position.poolAddress);
      const slot0 = await pool.slot0();
      const updatedAmounts = V3PoolUtils.getTokenAmountsForLiquidity({
        liquidity: liquidityToRemove,
        lowerTick: position.tickLower,
        upperTick: position.tickUpper,
        sqrtPriceX96: slot0.sqrtPriceX96,
      });
      amount0 = updatedAmounts.amount0;
      amount1 = updatedAmounts.amount1;
    }

    const amount0Min = getMinAmount(amount0, 0.5);
    const amount1Min = getMinAmount(amount1, 0.5);

    const callData = UniswapNFTManager.generateDecreaseAndCollectCallData({
      amount0Min,
      amount1Min,
      burn: percent === 100,
      liquidityToRemove,
      nftId: position.tokenId,
      recipient: account,
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
      if (!receipt.status) {
        toast.error('Transaction failed');
        return;
      }
      toast.success('Liquidity decreased successfully');
    } catch (error) {
      console.error('Error decreasing liquidity:', error);
      toast.error('Failed to decrease liquidity');
    }
  };

  return {
    decreaseLiquidity: removeLiquidity,
  };
};

export default useRemoveLiquidity;
