"use client";

import { useCallback, useMemo, useState } from "react";
import { useTodos } from "@/hooks/use-todos";
import { TodoInput } from "@/components/todo/TodoInput";
import { TodoStats } from "@/components/todo/TodoStats";
import { TodoFilters } from "@/components/todo/TodoFilters";
import { TodoList } from "@/components/todo/TodoList";
import type { FilterType } from "@/lib/types";

export default function TodoPage() {
  const { todos, setTodos, addTodo, deleteTodo, toggleTodo, clearCompleted } =
    useTodos();

  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = useCallback((id: string, text: string) => {
    setEditingId(id);
    setEditValue(text);
  }, []);

  const saveEdit = useCallback(() => {
    if (!editValue.trim()) {
      setEditingId(null);
      return;
    }
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === editingId ? { ...todo, text: editValue.trim() } : todo,
      ),
    );
    setEditingId(null);
    setEditValue("");
  }, [editValue, editingId, setTodos]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditValue("");
  }, []);

  // Derived values
  const { active, completed } = useMemo(
    () =>
      todos.reduce(
        (acc, t) => {
          t.completed ? acc.completed++ : acc.active++;
          return acc;
        },
        { active: 0, completed: 0 },
      ),
    [todos],
  );

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
          setTodos={setTodos}
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
