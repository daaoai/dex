import { baseURL } from '@/constants/app';
import { PoolDetails } from '@/types/pools';

/**
 * Fetches detailed pool data from the backend API
 * @param poolId - The pool ID to fetch details for
 * @returns Promise<PoolDetails | null> - Detailed pool data or null if not found
 */
export const fetchPoolDetails = async (poolId: string): Promise<PoolDetails | null> => {
  try {
    const response = await fetch(`${baseURL}/api/pool/${poolId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Pool not found for pool ID: ${poolId}`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const poolDetails = await response.json();
    return poolDetails;
  } catch (error) {
    console.error('Error fetching pool details from API:', error);
    return null;
  }
};
