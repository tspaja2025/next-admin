"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import KanbanTaskCard from "@/components/kanban/KanbanTaskCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { KanbanColumnProps } from "@/lib/types";

export default function KanbanColumn({
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

    if (index !== undefined) {
      setHoverIndex(index);
    } else {
      setHoverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    // Find target position inside this column
    const taskElements = Array.from(
      e.currentTarget.querySelectorAll("[data-task-id]"),
    ) as HTMLElement[];

    let targetIndex = column.tasks.length; // default: append to end
    for (let i = 0; i < taskElements.length; i++) {
      const rect = taskElements[i].getBoundingClientRect();
      if (e.clientY < rect.top + rect.height / 2) {
        targetIndex = i;
        break;
      }
    }

    // If dropped in same column → reorder
    if (column.tasks.some((t) => t.id === taskId)) {
      onTaskDrop(taskId, column.id, targetIndex);
    } else {
      // Moved across columns → append at end
      onTaskDrop(taskId, column.id);
    }

    setHoverIndex(null);
  };

  const handleDragLeave = () => setHoverIndex(null);

  return (
    <Card className="flex-1 h-fit shadow-none bg-secondary/90 rounded-md p-0">
      <CardHeader className="p-2 flex items-center justify-between">
        <CardTitle className="flex gap-2 items-center">
          {column.title}
          <span className="text-xs text-muted-foreground">
            {column.tasks.length}
          </span>
        </CardTitle>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddTask(column.id)}
          >
            <PlusIcon />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent
        role="list"
        aria-dropeffect="move"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        className={`flex-1 space-y-3 transition-all duration-200 min-h-[120px] ${
          draggedTaskId ? "border-2 border-dashed rounded-lg p-2" : "p-2"
        }`}
      >
        <AnimatePresence>
          {column.tasks.map((task, index) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {hoverIndex === index && (
                <motion.div
                  layout
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.2 }}
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

          {/* If hovering past the last item */}
          {hoverIndex === column.tasks.length && (
            <motion.div
              layout
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 0.2 }}
              className="h-1 bg-primary rounded mt-1 origin-left"
            />
          )}
        </AnimatePresence>

        {/* If hovering past the last item */}
        {hoverIndex === column.tasks.length && (
          <div className="h-1 bg-primary rounded mt-1 transition-all" />
        )}

        {column.tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-gray-400 text-sm">
            <span>Drop tasks here</span>
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
      </CardContent>
    </Card>
  );
}
