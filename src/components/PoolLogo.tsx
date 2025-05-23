import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface IconOverlapProps {
  token0Logo: string;
  token1Logo: string;
  className?: string;
  token0FallbackCharacter: string;
  token1FallbackCharacter: string;
}

const PoolIcon: React.FC<IconOverlapProps> = ({
  token0Logo,
  token1Logo,
  className,
  token0FallbackCharacter,
  token1FallbackCharacter,
}) => {
  return (
    <div className={clsx('relative h-6 w-8', className)}>
      {token0Logo && (
        <div className="absolute bottom-0 left-0 h-5 w-5 rounded-full">
          <Image src={token0Logo} alt={token0FallbackCharacter} height={20} width={20} className="rounded-full" />
        </div>
      )}
      {token1Logo && (
        <div className="absolute bottom-0 left-3 h-5 w-5 rounded-full">
          <Image src={token1Logo} alt={token1FallbackCharacter} height={20} width={20} className="rounded-full" />
        </div>
      )}
    </div>
  );
};

export default PoolIcon;
