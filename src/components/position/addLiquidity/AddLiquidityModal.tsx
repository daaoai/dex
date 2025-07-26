'use client';
import DynamicLogo from '@/components/ui/logo/DynamicLogo';
import PoolIcon from '@/components/ui/logo/PoolLogo';
import { supportedChainIds } from '@/constants/chains';
import useAddLiquidity from '@/hooks/useAddLiquidity';
import { Button } from '@/shadcn/components/ui/button';
import { V3Position } from '@/types/v3';
import { truncateNumber } from '@/utils/truncateNumber';
import clsx from 'clsx';
import { Bolt, Circle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import TokenInput from './TokenInput';
import Text from '@/components/ui/Text';

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
    token0Balance,
    token1Balance,
    setToken0FormattedAmount,
    setToken1FormattedAmount,
    getToken1FormattedAmount,
    getToken0FormattedAmount,
    addLiquidity,
    isValidAddLiquidityRequest,
    loading,
  } = useAddLiquidity({
    chainId: supportedChainIds.bsc,
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
    <div className="bg-background-8 p-6 rounded-xl w-full max-w-xl">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={onClose}>
          <X className="w-5 h-5 text-white" />
        </Button>
        <Text type="h2" className="text-lg font-semibold text-white">
          Add Liquidity
        </Text>
        <Bolt className="w-5 h-5 text-muted-foreground cursor-pointer" />
      </div>

      {/* Pair and Range */}
      <div className="flex items-start gap-4 rounded-lg px-4 py-2 mb-6">
        <div className="flex items-center gap-6">
          <PoolIcon token0={position.token0Details} token1={position.token1Details} />

          <div className="flex flex-col gap-1">
            <Text type="h3" className="text-white">
              {position.token0Details.symbol}/{position.token1Details.symbol}
            </Text>
            <Text type="p" className="flex items-center gap-1 text-sm">
              <Circle
                className={clsx('w-2 h-2', position.isInRange ? 'text-green-500' : 'text-red-500')}
                fill={position.isInRange ? 'currentColor' : 'currentColor'}
              />
              <span className={position.isInRange ? 'text-green-500' : 'text-red-500'}>
                {position.isInRange ? 'In Range' : 'Out of Range'}
              </span>
            </Text>
          </div>
        </div>
        <div className="flex gap-1 items-center">
          <Text type="span" className="bg-background-4 px-2 py-1 rounded text-xs text-white">
            V3
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
          logoUrl={position.token0Details.logo}
          balance={truncateNumber(formatUnits(token0Balance, position.token0Details.decimals), 4)}
          disabled={loading}
        />

        <TokenInput
          id="token1Amount"
          value={token1FormattedAmount}
          onChange={handleToken1Change}
          symbol={position.token1Details.symbol}
          // balance={position.token1Details.balance.toFixed(2)}
          logoUrl={position.token1Details.logo}
          balance={truncateNumber(formatUnits(token1Balance, position.token1Details.decimals), 4)}
          disabled={loading}
        />

        {/* Preview Positions */}
        <div className="flex flex-col gap-4 justify-between mb-4 text-sm text-white">
          <div className="flex items-center justify-between w-full">
            <Text type="p" className="text-muted-foreground">
              {position.token0Details.symbol} position
            </Text>
            <div className="flex gap-2">
              <DynamicLogo logoUrl={position.token0Details.logo} alt={position.token0Details.symbol} />
              <Text type="p">
                {truncateNumber(formatUnits(BigInt(position.amount0), position.token0Details.decimals) || '0')}
                {position.token0Details.symbol}
              </Text>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <Text type="p" className="text-muted-foreground">
              {position.token1Details.symbol} position
            </Text>
            <div className="flex gap-2">
              <DynamicLogo logoUrl={position.token1Details.logo} alt={position.token1Details.symbol} />

              <Text type="p">
                {truncateNumber(formatUnits(BigInt(position.amount1), position.token1Details.decimals) || '0')}
                {position.token1Details.symbol}
              </Text>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {warningMessage && <div className="mb-4 text-red-500 text-sm">{warningMessage}</div>}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading || !isValidRequest}
          className={`w-full py-2 h-12 rounded-md text-white ${
            loading || !isValidRequest ? 'bg-background-19 opacity-50 cursor-not-allowed' : 'bg-background-19'
          }`}
        >
          {loading ? 'Processing...' : 'Enter an Amount'}
        </Button>
      </form>
    </div>
  );
};

export default IncreaseLiquidityModal;
