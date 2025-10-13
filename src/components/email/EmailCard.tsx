"use client";

import { format } from "date-fns";
import {
  ArchiveIcon,
  MoreHorizontalIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import React, { useCallback } from "react";
import type { EmailCardProps } from "@/components/providers/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function truncateText(text: string, maxLength: number) {
  return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
}

export const EmailCard = React.memo(function EmailCard({
  email,
  isSelected,
  onSelect,
  onAction,
}: EmailCardProps) {
  const handleStarClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAction("star", email);
    },
    [onAction, email],
  );

  const handleArchiveClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAction("archive", email);
    },
    [onAction, email],
  );

  return (
    <Card
      tabIndex={0}
      className={cn(
        "p-4 cursor-pointer rounded-none shadow-none border-0 border-b transition-all duration-200 hover:bg-accent border-l-4 group",
        {
          "bg-accent border-l-primary": isSelected,
          "border-l-transparent": email.isRead && !isSelected,
          "border-l-primary/60 bg-accent/30": !email.isRead && !isSelected,
        },
      )}
      onClick={onSelect}
      onKeyDown={onSelect}
    >
      <div className="flex items-start gap-3">
        {/* Star */}
        <Button
          variant="ghost"
          size="sm"
          aria-label={email.isStarred ? "Unstar email" : "Star email"}
          className={cn(
            "p-0 h-5 w-5 mt-1",
            email.isStarred
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-muted-foreground hover:text-foreground",
          )}
          onClick={handleStarClick}
        >
          <StarIcon
            className={cn("h-4 w-4", email.isStarred && "fill-current")}
          />
        </Button>

        {/* Email Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span
              className={cn(
                "text-sm truncate",
                email.isRead
                  ? "font-normal text-muted-foreground"
                  : "font-semibold text-foreground",
              )}
            >
              {email.sender}
            </span>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs text-muted-foreground">
                {format(email.timestamp, "MMM d")}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="More actions"
                    className="p-0 h-4 w-4 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() => onAction("markUnread", email)}
                  >
                    Mark as unread
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchiveClick}>
                    <ArchiveIcon className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAction("delete", email)}>
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <h3
            className={cn(
              "text-sm mb-1 truncate",
              email.isRead
                ? "font-normal text-muted-foreground"
                : "font-medium text-foreground",
            )}
          >
            {email.subject}
          </h3>

          <p className="text-xs text-muted-foreground truncate">
            {truncateText(email.content.replace(/\n/g, " "), 100)}
          </p>

          {!email.isRead && (
            <Badge variant="secondary" className="mt-2 text-xs">
              Unread
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
});
