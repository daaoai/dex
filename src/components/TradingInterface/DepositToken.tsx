'use client';

import { Token } from '@/types/tokens';
import ConnectOrActionButton from '../LiquidityActionButton';
import Image from 'next/image';

interface DepositTokensProps {
  srcTokenDetails: Token;
  destTokenDetails: Token;
  srcTokenAmount: string;
  destTokenAmount: string;
  handleSrcTokenAmountChange: (value: string) => void;
  isLoading: boolean;
  handleDeposit: () => void;
}

export default function DepositTokens({
  srcTokenDetails,
  destTokenDetails,
  srcTokenAmount,
  destTokenAmount,
  handleSrcTokenAmountChange,
  isLoading,
  handleDeposit,
}: DepositTokensProps) {
  return (
    <div className="bg-zinc-900 rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-medium">Deposit tokens</h3>
      <p className="text-sm text-gray-400">Specify the token amounts for your liquidity contribution.</p>

      <div className="bg-zinc-800 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <input
            type="text"
            // value={srcTokenAmount}
            onChange={(e) => handleSrcTokenAmountChange(e.target.value)}
            aria-label={srcTokenDetails.symbol + ' Amount'}
            className="text-3xl font-bold bg-transparent outline-none w-full"
          />

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Image
                src={srcTokenDetails.logo || '/placeholder.svg'}
                alt={srcTokenDetails.symbol}
                width={20}
                height={20}
              />
            </div>
            <span>{srcTokenDetails.symbol}</span>
          </div>
        </div>
        <div className="text-sm text-gray-400 mt-2">${srcTokenAmount}</div>
      </div>

      <div className="bg-zinc-800 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <input
            type="text"
            value={destTokenAmount || ''}
            readOnly
            onChange={() => {}}
            aria-label={destTokenDetails.symbol + ' Amount'}
            className="text-3xl font-bold bg-transparent outline-none w-full"
          />

          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Image
                src={destTokenDetails.logo || '/placeholder.svg'}
                alt={destTokenDetails.symbol}
                width={20}
                height={20}
              />
            </div>
            <span>{destTokenDetails.symbol}</span>
          </div>
        </div>
        <div className="text-sm text-gray-400 mt-2">${destTokenAmount}</div>
      </div>

      <ConnectOrActionButton
        authenticatedOnClick={handleDeposit}
        isDisabled={isLoading}
        authenticatedText="Create Position"
      />
    </div>
  );
}
