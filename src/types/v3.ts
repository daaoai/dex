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
};

export type V3PositionRaw = {
  id: bigint;
  nonce: bigint;
  operator: Hex;
  token0: Hex;
  token1: Hex;
  tickSpacing: number;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  feeGrowthInside1LastX128: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
};

export interface V3Position {
  token0: Hex;
  token1: Hex;
  poolAddress: Hex;
  amount0: bigint;
  amount1: bigint;
  liquidity: bigint;
  token0Details: Token;
  token1Details: Token;
  liquidityUsd: string;
  tokenId: bigint;
  fee: number;
  tickLower: number;
  tickUpper: number;
  apr: number;
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

export type AddLiquidityParams = {
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
