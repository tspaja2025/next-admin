"use client";

import { useCallback, useEffect, useState } from "react";
import { storage } from "@/lib/note-store";
import type { Category, Note } from "@/lib/types";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedNotes = storage.getNotes();
    const loadedCategories = storage.getCategories();

    setNotes(loadedNotes);
    setCategories(loadedCategories);
    setLoading(false);
  }, []);

  const saveNotes = useCallback(
    (newNotes: Note[]) => {
      setNotes(newNotes);
      storage.saveNotes(newNotes);

      // Update category counts
      const updatedCategories = categories.map((cat) => ({
        ...cat,
        count: newNotes.filter((note) => note.category === cat.name).length,
      }));
      setCategories(updatedCategories);
      storage.saveCategories(updatedCategories);
    },
    [categories],
  );

  const createNote = useCallback(
    (noteData: Partial<Note>) => {
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteData.title || "Untitled Note",
        content: noteData.content || "",
        category: noteData.category || "Personal",
        tags: noteData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPinned: false,
      };

      const updatedNotes = [newNote, ...notes];
      saveNotes(updatedNotes);
      return newNote;
    },
    [notes, saveNotes],
  );

  const updateNote = useCallback(
    (id: string, updates: Partial<Note>) => {
      const updatedNotes = notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note,
      );
      saveNotes(updatedNotes);
    },
    [notes, saveNotes],
  );

  const deleteNote = useCallback(
    (id: string) => {
      const updatedNotes = notes.filter((note) => note.id !== id);
      saveNotes(updatedNotes);
    },
    [notes, saveNotes],
  );

  const togglePin = useCallback(
    (id: string) => {
      updateNote(id, { isPinned: !notes.find((n) => n.id === id)?.isPinned });
    },
    [notes, updateNote],
  );

  const createCategory = useCallback(
    (name: string, color: string) => {
      const newCategory: Category = {
        id: Date.now().toString(),
        name,
        color,
        count: 0,
      };

      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      storage.saveCategories(updatedCategories);
    },
    [categories],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      const categoryToDelete = categories.find((cat) => cat.id === id);
      if (!categoryToDelete) return;

      // Move notes from deleted category to 'Personal'
      const updatedNotes = notes.map((note) =>
        note.category === categoryToDelete.name
          ? {
              ...note,
              category: "Personal",
              updatedAt: new Date().toISOString(),
            }
          : note,
      );

      const updatedCategories = categories.filter((cat) => cat.id !== id);

      setNotes(updatedNotes);
      storage.saveNotes(updatedNotes);
      setCategories(updatedCategories);
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
};
