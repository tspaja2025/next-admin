"use client";

import type { TitleInputProps } from "@/components/providers/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function NoteTitleInput({ value, onChange }: TitleInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={value}
        placeholder="Enter note title..."
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
