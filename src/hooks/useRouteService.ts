import { RouteService } from '@/services/routeService';
import { RouteApiResponse, RouteParams, RouteRequest } from '@/types/route';
import { useCallback, useState } from 'react';

export const useRouteService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBestRoute = useCallback(
    async ({
      tokenIn,
      tokenOut,
      amount,
      recipient,
      slippage,
      deadline,
    }: RouteParams): Promise<RouteApiResponse | null> => {
      setLoading(true);
      setError(null);

      try {
        const request: RouteRequest = {
          tokenIn: {
            address: tokenIn.address,
            decimals: tokenIn.decimals,
          },
          tokenOut: {
            address: tokenOut.address,
            decimals: tokenOut.decimals,
          },
          amount: amount.toString(),
          recipient,
          slippage: slippage.toString(),
          deadline,
        };

        const response = await RouteService.getBestRoute(request);
        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get best route';
        setError(errorMessage);
        console.error('getBestRoute failed:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    getBestRoute,
    loading,
    error,
  };
};
