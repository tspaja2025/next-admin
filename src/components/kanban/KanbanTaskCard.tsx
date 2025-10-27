"use client";

import { motion } from "framer-motion";
import {
  CalendarIcon,
  Edit3Icon,
  MoreVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPriorityColor, getPriorityTextColor } from "@/lib/kanban-utils";
import type { KanbanTaskCardProps } from "@/lib/types";

export function KanbanTaskCard({
  task,
  onEdit,
  onDelete,
  isDragging,
  onDragStart,
  onDragOver,
}: KanbanTaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(task.id);
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
      <Card
        data-task-id={task.id}
        draggable
        onDragStart={handleDragStart}
        onDragOver={onDragOver}
        className={`border border-border/40 bg-background/80 rounded-lg p-3 transition-all cursor-grab active:cursor-grabbing ${
          isDragging ? "opacity-50 ring-2 ring-primary/50" : "hover:shadow-sm"
        }`}
      >
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit3Icon className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="text-red-600"
              >
                <Trash2Icon className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        <CardFooter className="flex justify-between items-center text-xs text-muted-foreground px-0 pt-2">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            {new Date(task.createdAt).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
          <Badge
            className={`capitalize ${getPriorityColor(task.priority)} ${getPriorityTextColor(
              task.priority,
            )}`}
          >
            {task.priority}
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
