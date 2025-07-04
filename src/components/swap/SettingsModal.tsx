'use client';

import React, { useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/components/ui/select';
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

const deadlineOptions = [
  { label: '1 minute', value: '1' },
  { label: '2 minutes', value: '2' },
  { label: '3 minutes', value: '3' },
  { label: '5 minutes', value: '5' },
  { label: '10 minutes', value: '10' },
];

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
  const [focused, setFocused] = useState<'auto' | 'input'>('auto');

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
        side="bottom"
        align="end"
        sideOffset={8}
        alignOffset={0}
        avoidCollisions
        collisionPadding={16}
        className={clsx(
          'flex flex-col z-50 max-w-md w-[80vw] sm:w-[300px] border-none rounded-[20px] bg-black border-2 border-stroke-9 shadow-xl p-4 translate-x-0 sm:translate-x-64',
          className,
        )}
      >
        {/* Slippage */}
        <div className="flex items-center justify-between w-full">
          <div className="text-grey text-sm font-medium">Max Slippage</div>
          <div className="relative flex items-center bg-black rounded-full px-2 py-0 gap-2 w-[150px] border border-stroke-3 overflow-hidden">
            <motion.div
              layout
              layoutId="slippageHighlight"
              className="absolute top-0 left-0 h-full rounded-full bg-background-20 z-0"
              animate={{
                width: focused === 'auto' ? '48%' : 'calc(100% - 8px)',
                x: focused === 'auto' ? 0 : '52%',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => setFocused('auto')}
              className={clsx('text-sm text-white px-4 py-1.5 rounded-full font-medium z-10')}
            >
              Auto
            </button>
            <div className="flex items-center justify-center gap-1 z-10 w-full">
              <input
                type="number"
                min="0"
                step="0.1"
                onFocus={() => setFocused('input')}
                value={Number.isNaN(slippage) ? '' : slippage}
                onChange={(e) => setSlippage(parseFloat(e.target.value))}
                className="no-spinner bg-transparent text-white text-sm outline-none w-10"
              />
              <div className="text-white text-sm">%</div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="text-grey text-sm font-medium">Swap Deadline</div>
          <div className="flex items-center bg-black rounded-full px-3 py-1 w-[140px] h-9 justify-center">
            <Select value={String(deadline)} onValueChange={(value) => setDeadline(Number(value))}>
              <SelectTrigger className="bg-transparent border-none text-white h-6 focus:ring-0 focus:outline-none px-0 text-sm justify-center">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border cursor-pointer border-gray-700">
                {deadlineOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
