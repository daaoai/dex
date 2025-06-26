'use client';

import { fetchTokenBalance } from '@/helper/token';
import { Token } from '@/types/tokens';
import { ArrowDown } from 'lucide-react';
import { useAccount, useChainId } from 'wagmi';

type ToggleTokensProps = {
  tokens: {
    src: Token;
    dest: Token;
    setSrc: (token: Token) => void;
    setDest: (token: Token) => void;
  };
  amounts: {
    src: string;
    dest: string;
    setSrc: (val: string) => void;
    setDest: (val: string) => void;
  };
  balances: {
    setSrc: (val: bigint) => void;
    setDest: (val: bigint) => void;
  };
};

export default function ToggleTokens({ tokens, amounts, balances }: ToggleTokensProps) {
  const chainId = useChainId();
  const { address: account } = useAccount();

  const handleToggle = async () => {
    tokens.setSrc(tokens.dest);
    tokens.setDest(tokens.src);

    amounts.setSrc(amounts.dest);
    amounts.setDest(amounts.src);

    if (!account) return;

    try {
      const [srcBal, destBal] = await Promise.all([
        fetchTokenBalance({ token: tokens.dest.address, account, chainId }),
        fetchTokenBalance({ token: tokens.src.address, account, chainId }),
      ]);
      balances.setSrc(srcBal);
      balances.setDest(destBal);
    } catch (e) {
      console.error('Toggle: balance fetch error', e);
    }
  };

  return (
    <div className="flex justify-center -mt-8 -mb-6">
      <button
        onClick={handleToggle}
        className="bg-background hover:bg-background-2 p-3 rounded-full border-black border-4 transition-all duration-300 hover:border-stroke-6 group"
        aria-label="Switch tokens"
      >
        <ArrowDown className="w-4 h-4 text-grey transition-transform duration-300 group-hover:rotate-180 group-hover:text-stroke-6 font-extrabold" />
      </button>
    </div>
  );
}
