import { useMemo } from "react";
import type { Options } from "@/lib/types";

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

    // Sort pinned notes first, then by selected criteria
    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }

      switch (sortBy) {
        case "updated":
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        case "created":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [notes, searchTerm, sortBy, selectedCategory]);
}
