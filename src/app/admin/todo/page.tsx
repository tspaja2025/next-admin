"use client";

import { useCallback, useMemo, useState } from "react";
import { TodoFilters } from "@/components/todo/TodoFilters";
import { TodoInput } from "@/components/todo/TodoInput";
import { TodoList } from "@/components/todo/TodoList";
import { TodoStats } from "@/components/todo/TodoStats";
import { useTodos } from "@/hooks/use-todos";
import type { FilterType } from "@/lib/types";
import { useAuth } from "@/providers/UnifiedAuthProvider";

export default function TodoPage() {
  const {
    todos,
    addTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    reorderTodos,
  } = useTodos();

  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { loading } = useAuth();

  const startEditing = useCallback((id: string, text: string) => {
    setEditingId(id);
    setEditValue(text);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editValue.trim()) {
      setEditingId(null);
      return;
    }
    setEditingId(null);
    setEditValue("");
  }, [editValue, editingId]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValue("");
  }, []);

  // Derived values
  const { active, completed } = useMemo(() => {
    return {
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    };
  }, [todos]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-4">
        {/* Add Todo */}
        <TodoInput
          value={inputValue}
          onChange={setInputValue}
          onAdd={() => {
            addTodo(inputValue);
            setInputValue("");
          }}
        />

        {/* Stats & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <TodoStats
            active={active}
            completed={completed}
            total={todos.length}
          />
          <TodoFilters
            filter={filter}
            onChange={setFilter}
            onClearCompleted={clearCompleted}
            completed={completed}
          />
        </div>

        {/* Todo List with animations */}
        <TodoList
          todos={todos}
          filter={filter}
          editingId={editingId}
          editValue={editValue}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onStartEdit={startEditing}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onEditChange={setEditValue}
          reorderTodos={reorderTodos}
        />

        {/* Footer */}
        {todos.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>
              Click on a task to edit it • Press <kbd>Enter</kbd> to save •{" "}
              <kbd>Esc</kbd> to cancel
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
