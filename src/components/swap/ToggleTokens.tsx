'use client';

import { ArrowDown } from 'lucide-react';
import { Token } from '@/types/tokens';
import { fetchTokenBalance } from '@/helper/erc20';
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
    setSrc: (val: bigint | null) => void;
    setDest: (val: bigint | null) => void;
  };
};

export default function ToggleTokens({ tokens, amounts, balances }: ToggleTokensProps) {
  const chainId = useChainId();
  const { address: account } = useAccount();
  // console.log(account);

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
        className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-xl border-black border-4 transition-all duration-200 hover:border-zinc-600 group"
        aria-label="Switch tokens"
      >
        <ArrowDown className="w-5 h-5 text-zinc-400 transition-transform duration-300 group-hover:rotate-180" />
      </button>
    </div>
  );
}
