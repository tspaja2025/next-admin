"use client";

import { AuthProvider } from "@/components/chat/AuthProvider";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default function ChatsPage() {
  return (
    <AuthProvider>
      <ChatInterface />
    </AuthProvider>
  );
}
