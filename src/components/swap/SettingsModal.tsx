'use client';

import React, { useEffect, useRef } from 'react';
import { ModalWrapper } from '../ui/ModalWrapper';
import clsx from 'clsx';
import { Button } from '@/shadcn/components/ui/button';
import Text from '../ui/Text';

interface SlippageModalProps {
  isOpen: boolean;
  slippage: number;
  setSlippage: (value: number) => void;
  deadline: number;
  setDeadline: (value: number) => void;
  onClose: () => void;
  onSave: (value: number) => void;
  className?: string;
}

export const SettingsModal: React.FC<SlippageModalProps> = ({
  isOpen,
  slippage,
  setSlippage,
  deadline,
  setDeadline,
  onClose,
  onSave,
  className = '',
}) => {
  const hasSaved = useRef(false);

  useEffect(() => {
    if (isOpen) {
      hasSaved.current = false;
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!hasSaved.current) {
      onSave(slippage);
      hasSaved.current = true;
    }
    onClose();
  };

  return (
    <ModalWrapper
      withBlur={false}
      isOpen={isOpen}
      onClose={handleClose}
      className={clsx(
        'flex flex-col absolute right-0 top-12 z-50 w-[300px] rounded-[20px] bg-background shadow-xl p-4 space-y-4',
        className,
      )}
    >
      {/* Slippage */}
      <div className="flex items-center justify-between w-full">
        <div className="text-grey text-sm font-medium">Max Slippage</div>

        <div className="flex items-center bg-black rounded-full px-1 py-1 gap-1 w-[140px]">
          <Button className="text-sm px-4 py-1.5 rounded-full font-medium text-white bg-primary mr-2" disabled>
            Auto
          </Button>
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

        <div className="flex items-center bg-black rounded-full px-3 py-1  w-[140px] h-9 align-middle justify-center">
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
    </ModalWrapper>
  );
};
