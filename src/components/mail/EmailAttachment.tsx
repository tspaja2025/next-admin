"use client";

import { Button } from "@/components/ui/button";
import type { EmailAttachmentProps } from "@/lib/types";

export function EmailAttachment({
  attachment,
  onDownload,
}: EmailAttachmentProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/30 transition">
      <div>
        <p className="font-medium text-sm">{attachment.name}</p>
        <p className="text-xs text-muted-foreground">{attachment.size}</p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onDownload?.(attachment)}
      >
        Download
      </Button>
    </div>
  );
}
