import { contractAddresses } from '@/constants/addresses';
import { chainsData } from '@/constants/chains';
import { UniswapNFTManager } from '@/contracts/uniswap/nftManager';
import { V3Position } from '@/types/v3';
import { getPublicClient } from '@/utils/publicClient';
import { toast } from 'react-toastify';
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi';

const useHarvestLiquidity = ({ chainId }: { chainId: number }) => {
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

  const harvestLiquidity = async ({ position }: { position: V3Position }) => {
    if (!account || !chainId) {
      toast.error('Invalid parameters for decreasing liquidity');
      return;
    }
    const { nftManager } = contractAddresses[chainId];
    if (accountChainId !== chainId) {
      const switched = await switchChain();
      if (!switched) return;
    }

    const callData = UniswapNFTManager.generateCollectCallData({
      tokenId: position.tokenId,
      recipient: account,
    });
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
      toast.success('Fees harvested successfully');
    } catch (error) {
      console.error('Error harvesting liquidity:', error);
      toast.error('Failed to collect fees');
    }
  };

  return {
    harvestLiquidity,
  };
};

export default useHarvestLiquidity;
