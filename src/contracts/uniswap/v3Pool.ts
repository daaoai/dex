import { uniswapV3PoolAbi } from '@/abi/uniswap/v3Pool';
import { supportedFeeAndTickSpacing } from '@/constants/fee';
import { multicallForSameContract, multicallWithSameAbi } from '@/helper/multicall';
import { V3PoolRawData } from '@/types/v3';
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

  liquidity = async () => {
    const liquidity = (await this.publicClient.readContract({
      abi: this.abi,
      functionName: 'liquidity',
      args: [],
      address: this.address,
    })) as bigint;
    return liquidity;
  };

  getV3PoolDetails = async (): Promise<V3PoolRawData> => {
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

  public static getV3PoolsDetails = async (chainId: number, poolAddresses: Hex[]): Promise<V3PoolRawData[]> => {
    const methods = ['token0', 'token1', 'slot0', 'tickSpacing', 'fee'];

    // Create arrays of methods and empty params for each pool
    const allMethods: string[] = [];
    const allParams: unknown[][] = [];
    poolAddresses.forEach(() => {
      methods.forEach((method) => {
        allMethods.push(method);
        allParams.push([]);
      });
    });

    const multicallRes = await multicallWithSameAbi({
      abi: uniswapV3PoolAbi,
      chainId,
      allMethods,
      allParams,
      contracts: poolAddresses.map((address) => Array(methods.length).fill(address)).flat(),
    });

    // Map results to pool details in chunks
    return Array.from({ length: poolAddresses.length }, (_, i) => ({
      token0: multicallRes[i * methods.length] as Hex,
      token1: multicallRes[i * methods.length + 1] as Hex,
      slot0: {
        sqrtPriceX96: (multicallRes[i * methods.length + 2] as [bigint, number])[0],
        currentTick: (multicallRes[i * methods.length + 2] as [bigint, number])[1],
      },
      tickSpacing:
        (multicallRes[i * methods.length + 3] as number) ||
        supportedFeeAndTickSpacing.find((item) => item.fee === (multicallRes[i * methods.length + 4] as number))
          ?.tickSpacing ||
        0,
      fee: multicallRes[i * methods.length + 4] as number,
    }));
  };
}
