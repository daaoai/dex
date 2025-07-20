import { cn } from '@/shadcn/lib/utils';

interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Shimmer = ({ className, width = 'w-full', height = 'h-4' }: ShimmerProps) => {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] rounded-md',
        width,
        height,
        className,
      )}
      style={{
        animation: 'shimmer-bg 2s ease-in-out infinite',
      }}
    />
  );
};

// Add this to your global CSS or create a separate shimmer.css file
export const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;
