"use client";

import { LogOutIcon, SendIcon, UsersIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/lib/types";
import { useAuth } from "@/providers/UnifiedAuthProvider";
import AuthForm from "./AuthForm";

export function ChatInterface() {
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
                    <p className="text-sm leading-relaxed break-words">
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
