import { Hex } from 'viem';

export type GetUserNFTIdsRequest = {
  account: Hex;
  chainId: number;
  poolAddress: Hex;
  nftManagerAddress: Hex;
};

export type GetUserNFTsForPoolRequest = GetUserNFTIdsRequest & {
  token0: Hex;
  token1: Hex;
  fee: number;
};

export type GetNFTDetailsRequest = {
  chainId: number;
  nftId: bigint;
  nftManagerAddress: Hex;
};

export type V3Position = {
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

export type V3PoolDetails = {
  token0: Hex;
  token1: Hex;
  fee: number;
  tickSpacing: number;
  slot0: {
    sqrtPriceX96: bigint;
    currentTick: number;
  };
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

export type PoolDetails = {
  address: Hex;
  token0: {
    address: Hex;
    decimals: number;
  };
  token1: {
    address: Hex;
    decimals: number;
  };
  fee: number;
  tickSpacing: number;
};
