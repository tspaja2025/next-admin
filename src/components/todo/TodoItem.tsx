"use client";

import { motion } from "framer-motion";
import {
  CheckIcon,
  CheckSquareIcon,
  Edit3Icon,
  SquareIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TodoItemProps } from "@/lib/types";

export function TodoItem({
  todo,
  editingId,
  editValue,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
}: TodoItemProps) {
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSaveEdit();
    if (e.key === "Escape") onCancelEdit();
  };

  return (
    <motion.div
      key={todo.id}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="flex-1"
    >
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(todo.id)}
              aria-label={
                todo.completed ? "Mark as active" : "Mark as completed"
              }
            >
              {todo.completed ? <CheckSquareIcon /> : <SquareIcon />}
            </Button>

            <div className="flex-1">
              {editingId === todo.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => onEditChange(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onBlur={onSaveEdit}
                  autoFocus
                />
              ) : (
                <span
                  onClick={() =>
                    !todo.completed && onStartEdit(todo.id, todo.text)
                  }
                  className={
                    todo.completed
                      ? "line-through text-gray-500"
                      : "cursor-text"
                  }
                >
                  {todo.text}
                </span>
              )}
              <div className="text-xs text-gray-400 mt-1">
                Created {todo.createdAt.toLocaleDateString()} at{" "}
                {todo.createdAt.toLocaleTimeString()}
              </div>
            </div>

            <div className="flex gap-1">
              {editingId === todo.id ? (
                <>
                  <Button variant="ghost" size="sm" onClick={onSaveEdit}>
                    <CheckIcon />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                    <XIcon />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStartEdit(todo.id, todo.text)}
                  >
                    <Edit3Icon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(todo.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
