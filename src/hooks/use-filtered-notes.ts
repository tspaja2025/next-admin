import { useMemo } from "react";
import type { Note, Options, SortOption } from "@/lib/types";

export function useFilteredNotes({
  notes,
  searchTerm,
  sortBy,
  selectedCategory,
}: Options) {
  return useMemo(() => {
    if (!notes.length) return [];

    const lowerSearch = searchTerm.toLowerCase().trim();

    const filtered = notes.filter((note) => {
      const matchesSearch =
        !lowerSearch ||
        note.title.toLowerCase().includes(lowerSearch) ||
        note.content.toLowerCase().includes(lowerSearch) ||
        note.tags.some((tag) => tag.toLowerCase().includes(lowerSearch));

      const matchesCategory =
        selectedCategory === "all" || note.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    const sorters: Record<SortOption, (a: Note, b: Note) => number> = {
      updated: (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      created: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      title: (a, b) => a.title.localeCompare(b.title),
      category: (a, b) => a.category.localeCompare(b.category),
    };

    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return sorters[sortBy](a, b);
    });

    return filtered;
  }, [notes, searchTerm, sortBy, selectedCategory]);
}
