import { Button } from '@/shadcn/components/ui/button';
import { Token } from '@/types/tokens';
import { truncateNumber } from '@/utils/truncateNumber';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { formatUnits } from 'viem';

type SelectTokenCardProps = {
  title: string;
  token: Token;
  amount: string;
  setAmount?: (value: string) => void;
  onTokenClick: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  balance?: any;
  decimals: number;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export default function SelectTokenCard({
  title,
  token,
  amount,
  setAmount,
  onTokenClick,
  balance,
  decimals,
  isDisabled = false,
  isLoading = false,
}: SelectTokenCardProps) {
  const isSell = title.toLowerCase() === 'sell';
  return (
    <div
      className={`border border-zinc-700 rounded-3xl p-4 hover:border-zinc-600 transition-colors mb-4 ${
        isSell ? 'bg-transparent -mb-3.5' : 'bg-zinc-800'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-zinc-400 text-sm font-medium">{title}</span>
      </div>

      <div className="flex justify-between items-start mb-3">
        {isLoading ? (
          <div className="w-36 h-10 bg-zinc-700 animate-pulse rounded-md" />
        ) : (
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount?.(e.target.value)}
            disabled={isDisabled}
            placeholder="0"
            className="text-3xl font-light bg-transparent text-white outline-none placeholder-zinc-500 w-36"
          />
        )}
        <Button
          onClick={onTokenClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-3xl w-fit ${
            title === 'Sell'
              ? 'bg-transparent border-white/30 border text-white hover:bg-zinc-600'
              : 'bg-indigo-600 text-white hover:bg-blue-600'
          }`}
        >
          {token.logo && (
            <Image
              src={token.logo}
              alt={`${token.symbol} logo`}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full"
            />
          )}
          {token.symbol || 'Select Token'}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-zinc-500 text-sm">$0.00</span>
        <span className="text-zinc-500 text-sm">
          {balance !== null && token.symbol
            ? `Balance: ${truncateNumber(formatUnits(balance, decimals))} ${token.symbol}`
            : ''}
        </span>
      </div>
    </div>
  );
}
