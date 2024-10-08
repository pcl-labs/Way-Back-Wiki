import { useCallback, useRef } from 'react';

type DebouncedFunction<T extends (...args: never[]) => unknown> = (...args: Parameters<T>) => void;

export function useDebounce<T extends (...args: never[]) => unknown>(
  callback: T,
  delay: number
): DebouncedFunction<T> {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}