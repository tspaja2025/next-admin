"use client";

import { format } from "date-fns";
import {
  BookOpenIcon,
  CalendarIcon,
  DownloadIcon,
  EditIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  PinIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilteredNotes } from "@/hooks/use-filtered-notes";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useNotes } from "@/hooks/use-notes";
import { initNoteState, noteEditorReducer } from "@/lib/note-reducer";
import { storage } from "@/lib/note-store";
import type {
  CategoryManagerProps,
  CategorySelectorProps,
  ContentInputProps,
  Note,
  NoteCardProps,
  NoteEditorProps,
  SearchAndFiltersProps,
  SortOption,
  TagEditorProps,
  TitleInputProps,
  ViewMode,
} from "@/lib/types";

const PRESET_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#6366F1",
  "#14B8A6",
  "#F97316",
  "#84CC16",
  "#8B5A2B",
  "#64748B",
];

export default function NotesPage() {
  const {
    notes,
    categories,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    createCategory,
    deleteCategory,
  } = useNotes();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count: notes.filter((n) => n.category === cat.id).length,
  }));

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter and sort notes
  const filteredAndSortedNotes = useFilteredNotes({
    notes,
    searchTerm: debouncedSearch,
    sortBy,
    selectedCategory,
  });

  const handleCreateNote = useCallback(() => {
    setEditingNote(null);
    setIsEditorOpen(true);
  }, []);

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  }, []);

  const handleSaveNote = useCallback(
    (noteData: Partial<Note>) => {
      if (editingNote) {
        updateNote(editingNote.id, noteData);
      } else {
        createNote(noteData);
      }
    },
    [editingNote, updateNote, createNote],
  );

  const handleExport = useCallback(
    (format: "json" | "txt") => {
      storage.exportNotes(filteredAndSortedNotes, format);
    },
    [filteredAndSortedNotes],
  );

  useKeyboardShortcuts({
    newNote: handleCreateNote,
    newCategory: () => setIsCategoryManagerOpen(true),
    focusSearch: () => {
      document
        .querySelector<HTMLInputElement>('input[placeholder="Search notes..."]')
        ?.focus();
    },
    toggleFilters: () => setShowFilters((prev) => !prev),
    toggleGrid: () => setViewMode("grid"),
    toggleList: () => setViewMode("list"),
    exportNotes: () => handleExport("json"),
    closeDialog: () => {
      setIsEditorOpen(false);
      setIsCategoryManagerOpen(false);
    },
  });

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {/* Search and Filters */}
        <div className="mb-4">
          <NoteSearchAndFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={categoriesWithCounts}
            onExport={handleExport}
            onCreateNote={handleCreateNote}
            onCreateCategory={() => setIsCategoryManagerOpen(true)}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        </div>

        {/* Notes Grid/List */}
        {filteredAndSortedNotes.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                <BookOpenIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm || selectedCategory !== "all"
                  ? "No notes found"
                  : "No notes yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first note to get started"}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Button onClick={handleCreateNote}>
                  Create Your First Note
                </Button>
              )}
              {(searchTerm || selectedCategory !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }
          >
            {filteredAndSortedNotes.map((note: Note) => (
              <NoteCard
                key={note.id}
                note={note}
                categories={categoriesWithCounts}
                onEdit={handleEditNote}
                onDelete={deleteNote}
                onTogglePin={togglePin}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {/* Note Editor Modal */}
        <NoteEditor
          note={editingNote}
          categories={categories}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={handleSaveNote}
        />

        {/* Category Manager Modal */}
        <NoteCategoryManager
          isOpen={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
          onCreateCategory={createCategory}
          onDeleteCategory={deleteCategory}
          categories={categories}
        />
      </div>
    </div>
  );
}

const NoteCard = React.memo(function NoteCard({
  note,
  categories,
  onEdit,
  onDelete,
  onTogglePin,
  viewMode,
}: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const truncatedContent =
    note.content.length > 150
      ? note.content.substring(0, 150) + "..."
      : note.content;

  const categoryName =
    categories.find((c) => c.id === note.category)?.name ?? "Uncategorized";

  return (
    <Card
      className={`group transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 cursor-pointer border-l-4 ${
        note.isPinned
          ? "border-l-yellow-400 bg-yellow-50/30"
          : "border-l-transparent"
      } ${viewMode === "list" ? "p-4" : "p-6"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onEdit(note)}
    >
      <div
        className={`flex ${viewMode === "list" ? "flex-row items-center gap-4" : "flex-col"}`}
      >
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3
              className={`font-semibold text-foreground line-clamp-2 ${
                viewMode === "list" ? "text-base" : "text-lg"
              }`}
            >
              {note.title}
            </h3>
            <div
              className={`flex items-center gap-1 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
                className={`h-8 w-8 ${note.isPinned ? "text-yellow-600" : "text-muted-foreground"}`}
              >
                <PinIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(note);
                }}
                className="h-8 w-8 text-muted-foreground hover:text-primary"
              >
                <EditIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note.id);
                }}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2Icon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === "grid" && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3 leading-relaxed">
              {truncatedContent}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {categoryName}
              </Badge>
              {note.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{note.tags.length - 2}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              {format(new Date(note.updatedAt), "MMM dd")}
            </div>
          </div>
        </div>

        {viewMode === "list" && (
          <div className="text-sm text-muted-foreground max-w-md">
            {truncatedContent}
          </div>
        )}
      </div>
    </Card>
  );
});

function NoteCategoryManager({
  isOpen,
  onClose,
  onCreateCategory,
  onDeleteCategory,
  categories,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleCreate = () => {
    if (newCategoryName.trim()) {
      onCreateCategory(newCategoryName.trim(), selectedColor);
      setNewCategoryName("");
      setSelectedColor(PRESET_COLORS[0]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create New Category */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name..."
                className="mt-2"
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              />
            </div>

            <div>
              <Label>Color</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {PRESET_COLORS.map((color) => (
                  <Button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-foreground scale-110"
                        : "border-border hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreate}
              disabled={!newCategoryName.trim()}
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>

          {/* Existing Categories */}
          <div className="space-y-2">
            <Label>Existing Categories</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 rounded-md border"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({category.count} notes)
                    </span>
                  </div>

                  {category.name !== "Personal" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteCategory(category.id)}
                      className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NoteEditor({
  note,
  categories,
  isOpen,
  onClose,
  onSave,
}: NoteEditorProps) {
  const [state, dispatch] = useReducer(
    noteEditorReducer,
    note ?? undefined,
    initNoteState,
  );

  useEffect(() => {
    dispatch({
      type: "RESET",
      payload: note ? initNoteState(note) : initNoteState(),
    });
  }, [note]);

  const handleSave = () => {
    if (!state.title.trim()) return; // prevent empty titles

    const newNote: Partial<Note> = {
      id: state.id,
      title: state.title.trim(),
      content: state.content.trim(),
      tags: state.tags,
      category: state.category,
      isPinned: note?.isPinned || false,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      onSave(newNote);
      onClose();
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  useKeyboardShortcuts({
    saveNote: handleSave,
    closeDialog: onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "New Note"}</DialogTitle>
          <DialogDescription>Edit or Add New Note</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <NoteTitleInput
            value={state.title}
            onChange={(val) => dispatch({ type: "SET_TITLE", payload: val })}
          />
          <NoteCategorySelector
            value={state.category}
            categories={categories}
            onChange={(val) => dispatch({ type: "SET_CATEGORY", payload: val })}
          />
          <NoteTagEditor
            tags={state.tags}
            onAdd={(tag) => dispatch({ type: "ADD_TAG", payload: tag })}
            onRemove={(tag) => dispatch({ type: "REMOVE_TAG", payload: tag })}
          />
          <NoteContentInput
            value={state.content}
            onChange={(val) => dispatch({ type: "SET_CONTENT", payload: val })}
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Create Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NoteSearchAndFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onExport,
  onCreateNote,
  onCreateCategory,
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Top Row - Search and Main Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onCreateNote} className="whitespace-nowrap">
            <PlusIcon className="h-4 w-4 mr-2" />
            New Note
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onExport("json")}>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("txt")}>
                Export as Text
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-secondary" : ""}
          >
            <FilterIcon className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-secondary/20 rounded-lg border">
          <div className="flex-1">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                      <Badge variant="outline" className="ml-2">
                        {category.count}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Recently Updated</SelectItem>
                <SelectItem value="created">Recently Created</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("list")}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" onClick={onCreateCategory}>
            <PlusIcon className="h-4 w-4 mr-1" />
            Category
          </Button>
        </div>
      )}
    </div>
  );
}

function NoteTitleInput({ value, onChange }: TitleInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={value}
        placeholder="Enter note title..."
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function NoteCategorySelector({
  value,
  categories,
  onChange,
}: CategorySelectorProps) {
  return (
    <div className="grid gap-2">
      <Label>Category</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              <span
                className="inline-block w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function NoteTagEditor({ tags, onAdd, onRemove }: TagEditorProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAdd = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed);
      setTagInput("");
    }
  };

  return (
    <div>
      <Label className="mb-2">Tags</Label>
      <div className="flex gap-2">
        <Input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === ",") && handleAdd()}
        />
        <Button type="button" onClick={handleAdd}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            className="hover:bg-muted-foreground cursor-pointer"
            onClick={() => onRemove(tag)}
          >
            {tag} <XIcon />
          </Badge>
        ))}
      </div>
    </div>
  );
}

function NoteContentInput({ value, onChange }: ContentInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="content">Content</Label>
      <textarea
        id="content"
        className="w-full rounded-md border p-2"
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
