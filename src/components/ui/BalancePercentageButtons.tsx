'use client';

import { BalancePercentageButtonsProps } from '@/types/balancePercentage';
import React, { useState } from 'react';
import { formatUnits } from 'viem';

const BalancePercentageButtons: React.FC<BalancePercentageButtonsProps> = ({
  balance,
  decimals,
  setAmount,
  disabled,
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleClick = (percent: number) => {
    const value = (balance * BigInt(percent)) / BigInt(100);
    const formatted = formatUnits(value, decimals);

    setAmount(formatted);
    setSelected(percent);
  };

  const PERCENTAGES = [25, 50, 75, 100];

  return (
    <div className="flex w-full gap-3 mt-12 mb-6">
      {PERCENTAGES.map((percent) => (
        <button
          key={percent}
          type="button"
          onClick={() => handleClick(percent)}
          disabled={disabled}
          className={`flex-1 px-4 py-3 rounded-3xl transition-colors duration-200 border-[#1F2530] border-2 text-sm cursor-pointer
          ${selected === percent ? 'bg-[#212121] text-[#DAE4E3]' : 'bg-[#000000] text-grey hover:bg-[#000000]'}
        `}
        >
          {percent === 100 ? 'Max' : `${percent}%`}
        </button>
      ))}
    </div>
  );
};

export default BalancePercentageButtons;
