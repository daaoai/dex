import { Button } from '@/shadcn/components/ui/button';
import { Token } from '@/types/tokens';
import { truncateNumber } from '@/utils/truncateNumber';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { formatUnits } from 'viem';
import Text from '../ui/Text';
import BalancePercentageButtons from '../ui/BalancePercentageButtons';

type SelectTokenCardProps = {
  title: string;
  token: Token;
  amount: string;
  setAmount?: (value: string) => void;
  onTokenClick: () => void;
  balance?: bigint;
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
      className={`border border-stroke rounded-3xl p-4 hover:border-stroke transition-colors mb-4 ${
        isSell ? 'bg-transparent -mb-3.5' : 'bg-background-5'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <Text type="span" className="text-zinc-400 text-sm font-medium">
          {title}
        </Text>

        {isSell && balance && setAmount && (
          <BalancePercentageButtons balance={balance} decimals={decimals} setAmount={setAmount} />
        )}
      </div>

      <div className="flex justify-between items-start mb-3">
        {isLoading ? (
          <div className="w-36 h-10 bg-stroke animate-pulse rounded-md" />
        ) : (
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount?.(e.target.value)}
            disabled={isDisabled}
            placeholder="0"
            className="text-3xl font-light bg-transparent text-white outline-none placeholder-grey-2 w-36"
          />
        )}
        <Button
          onClick={onTokenClick}
          className={`flex items-center gap-2 px-3 py-2 rounded-3xl w-fit ${
            isSell
              ? 'bg-transparent border-white/30 border text-white hover:bg-zinc-600'
              : 'bg-primary text-white hover:bg-blue-600'
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
        <Text type="span" className="text-grey text-sm">
          $0.00
        </Text>
        <Text type="span" className="text-grey text-sm">
          {balance !== undefined && balance !== null && token.symbol
            ? `Balance: ${truncateNumber(formatUnits(balance ?? 0n, decimals))} ${token.symbol}`
            : ''}
        </Text>
      </div>
    </div>
  );
}
