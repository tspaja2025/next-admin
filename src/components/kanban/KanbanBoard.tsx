"use client";

import { useCallback, useReducer, useState } from "react";
import AddTaskDialog from "@/components/kanban/KanbanAddTaskDialog";
import KanbanColumn from "@/components/kanban/KanbanColumn";
import type { KanbanData, Task } from "@/components/providers/types";
import { initialKanbanData } from "@/lib/kanban-utils";

type KanbanAction =
  | { type: "ADD_TASK"; columnId: string; task: Task }
  | { type: "EDIT_TASK"; columnId: string; task: Task }
  | { type: "DELETE_TASK"; taskId: string }
  | { type: "MOVE_TASK"; taskId: string; targetColumnId: string }
  | {
      type: "REORDER_TASK";
      columnId: string;
      taskId: string;
      targetIndex: number;
    };

function kanbanReducer(state: KanbanData, action: KanbanAction): KanbanData {
  switch (action.type) {
    case "ADD_TASK":
      return {
        columns: state.columns.map((col) =>
          col.id === action.columnId
            ? { ...col, tasks: [...col.tasks, action.task] }
            : col,
        ),
      };

    case "EDIT_TASK":
      return {
        columns: state.columns.map((col) => {
          const filtered = col.tasks.filter((t) => t.id !== action.task.id);
          return col.id === action.columnId
            ? { ...col, tasks: [...filtered, action.task] }
            : { ...col, tasks: filtered };
        }),
      };

    case "DELETE_TASK":
      return {
        columns: state.columns.map((col) => ({
          ...col,
          tasks: col.tasks.filter((t) => t.id !== action.taskId),
        })),
      };

    case "MOVE_TASK": {
      let movedTask: Task | null = null;
      const withoutTask = state.columns.map((col) => {
        if (col.tasks.some((t) => t.id === action.taskId)) {
          movedTask = col.tasks.find((t) => t.id === action.taskId)!;
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== action.taskId),
          };
        }
        return col;
      });

      return {
        columns: withoutTask.map((col) =>
          col.id === action.targetColumnId && movedTask
            ? { ...col, tasks: [...col.tasks, movedTask] }
            : col,
        ),
      };
    }

    case "REORDER_TASK": {
      return {
        columns: state.columns.map((col) => {
          if (col.id !== action.columnId) return col;

          const tasks = [...col.tasks];
          const taskIndex = tasks.findIndex((t) => t.id === action.taskId);
          if (taskIndex === -1) return col;

          const [movedTask] = tasks.splice(taskIndex, 1);
          tasks.splice(action.targetIndex, 0, movedTask);

          return { ...col, tasks };
        }),
      };
    }

    default:
      return state;
  }
}

export default function KanbanBoard() {
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
      // Find which column contains this task
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
        // Reorder inside same column
        dispatch({
          type: "REORDER_TASK",
          columnId: targetColumnId,
          taskId,
          targetIndex,
        });
      } else {
        // Move across columns
        dispatch({ type: "MOVE_TASK", taskId, targetColumnId });
      }
    },
    [],
  );

  const handleDragStart = useCallback((taskId: string) => {
    setDraggedTaskId(taskId);
  }, []);

  return (
    <div className="flex-1 gap-4 flex flex-col">
      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
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
      </div>

      {/* Add/Edit Task Dialog */}
      <AddTaskDialog
        isOpen={isAddTaskDialogOpen}
        onClose={() => setIsAddTaskDialogOpen(false)}
        onSave={handleSaveTask}
        columnId={activeColumnId}
        editingTask={editingTask}
      />
    </div>
  );
}
