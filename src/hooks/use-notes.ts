import { useCallback, useState } from "react";
import { storage } from "@/lib/note-store";
import type { Category, Note } from "@/lib/types";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => storage.getNotes());
  const [categories, setCategories] = useState<Category[]>(() =>
    storage.getCategories(),
  );
  const [loading, setLoading] = useState(false);

  const saveNotes = useCallback(
    (newNotes: Note[]) => {
      setNotes(newNotes);
      storage.saveNotes(newNotes);
      const updatedCategories = categories.map((cat) => ({
        ...cat,
        count: newNotes.filter((n) => n.category === cat.name).length,
      }));
      setCategories(updatedCategories);
      storage.saveCategories(updatedCategories);
    },
    [categories],
  );

  const createNote = useCallback(
    (noteData: Partial<Note>) => {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: noteData.title || "Untitled Note",
        content: noteData.content || "",
        category: noteData.category || "Personal",
        tags: noteData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
      };
      const updated = [newNote, ...notes];
      saveNotes(updated);
      return newNote;
    },
    [notes, saveNotes],
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      const updated = notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note,
      );
      saveNotes(updated);
    },
    [notes, saveNotes],
  );

  const deleteNote = useCallback(
    (id: string) => {
      const updated = notes.filter((note) => note.id !== id);
      saveNotes(updated);
    },
    [notes, saveNotes],
  );

  const togglePin = useCallback(
    (id: string) => {
      const note = notes.find((n) => n.id === id);
      if (!note) return;
      updateNote(id, { isPinned: !note.isPinned });
    },
    [notes, updateNote],
  );

  const createCategory = useCallback(
    (name: string, color: string) => {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name,
        color,
        count: 0,
      };
      const updated = [...categories, newCategory];
      setCategories(updated);
      storage.saveCategories(updated);
    },
    [categories],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      const category = categories.find((cat) => cat.id === id);
      if (!category) return;

      const updatedNotes = notes.map((n) =>
        n.category === category.name
          ? { ...n, category: "Personal", updatedAt: new Date().toISOString() }
          : n,
      );
      const updatedCategories = categories.filter((cat) => cat.id !== id);

      setNotes(updatedNotes);
      setCategories(updatedCategories);
      storage.saveNotes(updatedNotes);
      storage.saveCategories(updatedCategories);
    },
    [notes, categories],
  );

  return {
    notes,
    categories,
    loading,
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    createCategory,
    deleteCategory,
  };
}
