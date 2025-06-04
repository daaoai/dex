'use client';
import { supportedChainIds } from '@/constants/chains';
import useAddLiquidity from '@/hooks/useAddLiquidity';
import { V3Position } from '@/types/v3';
import React from 'react';
import { ModalWrapper } from './ModalWrapper';
import Text from './ui/Text';

interface IncreaseLiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: V3Position;
}

const IncreaseLiquidityModal: React.FC<IncreaseLiquidityModalProps> = ({ isOpen, onClose, position }) => {
  // Using the addLiquidity hook
  const {
    token0FormattedAmount,
    token1FormattedAmount,
    setToken0FormattedAmount,
    setToken1FormattedAmount,
    addLiquidity,
    loading,
  } = useAddLiquidity({
    chainId: supportedChainIds.monadTestnet,
    position,
  });

  const handleToken0Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken0FormattedAmount(value);
  };

  const handleToken1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToken1FormattedAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addLiquidity();
      onClose();
    } catch (error) {
      console.error('Error adding liquidity:', error);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} className="bg-grey-3 w-full max-w-md p-6">
      <div className="w-full ">
        <div className="flex justify-between items-center mb-6">
          <Text type="h2" className="text-xl font-bold text-white">
            Increase Liquidity
          </Text>
          <button onClick={onClose} className="text-white hover:text-white">
            ✕
          </button>
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

          <button
            onClick={handleSubmit}
            disabled={loading || !token0FormattedAmount || !token1FormattedAmount}
            className={`w-full py-3 px-4 rounded-md font-medium text-white ${
              loading || !token0FormattedAmount || !token1FormattedAmount
                ? 'bg-blue-500 opacity-50 cursor-not-allowed'
                : 'bg-blue-600 '
            }`}
          >
            {loading ? 'Processing...' : 'Increase Liquidity'}
          </button>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default IncreaseLiquidityModal;
