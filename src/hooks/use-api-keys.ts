import { useCallback, useState } from "react";
import { toast } from "sonner";
import { generateApiKey, getKeyPrefix, localStorageApi } from "@/lib/api-keys";
import type { ApiKey } from "@/lib/types";

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() =>
    localStorageApi.getApiKeys(),
  );

  const refresh = useCallback(() => {
    setApiKeys(localStorageApi.getApiKeys());
  }, []);

  const createKey = useCallback(
    (name: string) => {
      if (!name.trim()) {
        toast.error("Please enter a name for the API key");
        return null;
      }
      const fullKey = generateApiKey();
      localStorageApi.createApiKey({
        name,
        key_prefix: getKeyPrefix(fullKey),
        created_at: new Date().toISOString(),
        last_used_at: null,
        expires_at: null,
        is_active: true,
      });
      refresh();
      return fullKey;
    },
    [refresh],
  );

  const deleteKey = useCallback(
    (id: string) => {
      localStorageApi.deleteApiKey(id);
      refresh();
      toast.success("API key deleted successfully");
    },
    [refresh],
  );

  return { apiKeys, createKey, deleteKey, refresh };
}
