import { contractAddresses } from '@/constants/addresses';
import { UniswapNFTManager } from '@/contracts/uniswap/nftManager';
import { UniswapV3Factory } from '@/contracts/uniswap/v3Factory';
import { UniswapV3Pool } from '@/contracts/uniswap/v3Pool';
import { getTokenDetails } from '@/helper/token';
import { Token } from '@/types/tokens';
import { V3PoolDetails, V3Position, V3PositionRaw } from '@/types/v3';
import { V3PoolUtils } from '@/utils/v3Pool';
import { formatUnits, Hex } from 'viem';
import { useAccount } from 'wagmi';

export const usePositions = (chainId: number) => {
  const { address } = useAccount();
  const { nftManager, v3Factory } = contractAddresses[chainId];

  const formatPositionDetails = (position: V3PositionRaw, poolDetails: V3PoolDetails): V3Position => {
    const { amount0, amount1 } = V3PoolUtils.getTokenAmountsForLiquidity({
      liquidity: position.liquidity,
      lowerTick: position.tickLower,
      upperTick: position.tickUpper,
      sqrtPriceX96: poolDetails.slot0.sqrtPriceX96,
    });
    const token0Price = 0;
    const token1Price = 0; // Placeholder for token prices, should be fetched from a price oracle or API
    const formattedAmount0 = Number(formatUnits(amount0, poolDetails.token0.decimals));
    const formattedAmount1 = Number(formatUnits(amount1, poolDetails.token1.decimals));
    const token0Amount = formattedAmount0 * token0Price;
    const token1Amount = formattedAmount1 * token1Price;
    const liquidityUsd = (token0Amount + token1Amount).toFixed(4);
    const currentPrice = V3PoolUtils.getPriceFromSqrtRatio({
      decimal0: poolDetails.token0.decimals,
      decimal1: poolDetails.token1.decimals,
      sqrtPriceX96: poolDetails.slot0.sqrtPriceX96,
    });
    const minPrice = V3PoolUtils.getPriceFromTick({
      decimal0: poolDetails.token0.decimals,
      decimal1: poolDetails.token1.decimals,
      tick: position.tickLower,
    });
    const maxPrice = V3PoolUtils.getPriceFromTick({
      decimal0: poolDetails.token0.decimals,
      decimal1: poolDetails.token1.decimals,
      tick: position.tickUpper,
    });
    const apr = 0; // Placeholder for APR calculation
    return {
      ...position,
      slot0: {
        sqrtPriceX96: poolDetails.slot0.sqrtPriceX96.toString(),
        currentTick: poolDetails.slot0.currentTick,
      },
      isInRange:
        poolDetails.slot0.currentTick <= position.tickUpper && poolDetails.slot0.currentTick >= position.tickLower,
      chainId,
      liquidity: position.liquidity.toString(),
      poolAddress: poolDetails.address,
      feeEarned0: position.feeEarned0.toString(),
      feeEarned1: position.feeEarned1.toString(),
      token0Details: poolDetails.token0,
      token1Details: poolDetails.token1,
      liquidityUsd,
      tokenId: position.tokenId.toString(),
      amount0: amount0.toString(),
      amount1: amount1.toString(),
      isInFullRange:
        position.tickLower ===
          V3PoolUtils.getLowestUsableTick({
            tickSpacing: poolDetails.tickSpacing,
          }) &&
        position.tickUpper ===
          V3PoolUtils.getHighestUsableTick({
            tickSpacing: poolDetails.tickSpacing,
          }),
      token0ToToken1: {
        currentPrice,
        minPrice,
        maxPrice,
      },
      token1ToToken0: {
        currentPrice: 1 / currentPrice,
        minPrice: 1 / maxPrice,
        maxPrice: 1 / minPrice,
      },
      apr,
    };
  };

  const fetchPositions = async (): Promise<V3Position[]> => {
    if (!address || !chainId || !nftManager) {
      return [];
    }

    try {
      const positions = await UniswapNFTManager.getUserNFTs({
        account: address,
        chainId,
        nftManagerAddress: nftManager,
      });

      const tokensForDetails = new Set<Hex>();
      positions.forEach((pos) => {
        tokensForDetails.add(pos.token0);
        tokensForDetails.add(pos.token1);
      });

      const tokenDetailsRes = await Promise.all(
        Array.from(tokensForDetails).map(async (tokenAddress) => {
          return getTokenDetails({ address: tokenAddress, chainId });
        }),
      );

      const tokenDetails = tokenDetailsRes.reduce(
        (acc, details) => {
          if (details) {
            acc[details.address] = details;
          }
          return acc;
        },
        {} as Record<string, Token>,
      );

      const poolAddresses = await UniswapV3Factory.getPoolsAddresses(
        chainId,
        v3Factory,
        positions.map((pos) => ({
          token0: pos.token0,
          token1: pos.token1,
          fee: pos.fee,
        })),
      );

      const poolDetails = await UniswapV3Pool.getV3PoolsDetails(chainId, poolAddresses);

      const formattedPositions = positions.map((pos, index) => {
        const token0Details = tokenDetails[pos.token0];
        const token1Details = tokenDetails[pos.token1];
        const poolDetail = poolDetails[index];

        return formatPositionDetails(pos, {
          ...poolDetail,
          fee: pos.fee,
          token0: token0Details,
          token1: token1Details,
          address: poolAddresses[index],
          slot0: {
            sqrtPriceX96: poolDetail.slot0.sqrtPriceX96,
            currentTick: poolDetail.slot0.currentTick,
          },
          tickSpacing: poolDetail.tickSpacing,
        });
      });
      return formattedPositions;
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  };

  const fetchPositionWithId = async (tokenId: bigint): Promise<V3Position | null> => {
    if (!address || !chainId || !nftManager) {
      return null;
    }
    try {
      const position = await UniswapNFTManager.getNFTDetails({
        nftId: tokenId,
        chainId,
        nftManagerAddress: nftManager,
        owner: address,
      });
      if (!position) {
        return null;
      }

      const [poolAddress, token0Details, token1Details] = await Promise.all([
        UniswapV3Factory.getPoolAddress({
          tokenA: position.token0,
          tokenB: position.token1,
          fee: position.fee,
          factoryAddress: contractAddresses[chainId].v3Factory,
          chainId,
        }),
        getTokenDetails({ address: position.token0, chainId }),
        getTokenDetails({ address: position.token1, chainId }),
      ]);

      if (!poolAddress) {
        console.error(`Pool not found for token ID ${tokenId}`);
        return null;
      }

      const poolDetails = (await UniswapV3Pool.getV3PoolsDetails(chainId, [poolAddress]))[0];

      if (!poolDetails) {
        console.error(`Pool details not found for address ${poolAddress}`);
        return null;
      }

      const formattedPosition = formatPositionDetails(position, {
        ...poolDetails,
        fee: position.fee,
        token0: token0Details,
        token1: token1Details,
        address: poolAddress,
      });
      return formattedPosition;
    } catch (error) {
      console.error('Error fetching position with ID:', error);
      return null;
    }
  };

  return { fetchPositions, fetchPositionWithId };
};
