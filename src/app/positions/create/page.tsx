import NewPositionsClient from '@/components/position/NewPosition';
import { supportedChainIds } from '@/constants/chains';
import { supportedFeeAndTickSpacing } from '@/constants/fee';
import { getTokenDetails } from '@/helper/token';
import { Token } from '@/types/tokens';
import { isAddress } from 'viem';

interface SearchParams {
  token0?: string;
  token1?: string;
  fee?: string;
  chainId?: string;
}

interface CreatePositionPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function NewPositionsPage({ searchParams }: CreatePositionPageProps) {
  const params = await searchParams;

  const { token0: token0Address, token1: token1Address, fee: feeParam } = params;
  const chainId = supportedChainIds.base;

  // Initialize tokens and fee
  let initialToken0: Token | null = null;
  let initialToken1: Token | null = null;
  let initialFee = 3000; // Default fee

  // Resolve token0
  if (token0Address && isAddress(token0Address)) {
    initialToken0 = await getTokenDetails({ address: token0Address, chainId });
  }

  // Resolve token1
  if (token1Address && isAddress(token1Address)) {
    initialToken1 = await getTokenDetails({ address: token1Address, chainId });
  }

  // Validate and set fee
  if (feeParam) {
    const parsedFee = parseInt(feeParam, 10);
    if (!isNaN(parsedFee) && parsedFee > 0) {
      const supportedFees = supportedFeeAndTickSpacing.map((f) => f.fee);
      if (supportedFees.includes(parsedFee)) {
        initialFee = parsedFee;
      } else {
        console.warn(`Fee ${parsedFee} is not supported. Supported fees: ${supportedFees.join(', ')}`);
      }
    } else {
      console.warn(`Invalid fee parameter: ${feeParam}`);
    }
  }

  return <NewPositionsClient initialToken0={initialToken0} initialToken1={initialToken1} initialFee={initialFee} />;
}
