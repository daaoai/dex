import { Hex } from 'viem';
import { Token } from './tokens';

export type GetUserNFTIdsRequest = {
  account: Hex;
  chainId: number;
  nftManagerAddress: Hex;
};

export type GetUserNFTsForPoolRequest = GetUserNFTIdsRequest & {
  poolAddress: Hex;
  token0: Hex;
  token1: Hex;
  fee: number;
};

export type GetNFTDetailsRequest = {
  chainId: number;
  nftId: bigint;
  nftManagerAddress: Hex;
  owner: Hex;
};

export type V3PositionRaw = {
  tokenId: bigint;
  // nonce: bigint;
  operator: Hex;
  token0: Hex;
  token1: Hex;
  tickSpacing: number;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  // feeGrowthInside0LastX128: bigint;
  // feeGrowthInside1LastX128: bigint;
  // tokensOwed0: bigint;
  // tokensOwed1: bigint;
  feeEarned0: bigint;
  feeEarned1: bigint;
};

export interface V3Position {
  chainId: number;
  token0: Hex;
  token1: Hex;
  poolAddress: Hex;
  isInRange: boolean;
  amount0: string;
  amount1: string;
  liquidity: string;
  token0Details: Token;
  token1Details: Token;
  liquidityUsd: string;
  tokenId: string;
  feeEarned0: string;
  feeEarned1: string;
  fee: number;
  tickSpacing: number;
  tickLower: number;
  tickUpper: number;
  apr: number;
  isInFullRange: boolean;
  token0ToToken1: {
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
  };
  token1ToToken0: {
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
  };
  slot0: {
    sqrtPriceX96: string;
    currentTick: number;
  };
}

export type V3PoolRawData = {
  token0: Hex;
  token1: Hex;
  fee: number;
  tickSpacing: number;
  slot0: {
    sqrtPriceX96: bigint;
    currentTick: number;
  };
};

export type V3PoolDetails = Omit<V3PoolRawData, 'token0' | 'token1'> & {
  token0: Token;
  token1: Token;
  address: Hex;
};

export type CreatePositionParams = {
  poolAddress: Hex;
  token0: Hex;
  token1: Hex;
  fee: number;
  tickSpacing: number;
  tickLower: number;
  tickUpper: number;
  amount0Desired: bigint;
  amount1Desired: bigint;
  amount0Min: bigint;
  amount1Min: bigint;
  recipient: Hex;
  deadline: bigint;
  sqrtPriceX96: bigint;
};

export type DecreaseLiquidityParams = {
  recipient: Hex;
  nftId: bigint;
  liquidityToRemove: bigint;
  amount0Min: bigint;
  amount1Min: bigint;
  burn: boolean;
};
