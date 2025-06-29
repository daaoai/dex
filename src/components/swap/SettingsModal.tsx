'use client';

import React, { useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import clsx from 'clsx';
import Text from '../ui/Text';

interface SettingsModalProps {
  trigger: React.ReactNode;
  slippage: number;
  setSlippage: (value: number) => void;
  deadline: number;
  setDeadline: (value: number) => void;
  onSave: (value: number) => void;
  className?: string;
  children?: React.ReactNode;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  trigger,
  slippage,
  setSlippage,
  deadline,
  setDeadline,
  onSave,
  className = '',
}) => {
  const hasSaved = useRef(false);

  return (
    <Popover
      onOpenChange={(open) => {
        if (!open && !hasSaved.current) {
          onSave(slippage);
          hasSaved.current = true;
        }
      }}
    >
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={clsx(
          'flex flex-col z-50 !max-w-md !w-[300px] absolute border-none -left-4 rounded-[20px] bg-black border-2 border-stroke-9 shadow-xl p-4 space-y-4',
          className,
        )}
        side="bottom"
        align="end"
      >
        {/* Slippage */}
        <div className="flex items-center justify-between w-full">
          <div className="text-grey text-sm font-medium">Max Slippage</div>
          <div className="flex items-center bg-black rounded-full px-1 py-1 gap-1 w-[140px] p-2 border border-stroke-3">
            <button className="text-sm px-4 py-1.5 rounded-full font-medium text-white bg-background-20 mr-2" disabled>
              Auto
            </button>
            <input
              type="number"
              min="0"
              step="0.1"
              value={slippage}
              onChange={(e) => setSlippage(parseFloat(e.target.value))}
              className="no-spinner bg-transparent text-white text-sm outline-none w-10"
            />
            <div className="-ml-3 text-white text-sm">%</div>
          </div>
        </div>

        {/* Deadline */}
        <div className="flex items-center justify-between w-full">
          <div className="text-grey text-sm font-medium">Swap Deadline</div>
          <div className="flex items-center bg-black rounded-full px-3 py-1 w-[140px] h-9 justify-center">
            <input
              type="number"
              min="1"
              value={deadline}
              onChange={(e) => {
                const newValue = Math.max(0, parseInt(e.target.value) || 0);
                setDeadline(newValue);
              }}
              className="no-spinner bg-transparent text-white text-sm outline-none text-center w-5"
            />
            <Text type="span" className="text-white text-sm">
              minutes
            </Text>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
