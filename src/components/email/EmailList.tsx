"use client";

import { EmailCard } from "@/components/email/EmailCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EmailListProps } from "@/lib/types";

export function EmailList({
  emails,
  selectedEmail,
  onEmailSelect,
  onEmailAction,
}: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-full text-muted-foreground"
        aria-live="polite"
      >
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No emails found</h3>
          <p className="text-sm">
            Try adjusting your search or check another folder
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="divide-y divide-border">
        {emails.map((email) => (
          <EmailCard
            key={email.id}
            email={email}
            isSelected={selectedEmail?.id === email.id}
            onSelect={() => onEmailSelect(email)}
            onAction={onEmailAction}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
