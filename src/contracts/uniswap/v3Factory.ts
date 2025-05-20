import { uniswapV3FactoryAbi } from '@/abi/uniswap/v3Factory';
import { getPublicClient } from '@/utils/publicClient';
import { Hex } from 'viem';

export class UniswapV3Factory {
  public static async getPoolAddress({
    tokenA,
    tokenB,
    fee,
    factoryAddress,
    chainId,
  }: {
    tokenA: Hex;
    tokenB: Hex;
    fee: number;
    factoryAddress: Hex;
    chainId: number;
  }): Promise<Hex> {
    const publicClient = getPublicClient(chainId);
    const token0 = tokenA < tokenB ? tokenA : tokenB;
    const token1 = tokenA < tokenB ? tokenB : tokenA;
    const poolAddress = await publicClient.readContract({
      address: factoryAddress,
      abi: uniswapV3FactoryAbi,
      functionName: 'getPool',
      args: [token0, token1, fee],
    });
    return poolAddress;
  }
}
