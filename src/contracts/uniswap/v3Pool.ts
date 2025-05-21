import { uniswapV3PoolAbi } from '@/abi/uniswap/v3Pool';
import { multicallForSameContract } from '@/helper/multicall';
import { V3PoolDetails } from '@/types/v3';
import { getPublicClient } from '@/utils/publicClient';
import { Abi, Hex, PublicClient } from 'viem';

export class UniswapV3Pool {
  address: Hex;
  chainId: number;
  publicClient: PublicClient;
  abi: Abi;

  constructor(chainId: number, address: Hex, abi: Abi = uniswapV3PoolAbi) {
    this.abi = abi;
    this.chainId = chainId;
    this.address = address;
    this.publicClient = getPublicClient(chainId);
  }

  slot0 = async () => {
    const slot0 = (await this.publicClient.readContract({
      abi: this.abi,
      functionName: 'slot0',
      args: [],
      address: this.address,
    })) as [bigint, number];
    return {
      sqrtPriceX96: slot0[0],
      currentTick: slot0[1],
    };
  };

  getV3PoolDetails = async (): Promise<V3PoolDetails> => {
    const methods = ['token0', 'token1', 'slot0', 'tickSpacing', 'fee'];
    const multicallRes = (await multicallForSameContract({
      abi: this.abi,
      address: this.address,
      chainId: this.chainId,
      functionNames: methods,
      params: methods.map(() => []),
    })) as [Hex, Hex, [bigint, number], number, number];

    return {
      token0: multicallRes[0],
      token1: multicallRes[1],
      slot0: {
        sqrtPriceX96: multicallRes[2][0],
        currentTick: multicallRes[2][1],
      },
      tickSpacing: multicallRes[3],
      fee: multicallRes[4],
    };
  };
}
