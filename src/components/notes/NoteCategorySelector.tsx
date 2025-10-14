"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategorySelectorProps } from "@/lib/types";

export function NoteCategorySelector({
  value,
  categories,
  onChange,
}: CategorySelectorProps) {
  return (
    <div className="grid gap-2">
      <Label>Category</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
