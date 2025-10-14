"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoryManagerProps } from "@/lib/types";

const PRESET_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#F97316",
  "#84CC16",
  "#8B5A2B",
  "#64748B",
];

export function NoteCategoryManager({
  isOpen,
  onClose,
  onCreateCategory,
  onDeleteCategory,
  categories,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleCreate = () => {
    if (newCategoryName.trim()) {
      onCreateCategory(newCategoryName.trim(), selectedColor);
      setNewCategoryName("");
      setSelectedColor(PRESET_COLORS[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Category */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name..."
                className="mt-2"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {PRESET_COLORS.map((color) => (
                  <Button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-foreground scale-110"
                        : "border-border hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={!newCategoryName.trim()}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>

          {/* Existing Categories */}
          <div className="space-y-2">
            <Label>Existing Categories</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({category.count} notes)
                    </span>
                  </div>

                  {category.name !== "Personal" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCategory(category.id)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
