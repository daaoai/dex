'use client';
import { supportedChainIds } from '@/constants/chains';
import useAddLiquidity from '@/hooks/useAddLiquidity';
import { V3Position } from '@/types/v3';
import React, { useEffect, useState } from 'react';
import Text from '../ui/Text';
import { Button } from '@/shadcn/components/ui/button';
import { X, Settings } from 'lucide-react';

interface IncreaseLiquidityModalProps {
  onClose: () => void;
  position: V3Position;
}

const IncreaseLiquidityModal: React.FC<IncreaseLiquidityModalProps> = ({ onClose, position }) => {
  const [isValidRequest, setIsValidRequest] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  // Using the addLiquidity hook
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
    <div className="w-full bg-background">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onClose} className="text-white hover:text-white px-0">
          <X className="w-5 h-5" />
        </Button>
        <Text type="h2" className="text-xl font-bold text-white">
          Add Liquidity
        </Text>
        <Settings className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
      </div>

      <Text type="p" className="text-white mb-4">
        Position #{position.tokenId.toString()} - {position.token0Details.symbol}/{position.token1Details.symbol} (
        {position.fee / 10000}%)
      </Text>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2" htmlFor="token0Amount">
            {position.token0Details.symbol} Amount
          </label>
          <input
            id="token0Amount"
            disabled={loading}
            type="text"
            value={token0FormattedAmount}
            onChange={handleToken0Change}
            className="w-full p-3 bg-black rounded-md text-white focus:outline-none focus:ring-2"
            placeholder={`Enter ${position.token0Details.symbol} amount`}
          />
        </div>
        <div className="mb-6">
          <label className="block text-white mb-2" htmlFor="token1Amount">
            {position.token1Details.symbol} Amount
          </label>
          <input
            id="token1Amount"
            type="text"
            disabled={loading}
            value={token1FormattedAmount}
            onChange={handleToken1Change}
            className="w-full p-3  rounded-md bg-black text-white focus:outline-none"
            placeholder={`Enter ${position.token1Details.symbol} amount`}
          />
        </div>

        {warningMessage && (
          <div className="mb-4 text-red-500">
            <Text type="p">{warningMessage}</Text>
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading || !isValidRequest}
          className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            loading || !isValidRequest ? 'bg-blue-500 opacity-50 cursor-not-allowed' : 'bg-blue-600 '
          }`}
        >
          {loading ? 'Processing...' : 'Add Liquidity'}
        </button>
      </form>
    </div>
  );
};

export default IncreaseLiquidityModal;
