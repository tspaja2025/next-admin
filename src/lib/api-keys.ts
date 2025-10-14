import type { ApiKey } from "@/lib/types";

const STORAGE_KEY = "api_keys";

export function generateApiKey(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return "sk_" + Array.from(array, (b) => chars[b % chars.length]).join("");
}

export function getKeyPrefix(key: string): string {
  return key.substring(0, 8);
}

export function maskApiKey(prefix: string, totalLength = 32): string {
  return prefix + "*".repeat(totalLength - prefix.length);
}

export const localStorageApi = {
  getApiKeys(): ApiKey[] {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  setApiKeys(apiKeys: ApiKey[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apiKeys));
  },

  createApiKey(newKey: Omit<ApiKey, "id">): ApiKey {
    const apiKeys = localStorageApi.getApiKeys();
    const keyWithId: ApiKey = {
      ...newKey,
      id: Math.random().toString(36).substring(2) + Date.now().toString(36),
    };
    localStorageApi.setApiKeys([keyWithId, ...apiKeys]);
    return keyWithId;
  },

  deleteApiKey(id: string) {
    const apiKeys = localStorageApi.getApiKeys().filter((k) => k.id !== id);
    localStorageApi.setApiKeys(apiKeys);
  },

  updateApiKey(id: string, updates: Partial<ApiKey>) {
    const apiKeys = localStorageApi
      .getApiKeys()
      .map((k) => (k.id === id ? { ...k, ...updates } : k));
    localStorageApi.setApiKeys(apiKeys);
  },
};
