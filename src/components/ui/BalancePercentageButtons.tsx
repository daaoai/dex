'use client';

import React, { useState } from 'react';
import { formatUnits } from 'viem';
import { toast } from 'react-toastify';
import { BalancePercentageButtonsProps } from '@/types/balancePercentage';

const BalancePercentageButtons: React.FC<BalancePercentageButtonsProps> = ({ balance, decimals, setAmount }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (percent: number) => {
    const value = (balance * BigInt(percent)) / BigInt(100);
    const formatted = formatUnits(value, decimals);

    const [, decimal] = formatted.split('.');
    if (decimal) {
      const firstNonZero = decimal.search(/[1-9]/);
      if (firstNonZero > 5) {
        toast.error('First non-zero digit must be within the first 6 decimal places.');
        return;
      }
    }

    setAmount(formatted);
    setSelected(percent);
  };

  const PERCENTAGES = [25, 50, 75, 100];

  return (
    <div className="flex gap-1">
      {PERCENTAGES.map((percent) => (
        <button
          key={percent}
          type="button"
          onClick={() => handleClick(percent)}
          className={`text-xs px-2 py-0.5 rounded-3xl transition-colors duration-200
            ${selected === percent ? 'bg-background-24 text-white' : 'bg-background-13 text-grey hover:bg-background-16'}
          `}
        >
          {percent === 100 ? 'Max' : `${percent}%`}
        </button>
      ))}
    </div>
  );
};

export default BalancePercentageButtons;
