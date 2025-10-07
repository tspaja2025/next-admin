import type { Category, Note } from "@/lib/types";

const NOTES_KEY = "notes-app-notes";
const CATEGORIES_KEY = "notes-app-categories";

export const storage = {
  getNotes: (): Note[] => {
    if (typeof window === "undefined") return [];
    try {
      const notes = localStorage.getItem(NOTES_KEY);
      return notes ? JSON.parse(notes) : [];
    } catch {
      return [];
    }
  },

  saveNotes: (notes: Note[]): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes:", error);
    }
  },

  getCategories: (): Category[] => {
    if (typeof window === "undefined") return [];
    try {
      const categories = localStorage.getItem(CATEGORIES_KEY);
      return categories
        ? JSON.parse(categories)
        : [
            { id: "1", name: "Personal", color: "#3B82F6", count: 0 },
            { id: "2", name: "Work", color: "#8B5CF6", count: 0 },
            { id: "3", name: "Ideas", color: "#10B981", count: 0 },
          ];
    } catch {
      return [];
    }
  },

  saveCategories: (categories: Category[]): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (error) {
      console.error("Failed to save categories:", error);
    }
  },

  exportNotes: (notes: Note[], format: "json" | "txt"): void => {
    if (format === "json") {
      const dataStr = JSON.stringify(notes, null, 2);
      const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const exportFileDefaultName = `notes-backup-${new Date().toISOString().split("T")[0]}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    } else {
      const textContent = notes
        .map(
          (note) =>
            `${note.title}\n${"=".repeat(note.title.length)}\n\n${note.content}\n\nCategory: ${note.category}\nTags: ${note.tags.join(", ")}\nCreated: ${new Date(note.createdAt).toLocaleDateString()}\n\n---\n\n`,
        )
        .join("");

      const dataUri =
        "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
      const exportFileDefaultName = `notes-export-${new Date().toISOString().split("T")[0]}.txt`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    }
  },
};
