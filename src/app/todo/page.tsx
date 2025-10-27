"use client";

import { closestCenter, DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckIcon,
  CheckSquareIcon,
  Edit3Icon,
  GripVerticalIcon,
  PlusIcon,
  SquareIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTodos } from "@/hooks/use-todos";
import type {
  FilterType,
  TodoFiltersProps,
  TodoInputProps,
  TodoItemProps,
  TodoListProps,
  TodoStatsProps,
} from "@/lib/types";

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

  return (
    <div>
      <div className="container mx-auto  max-w-4xl space-y-4">
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

function TodoFilters({
  filter,
  onChange,
  onClearCompleted,
  completed,
}: TodoFiltersProps) {
  return (
    <div className="flex gap-2">
      {(["all", "active", "completed"] as FilterType[]).map((type) => (
        <Button
          key={type}
          variant={filter === type ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(type)}
          className="capitalize"
        >
          {type}
        </Button>
      ))}
      {completed > 0 && (
        <Button variant="outline" size="sm" onClick={onClearCompleted}>
          <Trash2Icon className="w-4 h-4 mr-1" />
          Clear Completed
        </Button>
      )}
    </div>
  );
}

function TodoInput({ value, onChange, onAdd }: TodoInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onAdd();
  };

  return (
    <Card>
      <CardContent>
        <div className="flex gap-3">
          <Input
            type="text"
            placeholder="What needs to be done?"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={onAdd} disabled={!value.trim()}>
            <PlusIcon />
            Add Task
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TodoList({
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
  reorderTodos, // Replace setTodos with reorderTodos
}: TodoListProps) {
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTodos(active.id as string, over.id as string);
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

function TodoSortable({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="flex items-center gap-3">
        <div {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVerticalIcon />
        </div>
        {children}
      </div>
    </div>
  );
}

function TodoItem({
  todo,
  editingId,
  editValue,
  onToggle,
  onDelete,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
}: TodoItemProps) {
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSaveEdit();
    if (e.key === "Escape") onCancelEdit();
  };

  return (
    <motion.div
      key={todo.id}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="flex-1"
    >
      <Card>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggle(todo.id)}
              aria-label={
                todo.completed ? "Mark as active" : "Mark as completed"
              }
            >
              {todo.completed ? <CheckSquareIcon /> : <SquareIcon />}
            </Button>

            <div className="flex-1">
              {editingId === todo.id ? (
                <Input
                  value={editValue}
                  onChange={(e) => onEditChange(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onBlur={onSaveEdit}
                  autoFocus
                />
              ) : (
                <span
                  onClick={() =>
                    !todo.completed && onStartEdit(todo.id, todo.text)
                  }
                  className={
                    todo.completed
                      ? "line-through text-gray-500"
                      : "cursor-text"
                  }
                >
                  {todo.text}
                </span>
              )}
              <div className="text-xs text-gray-400 mt-1">
                Created {todo.createdAt.toLocaleDateString()} at{" "}
                {todo.createdAt.toLocaleTimeString()}
              </div>
            </div>

            <div className="flex gap-1">
              {editingId === todo.id ? (
                <>
                  <Button variant="ghost" size="sm" onClick={onSaveEdit}>
                    <CheckIcon />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onCancelEdit}>
                    <XIcon />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStartEdit(todo.id, todo.text)}
                  >
                    <Edit3Icon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(todo.id)}
                  >
                    <Trash2Icon />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TodoStats({ active, completed, total }: TodoStatsProps) {
  return (
    <div className="flex gap-2 text-sm">
      <Badge>
        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
        {active} Active
      </Badge>
      <Badge>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        {completed} Completed
      </Badge>
      <Badge>
        <span className="w-3 h-3 rounded-full bg-gray-400"></span>
        {total} Total
      </Badge>
    </div>
  );
}
