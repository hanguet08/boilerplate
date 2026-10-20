import { useCallback, useEffect, useState } from 'react';
import { parseJSON, stringifyJSON } from '@/ultils/function';

/** State mirrored to localStorage; starts with `initialValue` on the server, then hydrates on mount. */
export default function useLocalStorage<T>(key: string | null, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!key) return;
    try {
      const stored = parseJSON(localStorage.getItem(key));
      setValue(stored ?? initialValue);
    } catch {
      setValue(initialValue);
    }
    setHydrated(true);
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
        try {
          if (key) localStorage.setItem(key, stringifyJSON(resolved));
        } catch {
          // storage may be unavailable (private mode) — keep in-memory state only
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}
