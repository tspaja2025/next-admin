"use client";

import {
  LogInIcon,
  LogOutIcon,
  SendIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/lib/types";
import { useAuth } from "@/providers/UnifiedAuthProvider";

export default function ChatsPage() {
  return <ChatInterface />;
}

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadMessages();
    trackPresence();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "messages") loadMessages();
      if (e.key?.startsWith("online-")) updateOnlineCount();
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      localStorage.removeItem(`online-${user?.id}`);
      updateOnlineCount();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = () => {
    const stored = localStorage.getItem("messages");
    const msgs = stored ? (JSON.parse(stored) as Message[]) : [];
    setMessages(msgs.sort((a, b) => a.created_at.localeCompare(b.created_at)));
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const stored = localStorage.getItem("messages");
    const msgs = stored ? (JSON.parse(stored) as Message[]) : [];

    const message: Message = {
      id: crypto.randomUUID(),
      user_id: user.id,
      username: user.type,
      content: newMessage.trim(),
      created_at: new Date().toISOString(),
    };

    msgs.push(message);
    localStorage.setItem("messages", JSON.stringify(msgs));
    setNewMessage("");
    setMessages(msgs);
  };

  const trackPresence = () => {
    if (!user) return;
    localStorage.setItem(`online-${user.id}`, "1");
    updateOnlineCount();

    const cleanup = () => {
      localStorage.removeItem(`online-${user.id}`);
      updateOnlineCount();
    };

    window.addEventListener("beforeunload", cleanup);
    return cleanup;
  };

  const updateOnlineCount = () => {
    const count = Object.keys(localStorage).filter((k) =>
      k.startsWith("online-"),
    ).length;
    setOnlineUsers(count);
  };

  const handleSignOut = () => {
    if (user) {
      localStorage.removeItem(`online-${user.id}`);
      updateOnlineCount();
    }
    signOut();
  };

  if (!user) return <AuthForm />;

  return (
    <div className="font-sans h-[calc(100vh-96px)] flex flex-col">
      <header className="border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Chat Room</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
            <UsersIcon size={16} />
            <span>{onlineUsers} online</span>
          </div>
        </div>
        <Button variant="ghost" onClick={handleSignOut} className="gap-2">
          <LogOutIcon size={18} />
          Sign Out
        </Button>
      </header>

      <ScrollArea className="flex-1 px-6 py-4">
        <div className="space-y-4">
          {messages.map((message) => {
            const isOwn = message.user_id === user.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-md ${
                    isOwn
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-white border text-slate-900"
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className={`text-sm font-semibold ${
                          isOwn ? "text-blue-100" : "text-slate-700"
                        }`}
                      >
                        {message.username}
                      </span>
                      <span
                        className={`text-xs ${
                          isOwn ? "text-blue-200" : "text-slate-500"
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed wrap-break-word">
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="border-t px-6 py-4 shadow-sm">
        <div className="flex gap-3">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <Button type="submit" disabled={!newMessage.trim()} className="gap-2">
            <SendIcon size={18} />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signInSocial, signUpSocial } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpSocial(email, password, username);
      } else {
        await signInSocial(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center mb-8">
          <CardTitle>{isSignUp ? "Create Account" : "Welcome Back"}</CardTitle>
          <CardDescription>
            {isSignUp ? "Sign up to start chatting" : "Sign in to continue"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a username"
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                "Please wait..."
              ) : (
                <>
                  {isSignUp ? (
                    <UserPlusIcon size={20} />
                  ) : (
                    <LogInIcon size={20} />
                  )}
                  {isSignUp ? "Sign Up" : "Sign In"}
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
