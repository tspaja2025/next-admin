"use client";

import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FilterType, TodoFiltersProps } from "@/lib/types";

export function TodoFilters({
  filter,
  onChange,
  onClearCompleted,
  completed,
}: TodoFiltersProps) {
  return (
    <div className="flex gap-2">
      {(["all", "active", "completed"] as FilterType[]).map((type) => (
        <Button
          key={type}
          variant={filter === type ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(type)}
          className="capitalize"
        >
          {type}
        </Button>
      ))}
      {completed > 0 && (
        <Button variant="outline" size="sm" onClick={onClearCompleted}>
          <Trash2Icon className="w-4 h-4 mr-1" />
          Clear Completed
        </Button>
      )}
    </div>
  );
}
