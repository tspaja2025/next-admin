"use client";

import type { EmailAttachmentProps } from "@/components/providers/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmailAttachment({
  attachment,
  onDownload,
}: EmailAttachmentProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 border border-border rounded-lg",
        "hover:bg-accent cursor-pointer transition-colors",
      )}
    >
      <div className="flex-1">
        <p className="font-medium text-foreground">{attachment.name}</p>
        <p className="text-sm text-muted-foreground">{attachment.size}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        aria-label={`Download ${attachment.name}`}
        onClick={(e) => {
          e.stopPropagation();
          onDownload?.(attachment);
        }}
      >
        Download
      </Button>
    </div>
  );
}
