"use client";

import { useCallback } from "react";
import { useLocalStorage } from "@/hooks/use-localstorage";
import type { Todo } from "@/lib/types";

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);

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
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    [setTodos],
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    },
    [setTodos],
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  return {
    todos,
    setTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
  };
}
