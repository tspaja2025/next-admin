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
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPriorityColor, getPriorityTextColor } from "@/lib/kanban-utils";
import type { TaskCardProps } from "@/lib/types";

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  isDragging,
  onDragStart,
  onDragOver,
}: TaskCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
    onDragStart?.(task.id);
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Card
        data-task-id={task.id}
        role="listitem"
        aria-grabbed={isDragging}
        draggable
        onDragStart={handleDragStart}
        onDragOver={onDragOver}
        className={`gap-0 p-0 rounded-md shadow-none group hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing ${
          isDragging ? "opacity-50 ring-2 ring-primary scale-105" : ""
        }`}
      >
        <CardHeader className="p-4 px-2">
          <CardTitle className="truncate">{task.title}</CardTitle>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit3Icon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(task.id)}
                  className="text-red-600"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>

        {task.description && (
          <CardContent className="px-2 text-gray-500 truncate">
            {task.description}
          </CardContent>
        )}

        <CardFooter className="flex items-center gap-2 p-2">
          <div
            className="flex items-center text-xs text-gray-400"
            suppressHydrationWarning
          >
            <CalendarIcon className="h-3 w-3 mr-1" />
            {task.createdAt.toLocaleDateString()}
          </div>
          <Badge
            className={`text-xs font-medium capitalize ${getPriorityTextColor(
              task.priority,
            )} ${getPriorityColor(task.priority)}`}
          >
            {task.priority}
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
