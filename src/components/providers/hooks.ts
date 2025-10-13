import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
  ApiKey,
  Category,
  Email,
  EmailAction,
  EmailFilter,
  EmailFolder,
  Note,
  Options,
  ShortcutActions,
  Todo,
} from "@/components/providers/types";
import { generateApiKey, getKeyPrefix, localStorageApi } from "@/lib/api-keys";
import { mockEmails } from "@/lib/emails-mock";
import { storage } from "@/lib/note-store";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}

// Path utility functions
export const normalizePath = (path: string): string => {
  return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
};

export const joinPaths = (...segments: string[]): string => {
  return (
    segments
      .map((segment) => segment.replace(/^\/+|\/+$/g, ""))
      .filter(Boolean)
      .join("/") || "/"
  );
};

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setApiKeys(localStorageApi.getApiKeys());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setApiKeys(localStorageApi.getApiKeys());
  }, []);

  const createKey = useCallback(
    (name: string) => {
      if (!name.trim()) {
        toast.error("Please enter a name for the API key");
        return null;
      }
      const fullKey = generateApiKey();
      localStorageApi.createApiKey({
        name,
        key_prefix: getKeyPrefix(fullKey),
        created_at: new Date().toISOString(),
        last_used_at: null,
        expires_at: null,
        is_active: true,
      });
      refresh();
      return fullKey;
    },
    [refresh],
  );

  const deleteKey = useCallback(
    (id: string) => {
      localStorageApi.deleteApiKey(id);
      refresh();
      toast.success("API key deleted successfully");
    },
    [refresh],
  );

  return { apiKeys, loading, createKey, deleteKey, refresh };
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function useEmails() {
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [selectedFolder, setSelectedFolder] = useState<EmailFolder>("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<EmailFilter>("all");

  const filteredEmails = emails.filter((email) => {
    const matchesFolder = email.folder === selectedFolder;
    const matchesSearch =
      searchQuery === "" ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "unread" && !email.isRead) ||
      (filter === "starred" && email.isStarred);

    return matchesFolder && matchesSearch && matchesFilter;
  });

  const handleEmailAction = useCallback((action: EmailAction, email: Email) => {
    setEmails((prevEmails) =>
      prevEmails.map((e) =>
        e.id === email.id
          ? {
              ...e,
              isStarred: action === "star" ? !e.isStarred : e.isStarred,
              folder:
                action === "archive"
                  ? "archive"
                  : action === "delete"
                    ? "trash"
                    : e.folder,
              isRead: action === "markUnread" ? false : e.isRead,
            }
          : e,
      ),
    );
  }, []);

  const handleSendEmail = useCallback(
    (newEmail: Omit<Email, "id" | "timestamp" | "isRead" | "isStarred">) => {
      const email: Email = {
        ...newEmail,
        id: Date.now().toString(),
        timestamp: new Date(),
        isRead: true,
        isStarred: false,
      };
      setEmails((prev) => [email, ...prev]);
    },
    [],
  );

  return {
    emails,
    selectedFolder,
    setSelectedFolder,
    selectedEmail,
    setSelectedEmail,
    isComposeOpen,
    setIsComposeOpen,
    searchQuery,
    setSearchQuery,
    filteredEmails,
    handleEmailAction,
    handleSendEmail,
  };
}

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

export function useKeyboardShortcuts(actions: ShortcutActions) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            if (e.shiftKey) {
              actions.newCategory?.();
            } else {
              actions.newNote?.();
            }
            break;
          case "f":
            e.preventDefault();
            if (e.shiftKey) {
              actions.toggleFilters?.();
            } else {
              actions.focusSearch?.();
            }
            break;
          case "g":
            e.preventDefault();
            actions.toggleGrid?.();
            break;
          case "l":
            e.preventDefault();
            actions.toggleList?.();
            break;
          case "s":
            if (actions.saveNote) {
              e.preventDefault();
              actions.saveNote();
            }
            break;
          case "e":
            e.preventDefault();
            actions.exportNotes?.();
            break;
        }
      } else if (e.key === "Escape") {
        actions.closeDialog?.();
      }
    },
    [actions],
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}

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

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);

  const addTodo = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      setTodos((prev) => [
        {
          id: crypto.randomUUID(),
          text: text.trim(),
          completed: false,
          createdAt: new Date(),
        },
        ...prev,
      ]);
    },
    [setTodos],
  );

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    },
    [setTodos],
  );

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    },
    [setTodos],
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, [setTodos]);

  return {
    todos,
    setTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
  };
}
