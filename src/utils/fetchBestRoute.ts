import axios from 'axios';
import { Token } from '@/types/tokens';

export const fetchBestRoute = async ({
  tokenIn,
  tokenOut,
  amount,
  recipient,
  slippage,
  deadline,
}: {
  tokenIn: Token;
  tokenOut: Token;
  amount: string;
  recipient: string;
  slippage: string;
  deadline: number;
}) => {
  try {
    const routeUrl = process.env.NEXT_PUBLIC_DEX_SOR_BE_ROUTE;
    if (!routeUrl) {
      throw new Error('NEXT_PUBLIC_DEX_SOR_BE_ROUTE is not defined in environment variables');
    }
    const res = await axios.post(routeUrl, {
      tokenIn,
      tokenOut,
      amount,
      recipient,
      slippage,
      deadline,
    });
    return res.data?.route ?? null;
  } catch (err) {
    console.error('Error fetching best route:', err);
    return null;
  }
};
