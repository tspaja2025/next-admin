"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/Provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function SignInForm() {
  const { signInSocial } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) signInSocial(email.trim(), password.trim());
  };

  return (
    <div className="font-sans h-screen flex items-center justify-center">
      <Card className="w-80">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Join the Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={!email.trim()}>
              Enter Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
