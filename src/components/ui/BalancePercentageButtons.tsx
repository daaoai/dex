import { BalancePercentageButtonsProps } from '@/types/balancePercentage';
import React from 'react';
import { formatUnits } from 'viem';

const BalancePercentageButtons: React.FC<BalancePercentageButtonsProps> = ({ balance, decimals, setAmount }) => {
  const handleClick = (percent: number) => {
    const value = (balance * BigInt(percent)) / BigInt(100);
    setAmount(formatUnits(value, decimals));
  };
  const PERCENTAGES = [25, 50, 75, 100];

  return (
    <div className="flex gap-1">
      {PERCENTAGES.map((percent) => (
        <button
          key={percent}
          type="button"
          className=" text-xs text-grey bg-black  px-2 py-0.5 rounded-3xl"
          onClick={() => handleClick(percent)}
        >
          {percent === 100 ? 'Max' : `${percent}%`}
        </button>
      ))}
    </div>
  );
};

export default BalancePercentageButtons;
