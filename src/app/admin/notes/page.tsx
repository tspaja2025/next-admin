"use client";

import { BookOpenIcon, FilterIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { NoteCard } from "@/components/notes/NoteCard";
import { NoteCategoryManager } from "@/components/notes/NoteCategoryManager";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NoteSearchAndFilters } from "@/components/notes/NoteSearchAndFilter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useFilteredNotes } from "@/hooks/use-filtered-notes";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useNotes } from "@/hooks/use-notes";
import { storage } from "@/lib/note-store";
import type { Note, SortOption, ViewMode } from "@/lib/types";

export default function NotesPage() {
  const {
    notes,
    categories,
    loading,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Search and Filters */}
        <div className="mb-8">
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
            {filteredAndSortedNotes.map((note) => (
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
