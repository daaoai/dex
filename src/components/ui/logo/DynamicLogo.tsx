'use client';

import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { UserCircle } from 'lucide-react';
import Text from '../Text';

interface DynamicLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  logoUrl?: string;
  altText?: string;
  label?: string;
  className?: string;
  logoClassName?: string;
  labelClassName?: string;
  onClick?: () => void;
  fallbackText?: string;
}

const DynamicLogo: React.FC<DynamicLogoProps> = ({
  logoUrl,
  altText = '',
  label,
  className = '',
  logoClassName = '',
  labelClassName = '',
  onClick,
  fallbackText = '',
  ...rest
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);

  const finalFallbackText = fallbackText?.slice(0, 2).toUpperCase();

  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      setShouldAnimate(textWidth > containerWidth);
    }
  }, [label]);

  const isValueEmpty = (val: unknown) => {
    if (val == null) return true;
    if (typeof val === 'string') return val.trim() === '';
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === 'object') return Object.keys(val).length === 0;
    return false;
  };

  const shouldShowImage = logoUrl && !hasImageError && !isValueEmpty(logoUrl);

  return (
    <div className={clsx('flex items-center space-x-2', className)} onClick={onClick}>
      <div
        className={clsx(
          'flex items-center justify-center w-7 h-7 rounded-full overflow-hidden bg-muted text-muted-foreground',
          logoClassName,
        )}
      >
        {shouldShowImage ? (
          <img
            src={logoUrl}
            alt={altText}
            className="object-cover w-full h-full"
            onError={() => setHasImageError(true)}
            loading="lazy"
            {...rest}
          />
        ) : !isValueEmpty(finalFallbackText) ? (
          <span className="text-sm font-semibold">{finalFallbackText}</span>
        ) : (
          <UserCircle className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {label && (
        <div ref={containerRef} className="relative max-w-32 overflow-hidden whitespace-nowrap">
          <div
            ref={textRef}
            className={clsx('inline-block', {
              'animate-marquee': shouldAnimate,
            })}
          >
            <Text type="p" className={clsx('max-w-28 w-fit', labelClassName)}>
              {label}
            </Text>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicLogo;
