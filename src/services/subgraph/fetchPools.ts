import { baseURL } from '@/constants/app';
import { TopPool } from '@/types/pools';

/**
 * Fetches top pools data from the backend API
 * @returns Promise<TopPool[]> - Array of top pools ordered by volume
 */
export const fetchTopPoolsFromGraph = async (): Promise<TopPool[]> => {
  try {
    const response = await fetch(`${baseURL}/api/pools`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const pools = await response.json();
    return pools;
  } catch (error) {
    console.error('Error fetching top pools from API:', error);
    return [];
  }
};
