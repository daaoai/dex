import { contractAddresses } from '@/constants/addresses';
import { UniswapNFTManager } from '@/contracts/uniswap/nftManager';
import { UniswapV3Factory } from '@/contracts/uniswap/v3Factory';
import { UniswapV3Pool } from '@/contracts/uniswap/v3Pool';
import { getTokenDetails } from '@/helper/erc20';
import { Token } from '@/types/tokens';
import { V3PoolDetails, V3Position, V3PositionRaw } from '@/types/v3';
import { V3PoolUtils } from '@/utils/v3Pool';
import { useEffect, useState } from 'react';
import { formatUnits, Hex } from 'viem';
import { useAccount } from 'wagmi';

export const usePositions = (chainId: number) => {
  const { address } = useAccount();
  const { nftManager, v3Factory } = contractAddresses[chainId];
  const [positions, setPositions] = useState<V3Position[]>([]);
  const [loading, setLoading] = useState(true);

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
    const apr = 0; // Placeholder for APR calculation
    return {
      ...position,
      poolAddress: poolDetails.address,
      token0Details: poolDetails.token0,
      token1Details: poolDetails.token1,
      liquidityUsd,
      tokenId: position.id,
      amount0,
      amount1,
      apr,
    };
  };

  useEffect(() => {
    const fetchPositions = async () => {
      if (!address || !chainId || !nftManager) {
        setPositions([]);
        setLoading(false);
        return;
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

        setPositions(formattedPositions);
      } catch (error) {
        console.error('Error fetching positions:', error);
        setPositions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [address, chainId, nftManager, v3Factory]);

  return { positions, loading };
};
