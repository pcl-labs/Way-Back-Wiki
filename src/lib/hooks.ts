import { useCallback, useRef, useEffect } from 'react';
import debounce from 'lodash.debounce';

interface DebouncedFunction {
  (value: string): void;
  cancel?: () => void;
}

export function useDebounce(
  callback: (value: string) => Promise<void> | void,
  delay: number
): DebouncedFunction {
  const debouncedFn = useRef<DebouncedFunction>();

  useEffect(() => {
    debouncedFn.current = debounce((value: string) => {
      callback(value);
    }, delay);

    return () => {
      if (debouncedFn.current?.cancel) {
        debouncedFn.current.cancel();
      }
    };
  }, [callback, delay]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((value: string) => {
    debouncedFn.current?.(value);
  }, []);
}