import clsx from 'clsx';
import React from 'react';
import DynamicLogo from './DynamicLogo';

interface IconOverlapProps {
  token0: {
    logo?: string;
    symbol: string;
  };
  token1: {
    logo?: string;
    symbol: string;
  };
  className?: string;
  logoSize?: number;
}

const PoolIcon: React.FC<IconOverlapProps> = ({ token0, token1, className, logoSize = 20 }) => {
  return (
    <div className={clsx('relative h-6 w-8', className)}>
      <div className="absolute bottom-0 left-0  rounded-full">
        <DynamicLogo logoUrl={token0.logo} alt={token0.symbol[0]} className="rounded-full" />
      </div>

      <div className="absolute bottom-0 left-3  rounded-full">
        <DynamicLogo
          logoUrl={token1.logo}
          alt={token1.symbol[0]}
          height={logoSize}
          width={logoSize}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default PoolIcon;
