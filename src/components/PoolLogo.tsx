import { Token } from '@/types/tokens';
import clsx from 'clsx';
import React from 'react';
import DynamicLogo from './DynamicLogo';

interface IconOverlapProps {
  token0: Token;
  token1: Token;
  className?: string;
}

const PoolIcon: React.FC<IconOverlapProps> = ({ token0, token1, className }) => {
  return (
    <div className={clsx('relative h-6 w-8', className)}>
      <div className="absolute bottom-0 left-0  rounded-full">
        <DynamicLogo logoUrl={token0.logo} alt={token0.symbol[0]} className="rounded-full" />
      </div>

      <div className="absolute bottom-0 left-3  rounded-full">
        <DynamicLogo logoUrl={token1.logo} alt={token1.symbol[0]} height={20} width={20} className="rounded-full" />
      </div>
    </div>
  );
};

export default PoolIcon;
