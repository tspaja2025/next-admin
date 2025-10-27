import type { KanbanAction, KanbanData, Task } from "@/lib/types";

export function kanbanReducer(
  state: KanbanData,
  action: KanbanAction,
): KanbanData {
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
