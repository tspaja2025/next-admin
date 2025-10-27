"use client";

import { motion } from "framer-motion";
import { useCallback, useReducer, useState } from "react";
import { KanbanAddTaskDialog } from "@/components/kanban/KanbanAddTaskDialog";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { kanbanReducer } from "@/lib/kanban-reducer";
import { initialKanbanData } from "@/lib/kanban-utils";
import type { Task } from "@/lib/types";

export function KanbanBoard() {
  const [kanbanData, dispatch] = useReducer(kanbanReducer, initialKanbanData);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string>("");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleAddTask = useCallback((columnId: string) => {
    setActiveColumnId(columnId);
    setEditingTask(null);
    setIsAddTaskDialogOpen(true);
  }, []);

  const handleEditTask = useCallback(
    (task: Task) => {
      setEditingTask(task);
      const column = kanbanData.columns.find((col) =>
        col.tasks.some((t) => t.id === task.id),
      );
      if (column) {
        setActiveColumnId(column.id);
        setIsAddTaskDialogOpen(true);
      }
    },
    [kanbanData],
  );

  const handleSaveTask = useCallback(
    (task: Task, columnId: string) => {
      if (editingTask) {
        dispatch({ type: "EDIT_TASK", columnId, task });
      } else {
        dispatch({ type: "ADD_TASK", columnId, task });
      }
    },
    [editingTask],
  );

  const handleDeleteTask = useCallback((taskId: string) => {
    dispatch({ type: "DELETE_TASK", taskId });
  }, []);

  const handleTaskDrop = useCallback(
    (taskId: string, targetColumnId: string, targetIndex?: number) => {
      setDraggedTaskId(null);
      if (targetIndex !== undefined) {
        dispatch({
          type: "REORDER_TASK",
          columnId: targetColumnId,
          taskId,
          targetIndex,
        });
      } else {
        dispatch({ type: "MOVE_TASK", taskId, targetColumnId });
      }
    },
    [],
  );

  const handleDragStart = useCallback((taskId: string) => {
    setDraggedTaskId(taskId);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {kanbanData.columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onTaskDrop={handleTaskDrop}
            onDragStart={handleDragStart}
            draggedTaskId={draggedTaskId}
          />
        ))}
      </motion.div>

      <KanbanAddTaskDialog
        isOpen={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        onSave={handleSaveTask}
        columnId={activeColumnId}
        editingTask={editingTask}
      />
    </div>
  );
}
