import { BalancePercentageButtonsProps } from '@/types/balancePercentage';
import React from 'react';
import { formatUnits } from 'viem';
import { toast } from 'react-toastify';

const BalancePercentageButtons: React.FC<BalancePercentageButtonsProps> = ({ balance, decimals, setAmount }) => {
  const handleClick = (percent: number) => {
    const value = (balance * BigInt(percent)) / BigInt(100);
    const formatted = formatUnits(value, decimals);
    // Enforce non-zero before 6 decimals
    const [, decimal] = formatted.split('.');
    if (decimal) {
      const firstNonZero = decimal.search(/[1-9]/);
      if (firstNonZero > 5) {
        toast.error('First non-zero digit must be within the first 6 decimal places.');
        return;
      }
    }
    setAmount(formatted);
  };

  const PERCENTAGES = [25, 50, 75, 100];

  return (
    <div className="flex gap-1">
      {PERCENTAGES.map((percent) => (
        <button
          key={percent}
          type="button"
          className="text-xs text-grey bg-black px-2 py-0.5 rounded-3xl"
          onClick={() => handleClick(percent)}
        >
          {percent === 100 ? 'Max' : `${percent}%`}
        </button>
      ))}
    </div>
  );
};

export default BalancePercentageButtons;
