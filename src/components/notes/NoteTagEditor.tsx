"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TagEditorProps } from "@/lib/types";

export function NoteTagEditor({ tags, onAdd, onRemove }: TagEditorProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setTagInput("");
    }
  };

  return (
    <div>
      <Label className="mb-2">Tags</Label>
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === ",") && handleAdd()}
        />
        <Button type="button" onClick={handleAdd}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            className="hover:bg-muted-foreground cursor-pointer"
            onClick={() => onRemove(tag)}
          >
            {tag} <XIcon />
          </Badge>
        ))}
      </div>
    </div>
  );
}
