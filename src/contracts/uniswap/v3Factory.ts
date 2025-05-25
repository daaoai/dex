import { uniswapV3FactoryAbi } from '@/abi/uniswap/v3Factory';
import { multicallForSameContract } from '@/helper/multicall';
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

  public static async getPoolsAddresses(
    chainId: number,
    factoryAddress: Hex,
    pools: {
      token0: Hex;
      token1: Hex;
      fee: number;
    }[],
  ): Promise<Hex[]> {
    const multicallRes = (await multicallForSameContract({
      abi: uniswapV3FactoryAbi,
      address: factoryAddress,
      chainId,
      functionNames: Array(pools.length).fill('getPool'),
      params: pools.map(({ token0, token1, fee }) => [token0, token1, fee]),
    })) as Hex[];
    return multicallRes;
  }
}
