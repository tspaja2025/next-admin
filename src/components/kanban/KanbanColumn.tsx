"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { KanbanTaskCard } from "@/components/kanban/KanbanTaskCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { KanbanColumnProps } from "@/lib/types";

export function KanbanColumn({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onTaskDrop,
  onDragStart,
  draggedTaskId,
}: KanbanColumnProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setHoverIndex(index ?? null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const taskElements = Array.from(
      e.currentTarget.querySelectorAll("[data-task-id]"),
    ) as HTMLElement[];

    let targetIndex = column.tasks.length;
    for (let i = 0; i < taskElements.length; i++) {
      const rect = taskElements[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        targetIndex = i;
        break;
      }
    }

    if (column.tasks.some((t) => t.id === taskId)) {
      onTaskDrop(taskId, column.id, targetIndex);
    } else {
      onTaskDrop(taskId, column.id);
    }

    setHoverIndex(null);
  };

  return (
    <Card className="bg-muted/40 border border-border/40 rounded-lg flex flex-col">
      <CardHeader className="flex items-center justify-between p-3 border-b border-border/50">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {column.title}
          <Badge variant="secondary">{column.tasks.length}</Badge>
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddTask(column.id)}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={() => setHoverIndex(null)}
        className={`flex-1 space-y-3 p-3 transition-all ${
          draggedTaskId
            ? "border-2 border-dashed rounded-lg border-primary/30"
            : ""
        }`}
      >
        <AnimatePresence>
          {column.tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              {hoverIndex === index && (
                <motion.div
                  layout
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.15 }}
                  className="h-1 bg-primary rounded mb-1 origin-left"
                />
              )}
              <KanbanTaskCard
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                isDragging={draggedTaskId === task.id}
                onDragStart={() => onDragStart?.(task.id)}
                onDragOver={(e) => handleDragOver(e, index)}
              />
            </motion.div>
          ))}

          {column.tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-24 text-muted-foreground text-sm">
              <span>No tasks yet</span>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => onAddTask(column.id)}
              >
                <PlusIcon className="w-4 h-4 mr-1" /> Add Task
              </Button>
            </div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
