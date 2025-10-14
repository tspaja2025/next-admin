"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TodoInputProps } from "@/lib/types";

export function TodoInput({ value, onChange, onAdd }: TodoInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onAdd();
  };

  return (
    <Card>
      <CardContent>
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={onAdd} disabled={!value.trim()}>
            <PlusIcon />
            Add Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
