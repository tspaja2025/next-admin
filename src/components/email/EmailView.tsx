"use client";

import { format } from "date-fns";
import {
  ArchiveIcon,
  ArrowLeftIcon,
  ForwardIcon,
  MoreHorizontalIcon,
  ReplyAllIcon,
  ReplyIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import React from "react";
import { EmailAttachment } from "@/components/email/EmailAttachment";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            aria-label="Back"
          >
            <ArrowLeftIcon />
          </Button>
          <h2 className="font-semibold text-foreground truncate">
            {email.subject}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReply}
            aria-label="Reply"
          >
            <ReplyIcon />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onStar}
            aria-label={email.isStarred ? "Unstar email" : "Star email"}
            className={cn({
              "text-yellow-500 hover:text-yellow-600": email.isStarred,
            })}
          >
            <StarIcon
              className={cn("h-4 w-4", email.isStarred && "fill-current")}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onArchive}
            aria-label="Archive"
          >
            <ArchiveIcon />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            aria-label="Delete"
            className="hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="More actions">
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ReplyAllIcon /> Reply all
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ForwardIcon /> Forward
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Email Content */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          {/* Sender Info */}
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(email.sender)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {email.sender}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {email.senderEmail}
                  </p>
                </div>
                <div className="text-right">
                  <time className="text-sm text-muted-foreground">
                    {format(email.timestamp, "MMM d, yyyy 'at' h:mm a")}
                  </time>
                  {!email.isRead && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Unread
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                <span>to</span>
                <span className="font-medium">{email.recipient}</span>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {email.content || <em>No content available</em>}
            </div>
          </div>

          {/* Attachments */}
          {email.attachments.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="font-medium text-foreground mb-3">
                Attachments ({email.attachments.length})
              </h4>
              <div className="space-y-2">
                {email.attachments.map((attachment) => (
                  <EmailAttachment
                    key={attachment.id}
                    attachment={attachment}
                    onDownload={(file) => {
                      // TODO: wire up your download logic here
                      console.log("Download", file);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Reply Actions */}
      <div className="p-4 border-t border-border bg-muted">
        <div className="flex items-center gap-2">
          <Button
            onClick={onReply}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ReplyIcon /> Reply
          </Button>
          <Button variant="outline">
            <ReplyAllIcon /> Reply all
          </Button>
          <Button variant="outline">
            <ForwardIcon /> Forward
          </Button>
        </div>
      </div>
    </div>
  );
});
