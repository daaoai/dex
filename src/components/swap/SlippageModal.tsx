'use client';

import React, { useEffect, useRef } from 'react';
import { ModalWrapper } from '../ModalWrapper';
import clsx from 'clsx';

interface SlippageModalProps {
  isOpen: boolean;
  slippage: number;
  setSlippage: (value: number) => void;
  onClose: () => void;
  onSave: (value: number) => void;
  className?: string;
}

export const SlippageModal: React.FC<SlippageModalProps> = ({
  isOpen,
  slippage,
  setSlippage,
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
      className={clsx('absolute right-0 top-12 z-50 w-[300px] rounded-[20px] bg-zinc-900 shadow-xl p-4', className)}
    >
      <div className="flex items-center justify-between w-full">
        <div className="text-zinc-400 text-sm font-medium">Max Slippage</div>

        <div className="flex items-center bg-black rounded-full px-1 py-1 gap-1 w-[140px]">
          <button className="text-sm px-4 py-1.5 rounded-full font-medium text-white bg-indigo-600 mr-2" disabled>
            Auto
          </button>
          <input
            type="number"
            value={slippage}
            onChange={(e) => setSlippage(parseFloat(e.target.value))}
            className="no-spinner bg-transparent text-white text-sm outline-none w-10"
          />
          <div className="-ml-3 text-white text-sm">%</div>
        </div>
      </div>
    </ModalWrapper>
  );
};
