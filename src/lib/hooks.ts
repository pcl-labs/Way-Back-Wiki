import { useCallback } from 'react';
import debounce from 'lodash.debounce';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  return useCallback(debounce(callback, delay), []);
}