'use client';
import { supportedChainIds } from '@/constants/chains';
import useAddLiquidity from '@/hooks/useAddLiquidity';
import { V3Position } from '@/types/v3';
import React, { useEffect, useState } from 'react';
import Text from '../ui/Text';
import { Button } from '@/shadcn/components/ui/button';
import { X, Settings } from 'lucide-react';
import Image from 'next/image';
import TokenInput from '../TokenInput';

interface IncreaseLiquidityModalProps {
  onClose: () => void;
  position: V3Position;
}

const IncreaseLiquidityModal: React.FC<IncreaseLiquidityModalProps> = ({ onClose, position }) => {
  const [isValidRequest, setIsValidRequest] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const {
    token0FormattedAmount,
    token1FormattedAmount,
    setToken0FormattedAmount,
    setToken1FormattedAmount,
    getToken1FormattedAmount,
    getToken0FormattedAmount,
    addLiquidity,
    isValidAddLiquidityRequest,
    loading,
  } = useAddLiquidity({
    chainId: supportedChainIds.monadTestnet,
    position,
  });

  const handleToken0Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken0FormattedAmount(value);
    setToken1FormattedAmount(getToken1FormattedAmount(value));
  };

  const handleToken1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken1FormattedAmount(value);
    setToken0FormattedAmount(getToken0FormattedAmount(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (loading || !isValidAddLiquidityRequest()) {
      return;
    }
    e.preventDefault();
    try {
      await addLiquidity();
      onClose();
    } catch (error) {
      console.error('Error adding liquidity:', error);
    }
  };

  useEffect(() => {
    const isValid = isValidAddLiquidityRequest();
    setIsValidRequest(isValid.valid);
    if (!isValid.valid && Number(token0FormattedAmount) > 0 && Number(token1FormattedAmount) > 0) {
      setWarningMessage(isValid.message);
    } else {
      setWarningMessage('');
    }
  }, [token0FormattedAmount, token1FormattedAmount, isValidAddLiquidityRequest]);

  return (
    <div className="bg-background p-6 rounded-xl w-full max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose}>
          <X className="w-5 h-5 text-white" />
        </button>
        <Text type="h2" className="text-lg font-semibold text-white">
          Add Liquidity
        </Text>
        <Settings className="w-5 h-5 text-muted-foreground cursor-pointer" />
      </div>

      {/* Pair and Range */}
      <div className="flex items-start gap-4 rounded-lg px-4 py-2 mb-6">
        <div className="flex items-center gap-2">
          <Image src="/icons/pair-icon.png" alt="pair" width={28} height={28} className="rounded-full" />
          <div className="flex flex-col gap-1">
            <Text type="h3" className="text-white">
              {position.token0Details.symbol}/{position.token1Details.symbol}
            </Text>
            <Text type="p" className="text-green-500 text-sm mb-2">
              • In range
            </Text>
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <Text type="span" className="bg-background-4 px-2 py-1 rounded text-xs text-white">
            V4
          </Text>
          <Text type="span" className="bg-background-4 px-2 py-1 rounded text-xs text-white">
            {position.fee / 10000}%
          </Text>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <TokenInput
          id="token0Amount"
          value={token0FormattedAmount}
          onChange={handleToken0Change}
          symbol={position.token0Details.symbol}
          // balance={position.token0Details.balance.toFixed(4)}
          // logoURI={position.token1Details.logoURI}
          logoURI={'/'}
          balance={'123'}
          disabled={loading}
        />

        <TokenInput
          id="token1Amount"
          value={token1FormattedAmount}
          onChange={handleToken1Change}
          symbol={position.token1Details.symbol}
          // balance={position.token1Details.balance.toFixed(2)}
          // logoURI={position.token1Details.logoURI}
          logoURI={'/'}
          balance={'123'}
          disabled={loading}
        />

        {/* Preview Positions */}
        <div className="flex flex-col gap-4 justify-between mb-4 text-sm text-white">
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground">ETH position</p>
            <p>
              {token0FormattedAmount || '0'} {position.token0Details.symbol}
            </p>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-muted-foreground">USDT position</p>
            <p>
              {token1FormattedAmount || '0'} {position.token1Details.symbol}
            </p>
          </div>
        </div>

        {/* Warnings */}
        {warningMessage && <div className="mb-4 text-red-500 text-sm">{warningMessage}</div>}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || !isValidRequest}
          className={`w-full py-3 rounded-md text-white ${
            loading || !isValidRequest ? 'bg-blue-500 opacity-50 cursor-not-allowed' : 'bg-blue-600'
          }`}
        >
          {loading ? 'Processing...' : 'Enter an Amount'}
        </Button>
      </form>
    </div>
  );
};

export default IncreaseLiquidityModal;
