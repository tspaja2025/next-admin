"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/chat/AuthProvider";

export function SignInForm() {
  const { signIn } = useAuth();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) signIn(username.trim());
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
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={!username.trim()}
            >
              Enter Chat
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
