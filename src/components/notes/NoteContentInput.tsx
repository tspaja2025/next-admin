"use client";

import type { ContentInputProps } from "@/components/providers/types";
import { Label } from "@/components/ui/label";

export function NoteContentInput({ value, onChange }: ContentInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="content">Content</Label>
      <textarea
        id="content"
        className="w-full rounded-md border p-2"
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
