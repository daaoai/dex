'use client';

import clsx from 'clsx';
import { useState } from 'react';
import Image from 'next/image';
import CopyIcon from '@/public/assets/icons/copy-icon.svg';
import SuccessIcon from '@/public/assets/icons/success-new.svg';

interface ClickToCopyProps {
  copyText: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

const sizeClasses = {
  xs: 'w-3 h-5',
  sm: 'w-5 h-6',
  md: 'w-8 h-10',
};

const ClickToCopy: React.FC<ClickToCopyProps> = ({ copyText, className = '', size = 'xs' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center">
      <div className={clsx('cursor-pointer', sizeClasses[size], className)} onClick={handleCopyClick}>
        <Image
          src={copied ? SuccessIcon : CopyIcon}
          alt={copied ? 'Copied!' : 'Copy to clipboard'}
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default ClickToCopy;
