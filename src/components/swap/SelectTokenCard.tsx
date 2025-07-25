import { Button } from '@/shadcn/components/ui/button';
import { Token } from '@/types/tokens';
import { truncateNumber } from '@/utils/truncateNumber';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { formatUnits } from 'viem';
import Text from '../ui/Text';
import BalancePercentageButtons from '../ui/BalancePercentageButtons';
import { toast } from 'react-toastify';

type SelectTokenCardProps = {
  title: string;
  token: Token | null;
  amount: string;
  setAmount: (value: string) => void;
  onTokenClick: () => void;
  balance?: bigint;
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
  isDisabled = false,
  isLoading = false,
}: SelectTokenCardProps) {
  const isSell = title.toLowerCase() === 'selling';

  return (
    <div
      className={`group border border-stroke-3 rounded-lg p-4 transition-colors mb-4 ${isSell ? '-mb-3.5' : ''} ${token ? 'bg-background-8' : 'bg-background-17'}`}
    >
      <div className="flex justify-between items-center mb-3">
        <Text type="span" className="text-zinc-400 text-sm font-medium">
          {title}
        </Text>

        {Boolean(isSell && balance) && (
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-2 group-hover:translate-y-0">
            <BalancePercentageButtons balance={balance || 0n} decimals={token?.decimals || 18} setAmount={setAmount} />
          </div>
        )}
      </div>

      <div className="flex justify-between items-start mb-3">
        {isLoading ? (
          <div className="w-36 h-10 bg-stroke animate-pulse rounded-md" />
        ) : (
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              if (isNaN(Number(value))) return;

              // Allow empty string for clearing
              if (value === '') {
                setAmount('');
                return;
              }

              // Split into whole and decimal
              const [, decimal] = value.split('.');

              if (!decimal) {
                setAmount(value);
                return;
              }

              // Find the index of the first non-zero digit in the decimal part
              const firstNonZero = decimal.search(/[1-9]/);

              // If there is a non-zero digit and it is after the 5th index (6th decimal place), block it and show toast
              if (firstNonZero > 5) {
                toast.error('First non-zero digit must be within the first 6 decimal places.');
                return;
              }

              setAmount(value);
            }}
            disabled={isDisabled}
            placeholder="0"
            className="text-3xl font-light bg-transparent text-white outline-none placeholder-grey-2 w-36"
          />
        )}

        <Button
          onClick={onTokenClick}
          className={`flex items-center cursor-pointer gap-2 px-3 py-2 font-bold rounded-2xl w-fit text-gray-400 border border-stroke-7 hover:border-[#623AFF]
            ${token?.symbol || token?.logo ? 'bg-black' : 'bg-background-19'}
            hover:shadow-[0_4px_12px_0_#623AFF40,0_-4px_12px_0_#623AFF40]
            transition-shadow duration-300`}
        >
          {token?.logo && (
            <Image
              src={token.logo}
              alt={`${token.symbol} logo`}
              width={20}
              height={20}
              className="w-5 h-5 rounded-full"
            />
          )}
          {token?.symbol || 'Select Token'}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <Text type="span" className="text-grey text-sm">
          $0.00
        </Text>
        <Text type="span" className="text-grey text-sm">
          {balance !== undefined && balance !== null && token?.symbol
            ? `Balance: ${truncateNumber(formatUnits(balance ?? 0n, token.decimals || 18))} ${token.symbol}`
            : ''}
        </Text>
      </div>
    </div>
  );
}
