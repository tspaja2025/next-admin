"use client";

import { format } from "date-fns";
import { StarIcon } from "lucide-react";
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { EmailCardProps } from "@/lib/types";
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

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer border-0 border-b border-border rounded-none transition-all hover:bg-accent/40 group",
        isSelected && "bg-accent/60",
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleStarClick}
          className={cn(
            "h-5 w-5 mt-1 text-muted-foreground hover:text-foreground",
            email.isStarred && "text-yellow-500",
          )}
        >
          <StarIcon
            className={cn("h-4 w-4", email.isStarred && "fill-current")}
          />
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <span
              className={cn(
                "text-sm truncate",
                email.isRead
                  ? "font-normal text-muted-foreground"
                  : "font-semibold",
              )}
            >
              {email.sender}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(email.timestamp, "MMM d")}
            </span>
          </div>
          <h3 className="text-sm truncate">{email.subject}</h3>
          <p className="text-xs text-muted-foreground truncate">
            {truncateText(email.content.replace(/\n/g, " "), 80)}
          </p>
        </div>
      </div>
    </Card>
  );
});
