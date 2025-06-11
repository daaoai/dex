import React from 'react';
import { formatUnits } from 'viem';

type Props = {
  balance: bigint;
  decimals: number;
  setAmount: (value: string) => void;
};

const BalancePercentageButtons: React.FC<Props> = ({ balance, decimals, setAmount }) => {
  const handleClick = (percent: number) => {
    const value = (balance * BigInt(percent)) / BigInt(100);
    setAmount(formatUnits(value, decimals));
  };

  return (
    <div className="flex gap-1">
      {[25, 50, 75, 100].map((percent) => (
        <button
          key={percent}
          type="button"
          className=" text-xs text-grey bg-zinc-700 px-2 py-0.5 rounded-3xl"
          onClick={() => handleClick(percent)}
        >
          {percent === 100 ? 'Max' : `${percent}%`}
        </button>
      ))}
    </div>
  );
};

export default BalancePercentageButtons;
