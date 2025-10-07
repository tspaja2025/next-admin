"use client";

import { useEffect, useState } from "react";

// Detect ISO date strings and revive into Date objects
function dateReviver(_key: string, value: string) {
  if (typeof value === "string") {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (isoDatePattern.test(value)) {
      return new Date(value);
    }
  }
  return value;
}

// Ensure Date is serialized as ISO string
function dateReplacer(_key: string, value: Date) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return value;
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved, dateReviver) as T) : initial;
    } catch (err) {
      console.error("Error reading localStorage key", key, err);
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value, dateReplacer));
    } catch (err) {
      console.error("Error writing to localStorage key", key, err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
