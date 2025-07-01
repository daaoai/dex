import { useRef, useEffect } from 'react';

export function useDebouncedCallback(callback: (...args: unknown[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function debouncedFunction(...args: unknown[]) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedFunction;
}
