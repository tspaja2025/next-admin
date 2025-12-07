import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { useResource } from "@/hooks/use-resource";
import type { Todo } from "@/lib/types";

export function useTodos() {
  const { data: rawTodos, update: setTodos } = useResource<Todo[]>({
    storageKey: "todos",
    initialValue: [],
  });

  const todos = useMemo(() => {
    return rawTodos.map((t) => ({
      ...t,
      createdAt: typeof t.createdAt === "string"
        ? new Date(t.createdAt)
        : t.createdAt,
    }));
  }, [rawTodos]);

  const addTodo = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setTodos((prev) => [
        {
          id: crypto.randomUUID(),
          text: text.trim(),
          completed: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    },
    [setTodos],
  );

  const deleteTodo = useCallback(
    (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id)),
    [setTodos],
  );

  const toggleTodo = useCallback(
    (id: string) =>
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      ),
    [setTodos],
  );

  const editTodo = useCallback(
    (id: string, text: string) => {
      if (!text.trim()) return;
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, text: text.trim() } : todo,
        ),
      );
    },
    [setTodos],
  );

  const reorderTodos = useCallback(
    (activeId: string, overId: string) => {
      setTodos((prev) => {
        const oldIndex = prev.findIndex((t) => t.id === activeId);
        const newIndex = prev.findIndex((t) => t.id === overId);

        if (oldIndex === -1 || newIndex === -1) return prev;

        return arrayMove(prev, oldIndex, newIndex);
      });
    },
    [setTodos],
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
    toast.success("Cleared completed tasks");
  }, [setTodos]);

  const activeTodos = useMemo(() => todos.filter((t) => !t.completed), [todos]);
  const completedTodos = useMemo(
    () => todos.filter((t) => t.completed),
    [todos],
  );

  return {
    todos,
    activeTodos,
    completedTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    editTodo,
    reorderTodos,
    clearCompleted,
  };
}
