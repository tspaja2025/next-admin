import { useEffect, useState } from "react";

export function useDebounce<T>(
  value: T,
  delay: number,
  options: { leading?: boolean } = {},
): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (options.leading) {
      setDebounced(value);
      return;
    }

    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay, options.leading]);

  return debounced;
}
