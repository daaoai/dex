import { contractAddresses } from '@/constants/addresses';
import { UniswapV3Factory } from '@/contracts/uniswap/v3Factory';
import { Hex } from 'viem';

export const useAddLiquidity = ({ chainId }: { chainId: number }) => {
  const { v3Factory } = contractAddresses[chainId];

  const getPool = async (token0: Hex, token1: Hex, fee: number) => {
    const poolAddress = await UniswapV3Factory.getPoolAddress({
      chainId,
      factoryAddress: v3Factory,
      tokenA: token0,
      tokenB: token1,
      fee,
    });
    return poolAddress;
  };

  return {
    getPool,
  };
};
