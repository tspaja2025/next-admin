"use client";

import { format } from "date-fns";
import {
  ArchiveIcon,
  ForwardIcon,
  ReplyAllIcon,
  ReplyIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import React from "react";
import { EmailAttachment } from "@/components/mail/EmailAttachment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EmailViewProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export const EmailView = React.memo(function EmailView({
  email,
  onReply,
  onArchive,
  onDelete,
  onStar,
}: EmailViewProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b bg-muted/30 backdrop-blur-sm">
        <h2 className="font-semibold truncate">{email.subject}</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onReply}>
            <ReplyIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStar}
            className={cn(email.isStarred && "text-yellow-500")}
          >
            <StarIcon
              className={cn("h-4 w-4", email.isStarred && "fill-current")}
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={onArchive}>
            <ArchiveIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-destructive"
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-8">
        <div className="flex items-start gap-4 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {getInitials(email.sender)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{email.sender}</h3>
            <p className="text-sm text-muted-foreground">{email.senderEmail}</p>
            <time className="text-xs text-muted-foreground block mt-1">
              {format(email.timestamp, "MMM d, yyyy 'at' h:mm a")}
            </time>
          </div>
        </div>

        <div className="whitespace-pre-wrap leading-relaxed text-sm text-foreground">
          {email.content || <em>No content available</em>}
        </div>

        {email.attachments.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <h4 className="font-medium mb-3">
              Attachments ({email.attachments.length})
            </h4>
            <div className="space-y-2">
              {email.attachments.map((a) => (
                <EmailAttachment
                  key={a.id}
                  attachment={a}
                  onDownload={() => console.log("Download", a.name)}
                />
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Reply Bar */}
      <div className="p-4 border-t bg-muted/30 backdrop-blur-sm">
        <div className="flex gap-2">
          <Button onClick={onReply}>
            <ReplyIcon className="mr-2 h-4 w-4" /> Reply
          </Button>
          <Button variant="outline">
            <ReplyAllIcon className="mr-2 h-4 w-4" /> Reply all
          </Button>
          <Button variant="outline">
            <ForwardIcon className="mr-2 h-4 w-4" /> Forward
          </Button>
        </div>
      </div>
    </div>
  );
});
