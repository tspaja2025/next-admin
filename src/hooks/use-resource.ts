import { useCallback, useState } from "react";
import { useLocalStorage } from "@/hooks/use-localstorage";

export function useResource<T>({
  storageKey,
  initialValue,
  onError,
}: {
  storageKey: string;
  initialValue: T;
  onError?: (error: Error) => void;
}) {
  const [data, setData] = useLocalStorage<T>(storageKey, initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (updater: T | ((current: T) => T | Promise<T>)) => {
      try {
        setLoading(true);
        setError(null);
        const nextValue =
          updater instanceof Function ? await updater(data) : updater;
        setData(nextValue);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Update failed");
        setError(error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [data, setData, onError],
  );

  return { data, loading, error, update };
}
