"use client";

import { Label } from "@/components/ui/label";
import type { ContentInputProps } from "@/lib/types";

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
