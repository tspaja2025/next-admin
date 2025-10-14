"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import type {
  AuthUser,
  LocalUser,
  SocialUser,
  UnifiedAuthContextType,
} from "@/lib/types";

const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(
  undefined,
);

export function UnifiedAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    }
    setLoading(false);
  }, []);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.AUTH_USER && e.newValue !== e.oldValue) {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Local (simple) sign-in
  const signInLocal = useCallback(
    (username: string) => {
      clearError();
      const newUser: LocalUser = {
        id: crypto.randomUUID(),
        username,
        type: "local",
      };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));
    },
    [clearError],
  );

  // Social sign-up
  const signUpSocial = useCallback(
    async (email: string, password: string, fullName: string) => {
      clearError();
      try {
        const users = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.DEMO_USERS) || "[]",
        );

        if (users.find((u: any) => u.email === email)) {
          throw new Error("User with this email already exists");
        }

        const newUser: SocialUser = {
          id: crypto.randomUUID(),
          email,
          full_name: fullName,
          type: "social",
        };

        users.push({ ...newUser, password });
        localStorage.setItem(STORAGE_KEYS.DEMO_USERS, JSON.stringify(users));
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));
        setUser(newUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
        throw err;
      }
    },
    [clearError],
  );

  // Social sign-in
  const signInSocial = useCallback(
    async (email: string, password: string) => {
      clearError();
      try {
        const users = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.DEMO_USERS) || "[]",
        );
        const existing = users.find(
          (u: any) => u.email === email && u.password === password,
        );

        if (!existing) throw new Error("Invalid email or password");

        const user: SocialUser = {
          id: existing.id,
          email: existing.email,
          full_name: existing.full_name,
          type: "social",
        };

        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign in failed");
        throw err;
      }
    },
    [clearError],
  );

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    clearError();
  }, [clearError]);

  const value = useMemo(
    (): UnifiedAuthContextType => ({
      user,
      loading,
      error,
      signInLocal,
      signInSocial,
      signUpSocial,
      signOut,
      clearError,
    }),
    [
      user,
      loading,
      error,
      signInLocal,
      signInSocial,
      signUpSocial,
      signOut,
      clearError,
    ],
  );

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a UnifiedAuthProvider");
  }
  return context;
}
