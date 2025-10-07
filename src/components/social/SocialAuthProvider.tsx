"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  full_name: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SocialAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check localStorage for a saved user
  useEffect(() => {
    const storedUser = localStorage.getItem("demo_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    // For demo: Save user credentials in localStorage
    const users = JSON.parse(localStorage.getItem("demo_users") || "[]");

    if (users.find((u: any) => u.email === email)) {
      throw new Error("User already exists");
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password, // ⚠️ Only for demo, never store plaintext passwords in real apps
      full_name: fullName,
    };

    users.push(newUser);
    localStorage.setItem("demo_users", JSON.stringify(users));
    localStorage.setItem("demo_user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const signIn = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("demo_users") || "[]");
    const existingUser = users.find(
      (u: any) => u.email === email && u.password === password,
    );

    if (!existingUser) {
      throw new Error("Invalid email or password");
    }

    localStorage.setItem("demo_user", JSON.stringify(existingUser));
    setUser(existingUser);
  };

  const signOut = async () => {
    localStorage.removeItem("demo_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
