"use client";

import { format } from "date-fns";
import { CalendarIcon, EditIcon, PinIcon, Trash2Icon } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { NoteCardProps } from "@/lib/types";

export const NoteCard = React.memo(function NoteCard({
  note,
  categories,
  onEdit,
  onDelete,
  onTogglePin,
  viewMode,
}: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const truncatedContent =
    note.content.length > 150
      ? note.content.substring(0, 150) + "..."
      : note.content;

  const categoryName =
    categories.find((c) => c.id === note.category)?.name ?? "Uncategorized";

  return (
    <Card
      className={`group transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 cursor-pointer border-l-4 ${
        note.isPinned
          ? "border-l-yellow-400 bg-yellow-50/30"
          : "border-l-transparent"
      } ${viewMode === "list" ? "p-4" : "p-6"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(note)}
    >
      <div
        className={`flex ${viewMode === "list" ? "flex-row items-center gap-4" : "flex-col"}`}
      >
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3
              className={`font-semibold text-foreground line-clamp-2 ${
                viewMode === "list" ? "text-base" : "text-lg"
              }`}
            >
              {note.title}
            </h3>
            <div
              className={`flex items-center gap-1 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className={`h-8 w-8 ${note.isPinned ? "text-yellow-600" : "text-muted-foreground"}`}
              >
                <PinIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                className="h-8 w-8 text-muted-foreground hover:text-primary"
              >
                <EditIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
              {truncatedContent}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {categoryName}
              </Badge>
              {note.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 2}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              {format(new Date(note.updatedAt), "MMM dd")}
            </div>
          </div>
        </div>

        {viewMode === "list" && (
          <div className="text-sm text-muted-foreground max-w-md">
            {truncatedContent}
          </div>
        )}
      </div>
    </Card>
  );
});
