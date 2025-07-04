'use client';

import { fetchTokenBalance } from '@/helper/token';
import { Token } from '@/types/tokens';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import ConnectOrActionButton from '../position/LiquidityActionButton';
import BalancePercentageButtons from '../ui/BalancePercentageButtons';
import Text from '../ui/Text';
import { formatUnits } from 'viem';
import { truncateNumber } from '@/utils/truncateNumber';

interface DepositTokensProps {
  token0Details: Token;
  token1Details: Token;
  token0Amount: string;
  token1Amount: string;
  txnState: 'approvingToken0' | 'approvingToken1' | 'waitingForConfirmation' | null;
  handleToken0AmountChange: (value: string) => void;
  handleToken1AmountChange: (value: string) => void;
  isLoading: boolean;
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
  handleDeposit,
}: DepositTokensProps) {
  const [srcBalance, setSrcBalance] = useState<bigint>(0n);
  const [destBalance, setDestBalance] = useState<bigint>(0n);
  const { address: account } = useAccount();
  const chainId = useChainId();
  useEffect(() => {
    if (account) {
      const init = async () => {
        try {
          const [srcBalance, destBalance] = await Promise.all([
            fetchTokenBalance({ token: token0Details.address, account, chainId }),
            fetchTokenBalance({ token: token1Details.address, account, chainId }),
          ]);
          setSrcBalance(srcBalance);
          setDestBalance(destBalance);
        } catch (error) {
          console.error('Failed to fetch token balance:', error);
          setSrcBalance(0n);
        }
      };
      init();
    }
  }, []);

  return (
    <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
      <Text type="h3" className="text-lg font-medium">
        Deposit tokens
      </Text>
      <Text type="p" className="text-sm text-gray-400">
        Specify the token amounts for your liquidity contribution.
      </Text>

      <div className="bg-zinc-800 p-4 rounded-md group">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={token0Amount}
            onChange={(e) => handleToken0AmountChange(e.target.value)}
            aria-label={token0Details.symbol + ' Amount'}
            className="text-3xl font-bold bg-transparent outline-none w-full"
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
              balance={srcBalance}
              decimals={token0Details.decimals}
              setAmount={handleToken0AmountChange}
            />
          </div>

          <Text type="p" className="text-sm text-gray-400 mt-2 text-end">
            {truncateNumber(formatUnits(srcBalance, token0Details.decimals))}
          </Text>
        </div>
      </div>

      <div className="bg-zinc-800 p-4 rounded-md group">
        <div className="flex justify-between items-center">
          <input
            type="text"
            placeholder="0"
            value={token1Amount || ''}
            onChange={(e) => {
              handleToken1AmountChange(e.target.value);
            }}
            aria-label={token1Details.symbol + ' Amount'}
            className="text-3xl font-bold bg-transparent outline-none w-full"
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
              balance={destBalance}
              decimals={token1Details.decimals}
              setAmount={handleToken1AmountChange}
            />
          </div>

          <Text type="p" className="text-sm text-gray-400 mt-2 text-end">
            {truncateNumber(formatUnits(destBalance, token1Details.decimals))}
          </Text>
        </div>
      </div>

      <ConnectOrActionButton
        authenticatedOnClick={handleDeposit}
        isDisabled={isLoading}
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
