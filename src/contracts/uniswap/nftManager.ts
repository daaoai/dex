import { uniswapV3NftManagerAbi } from '@/abi/uniswap/nftManager';
import { multicallForSameContract } from '@/helper/multicall';
import {
  CreatePositionParams,
  DecreaseLiquidityParams,
  GetNFTDetailsRequest,
  GetUserNFTIdsRequest,
  GetUserNFTsForPoolRequest,
  V3PositionRaw,
} from '@/types/v3';
import { getDeadline } from '@/utils/deadline';
import { getPublicClient } from '@/utils/publicClient';
import { encodeFunctionData, Hex, maxUint128, zeroAddress } from 'viem';

export class UniswapNFTManager {
  public static generateMintCallData = ({
    token0,
    token1,
    tickLower,
    tickUpper,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
    recipient,
    sqrtPriceX96,
    deadline,
    fee,
    poolAddress,
  }: CreatePositionParams) => {
    const mintCallData = encodeFunctionData({
      abi: uniswapV3NftManagerAbi,
      functionName: 'mint',
      args: [
        {
          amount0Desired,
          amount0Min,
          amount1Desired,
          amount1Min,
          deadline,
          recipient,
          fee,
          tickLower,
          tickUpper,
          token0,
          token1,
        },
      ],
    });

    if (poolAddress === zeroAddress) {
      const createPoolCallData = encodeFunctionData({
        abi: uniswapV3NftManagerAbi,
        functionName: 'createAndInitializePoolIfNecessary',
        args: [token0, token1, fee, sqrtPriceX96],
      });
      return encodeFunctionData({
        abi: uniswapV3NftManagerAbi,
        functionName: 'multicall',
        args: [[createPoolCallData, mintCallData]],
      });
    }
    return mintCallData;
  };

  public static getUserNFTIds = async ({ account, chainId, nftManagerAddress }: GetUserNFTIdsRequest) => {
    const publicClient = getPublicClient(chainId);
    const totalNftIds = Number(
      await publicClient.readContract({
        address: nftManagerAddress,
        abi: uniswapV3NftManagerAbi,
        functionName: 'balanceOf',
        args: [account],
      }),
    );

    const nftIds = (await multicallForSameContract({
      abi: uniswapV3NftManagerAbi,
      address: nftManagerAddress,
      chainId,
      functionNames: Array.from({ length: totalNftIds }, () => 'tokenOfOwnerByIndex'),
      params: Array.from({ length: totalNftIds }, (_, i) => [account, i]),
    })) as bigint[];

    return nftIds;
  };

  public static getUserNFTsForPool = async ({
    account,
    chainId,
    fee,
    token0,
    token1,
    nftManagerAddress,
  }: GetUserNFTsForPoolRequest): Promise<V3PositionRaw[]> => {
    const nftIds = await this.getUserNFTIds({ account, chainId, nftManagerAddress });
    const userNfts = (await multicallForSameContract({
      abi: uniswapV3NftManagerAbi,
      address: nftManagerAddress,
      chainId,
      functionNames: new Array(nftIds.length).fill('positions'),
      params: nftIds.map((nftId) => [nftId]),
    })) as [bigint, Hex, Hex, Hex, number, number, number, bigint, bigint, bigint, bigint, bigint][];

    const userNftsWithId: V3PositionRaw[] = [];

    userNfts.forEach((nft, index) => {
      {
        if (nft[2] !== token0 || nft[3] !== token1 || nft[4] !== fee) {
          return;
        }
        userNftsWithId.push({
          id: nftIds[index],
          nonce: nft[0],
          operator: nft[1],
          token0: nft[2],
          token1: nft[3],
          fee: nft[4],
          tickSpacing: 0, // Uniswap V3 does not use tick spacing in the same way as Velodrome
          tickLower: nft[5],
          tickUpper: nft[6],
          liquidity: nft[7],
          feeGrowthInside0LastX128: nft[8],
          feeGrowthInside1LastX128: nft[9],
          tokensOwed0: nft[10],
          tokensOwed1: nft[11],
        });
      }
    });

    return userNftsWithId;
  };

  public static getUserNFTs = async ({
    account,
    chainId,
    nftManagerAddress,
  }: {
    account: Hex;
    chainId: number;
    nftManagerAddress: Hex;
  }): Promise<V3PositionRaw[]> => {
    const nftIds = await this.getUserNFTIds({ account, chainId, nftManagerAddress });
    const userNfts = (await multicallForSameContract({
      abi: uniswapV3NftManagerAbi,
      address: nftManagerAddress,
      chainId,
      functionNames: new Array(nftIds.length).fill('positions'),
      params: nftIds.map((nftId) => [nftId]),
    })) as [bigint, Hex, Hex, Hex, number, number, number, bigint, bigint, bigint, bigint, bigint][];

    const userNftsWithId: V3PositionRaw[] = [];

    userNfts.forEach((nft, index) => {
      {
        userNftsWithId.push({
          id: nftIds[index],
          nonce: nft[0],
          operator: nft[1],
          token0: nft[2],
          token1: nft[3],
          fee: nft[4],
          tickSpacing: 0, // Uniswap V3 does not use tick spacing in the same way as Velodrome
          tickLower: nft[5],
          tickUpper: nft[6],
          liquidity: nft[7],
          feeGrowthInside0LastX128: nft[8],
          feeGrowthInside1LastX128: nft[9],
          tokensOwed0: nft[10],
          tokensOwed1: nft[11],
        });
      }
    });

    return userNftsWithId;
  };

  public static getNFTDetails = async ({
    nftId,
    nftManagerAddress,
    chainId,
  }: GetNFTDetailsRequest): Promise<V3PositionRaw> => {
    const publicClient = getPublicClient(chainId);
    const res = await publicClient.readContract({
      address: nftManagerAddress,
      abi: uniswapV3NftManagerAbi,
      functionName: 'positions',
      args: [nftId],
    });
    return {
      id: nftId,
      nonce: res[0],
      operator: res[1],
      token0: res[2],
      token1: res[3],
      fee: res[4],
      tickSpacing: 0, // Uniswap V3 does not use tick spacing in the same way as Velodrome
      tickLower: res[5],
      tickUpper: res[6],
      liquidity: res[7],
      feeGrowthInside0LastX128: res[8],
      feeGrowthInside1LastX128: res[9],
      tokensOwed0: res[10],
      tokensOwed1: res[11],
    };
  };

  public static generateDecreaseAndCollectCallData = ({
    nftId,
    liquidityToRemove,
    amount0Min,
    amount1Min,
    recipient,
    burn,
  }: DecreaseLiquidityParams) => {
    const deadline = getDeadline(60 * 60); // 1 hour from now
    const decreaseLiquidityCallData = encodeFunctionData({
      abi: uniswapV3NftManagerAbi,
      functionName: 'decreaseLiquidity',
      args: [
        {
          amount0Min,
          amount1Min,
          liquidity: liquidityToRemove,
          tokenId: nftId,
          deadline,
        },
      ],
    });

    const collectCallData = encodeFunctionData({
      abi: uniswapV3NftManagerAbi,
      functionName: 'collect',
      args: [
        {
          amount0Max: maxUint128,
          amount1Max: maxUint128,
          recipient,
          tokenId: nftId,
        },
      ],
    });

    const args = [decreaseLiquidityCallData, collectCallData];

    if (burn) {
      const burnCallData = encodeFunctionData({
        abi: uniswapV3NftManagerAbi,
        functionName: 'burn',
        args: [nftId],
      });
      args.push(burnCallData);
    }

    return encodeFunctionData({
      abi: uniswapV3NftManagerAbi,
      functionName: 'multicall',
      args: [args],
    });
  };

  public static generateAddLiquidityCallData = ({
    tokenId,
    amount0Desired,
    amount1Desired,
    amount0Min,
    amount1Min,
  }: {
    tokenId: bigint;
    amount0Desired: bigint;
    amount1Desired: bigint;
    amount0Min: bigint;
    amount1Min: bigint;
  }): Hex => {
    return encodeFunctionData({
      abi: uniswapV3NftManagerAbi,
      functionName: 'increaseLiquidity',
      args: [
        {
          amount0Desired,
          amount0Min,
          amount1Desired,
          amount1Min,
          tokenId,
          deadline: getDeadline(60 * 60), // 1 hour from now
        },
      ],
    });
  };
}
