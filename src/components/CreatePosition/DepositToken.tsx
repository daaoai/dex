'use client';

import { Token } from '@/types/tokens';
import { truncateNumber } from '@/utils/truncateNumber';
import Image from 'next/image';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import ConnectOrActionButton from '../position/LiquidityActionButton';
import BalancePercentageButtons from '../ui/BalancePercentageButtons';
import Text from '../ui/Text';

interface DepositTokensProps {
  token0Details: Token;
  token1Details: Token;
  token0Amount: string;
  token1Amount: string;
  txnState: 'approvingToken0' | 'approvingToken1' | 'waitingForConfirmation' | null;
  handleToken0AmountChange: (value: string) => void;
  handleToken1AmountChange: (value: string) => void;
  isLoading: boolean;
  balances: Record<string, bigint>;
  handleDeposit: () => void;
}

export default function DepositTokens({
  token0Details,
  token1Details,
  token0Amount,
  token1Amount,
  handleToken0AmountChange,
  handleToken1AmountChange,
  isLoading,
  txnState,
  balances,
  handleDeposit,
}: DepositTokensProps) {
  const token0Balance = balances[token0Details.address] || 0n;
  const token1Balance = balances[token1Details.address] || 0n;
  const formattedToken0Balance = formatUnits(token0Balance, token0Details.decimals);
  const formattedToken1Balance = formatUnits(token1Balance, token1Details.decimals);
  const { address: account } = useAccount();

  const isActionButtonDisabled =
    !account ||
    isLoading ||
    Number(token0Amount) <= 0 ||
    Number(token1Amount) <= 0 ||
    Number(token0Amount) > Number(formattedToken0Balance) ||
    Number(token1Amount) > Number(formattedToken1Balance);

  return (
    <div className="space-y-4">
      <Text type="h3" className="text-lg font-medium">
        Deposit tokens
      </Text>
      <Text type="p" className="text-sm text-gray-400">
        Specify the token amounts for your liquidity contribution.
      </Text>

      <div className="bg-black p-4 rounded-md group">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={token0Amount}
            onChange={(e) => handleToken0AmountChange(e.target.value)}
            aria-label={token0Details.symbol + ' Amount'}
            className={`text-3xl font-bold bg-transparent outline-none w-full ${Number(token0Amount) > Number(formattedToken0Balance) ? 'text-red-500' : ''}`}
            placeholder="0"
          />

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Image src={token0Details.logo || '/placeholder.svg'} alt={token0Details.symbol} width={20} height={20} />
            </div>
            <Text type="span">{token0Details.symbol}</Text>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex justify-between mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-2 group-hover:translate-y-0">
            <BalancePercentageButtons
              balance={token0Balance}
              decimals={token0Details.decimals}
              setAmount={handleToken0AmountChange}
            />
          </div>

          <Text type="p" className="text-sm text-gray-400 mt-2 text-end">
            {truncateNumber(formatUnits(token0Balance, token0Details.decimals))}
          </Text>
        </div>
      </div>

      <div className="bg-black p-4 rounded-md group">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="0"
            value={token1Amount || ''}
            onChange={(e) => {
              handleToken1AmountChange(e.target.value);
            }}
            aria-label={token1Details.symbol + ' Amount'}
            className={`text-3xl font-bold bg-transparent outline-none w-full ${Number(token1Amount) > Number(formattedToken1Balance) ? 'text-red-500' : ''}`}
          />

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Image src={token1Details.logo || '/placeholder.svg'} alt={token1Details.symbol} width={20} height={20} />
            </div>
            <Text type="span">{token1Details.symbol}</Text>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex justify-between mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-2 group-hover:translate-y-0">
            <BalancePercentageButtons
              balance={token1Balance}
              decimals={token1Details.decimals}
              setAmount={handleToken1AmountChange}
            />
          </div>

          <Text type="p" className="text-sm text-gray-400 mt-2 text-end">
            {truncateNumber(formatUnits(token1Balance, token1Details.decimals))}
          </Text>
        </div>
      </div>

      <ConnectOrActionButton
        authenticatedOnClick={handleDeposit}
        isDisabled={isActionButtonDisabled}
        authenticatedText={
          txnState === 'approvingToken0'
            ? `Approving ${token0Details.symbol}`
            : txnState === 'approvingToken1'
              ? `Approving ${token1Details.symbol}`
              : txnState === 'waitingForConfirmation'
                ? 'Waiting for confirmation...'
                : 'Create Position'
        }
      />
    </div>
  );
}
