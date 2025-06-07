import { Token } from '@/types/tokens';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface IconOverlapProps {
  token0: Token;
  token1: Token;
  className?: string;
}

const PoolIcon: React.FC<IconOverlapProps> = ({ token0, token1, className }) => {
  return (
    <div className={clsx('relative h-6 w-8', className)}>
      <div className="absolute bottom-0 left-0 h-5 w-5 rounded-full">
        <Image
          src={token0.logo || '/placeholder.png'}
          alt={token0.symbol[0]}
          height={20}
          width={20}
          className="rounded-full"
        />
      </div>

      <div className="absolute bottom-0 left-3 h-5 w-5 rounded-full">
        <Image
          src={token1.logo || '/placeholder.png'}
          alt={token1.symbol[0]}
          height={20}
          width={20}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default PoolIcon;
