"use client";

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { TodoItem } from "@/components/todo/TodoItem";
import { TodoSortable } from "@/components/todo/TodoSortable";
import { Card, CardContent } from "@/components/ui/card";
import type { TodoListProps } from "@/lib/types";

export function TodoList({
  todos,
  filter,
  editingId,
  editValue,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
  setTodos,
}: TodoListProps) {
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTodos((prev) => {
        const oldIndex = prev.findIndex((t) => t.id === active.id);
        const newIndex = prev.findIndex((t) => t.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="space-y-3">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={filteredTodos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {filteredTodos.length === 0 ? (
              <Card>
                <CardContent className="text-center">
                  <div className="text-lg mb-2">
                    {filter === "active" && todos.some((t) => t.completed)
                      ? "All tasks completed!"
                      : filter === "completed"
                        ? "No completed tasks yet"
                        : "No tasks yet. Add your first task above!"}
                  </div>
                  {filter === "all" && todos.length === 0 && (
                    <p className="text-gray-500 text-sm">
                      Start by adding a task to get organized
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredTodos.map((todo) => (
                <TodoSortable key={todo.id} id={todo.id}>
                  <TodoItem
                    todo={todo}
                    editingId={editingId}
                    editValue={editValue}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onStartEdit={onStartEdit}
                    onSaveEdit={onSaveEdit}
                    onCancelEdit={onCancelEdit}
                    onEditChange={onEditChange}
                  />
                </TodoSortable>
              ))
            )}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
    </div>
  );
}
