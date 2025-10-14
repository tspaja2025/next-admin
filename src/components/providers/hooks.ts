// hooks.ts
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { toast } from "sonner";
import { generateApiKey, getKeyPrefix, localStorageApi } from "@/lib/api-keys";
import { mockEmails } from "@/lib/emails-mock";
import { storage } from "@/lib/note-store";

// ---------- Types ----------

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

type EmailAction = "star" | "archive" | "delete" | "markUnread";
type EmailFolder = "inbox" | "sent" | "drafts" | "spam" | "trash" | "starred";
type EmailFilter = "all" | "unread" | "starred";

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  file?: File;
}

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  folder: EmailFolder;
  attachments: Attachment[];
}

interface EmailState {
  emails: Email[];
  selectedFolder: EmailFolder;
  searchQuery: string;
  filter: EmailFilter;
}

type EmailEvent =
  | { type: "setFolder"; folder: EmailFolder }
  | { type: "setSearch"; query: string }
  | { type: "setFilter"; filter: EmailFilter }
  | { type: "toggleStar"; id: string }
  | { type: "markUnread"; id: string }
  | { type: "moveTo"; id: string; folder: EmailFolder }
  | { type: "add"; email: Email };

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

type SortOption = "updated" | "created" | "title" | "category";

interface Options {
  notes: Note[];
  searchTerm: string;
  sortBy: SortOption;
  selectedCategory: string;
}

interface ShortcutActions {
  newNote?: () => void;
  newCategory?: () => void;
  focusSearch?: () => void;
  toggleFilters?: () => void;
  toggleGrid?: () => void;
  toggleList?: () => void;
  exportNotes?: () => void;
  closeDialog?: () => void;
  saveNote?: () => void;
}

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

// ---------- 1. useLocalStorage ----------

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      window.localStorage.removeItem(key);
      return initialValue;
    }
  });

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        toast.error("Failed to save data");
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}

// ---------- 2. Path utilities ----------

export const normalizePath = (path: string): string => {
  return path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
};

export const joinPaths = (...segments: string[]): string => {
  return (
    "/" +
    segments
      .map((segment) => segment.replace(/^\/+|\/+$/g, ""))
      .filter(Boolean)
      .join("/")
  );
};

// ---------- 3. useResource (async-ready) ----------

export function useResource<T>({
  storageKey,
  initialValue,
  onError,
}: {
  storageKey: string;
  initialValue: T;
  onError?: (error: Error) => void;
}) {
  const [data, setData] = useLocalStorage<T>(storageKey, initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = useCallback(
    async (updater: T | ((current: T) => T | Promise<T>)) => {
      try {
        setLoading(true);
        setError(null);
        const nextValue =
          updater instanceof Function ? await updater(data) : updater;
        setData(nextValue);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Update failed");
        setError(error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [data, setData, onError],
  );

  return { data, loading, error, update };
}

// ---------- 4. useApiKeys ----------

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() =>
    localStorageApi.getApiKeys(),
  );

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

  return { apiKeys, createKey, deleteKey, refresh };
}

// ---------- 5. useDebounce ----------

export function useDebounce<T>(
  value: T,
  delay: number,
  options: { leading?: boolean } = {},
): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    if (options.leading) {
      setDebounced(value);
      return;
    }

    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay, options.leading]);

  return debounced;
}

// ---------- 6. useEmails (reducer-based) ----------

function emailReducer(state: EmailState, action: EmailEvent): EmailState {
  switch (action.type) {
    case "setFolder":
      return { ...state, selectedFolder: action.folder };
    case "setSearch":
      return { ...state, searchQuery: action.query };
    case "setFilter":
      return { ...state, filter: action.filter };
    case "toggleStar":
      return {
        ...state,
        emails: state.emails.map((e) =>
          e.id === action.id ? { ...e, isStarred: !e.isStarred } : e,
        ),
      };
    case "markUnread":
      return {
        ...state,
        emails: state.emails.map((e) =>
          e.id === action.id ? { ...e, isRead: false } : e,
        ),
      };
    case "moveTo":
      return {
        ...state,
        emails: state.emails.map((e) =>
          e.id === action.id ? { ...e, folder: action.folder } : e,
        ),
      };
    case "add":
      return { ...state, emails: [action.email, ...state.emails] };
    default:
      return state;
  }
}

export function useEmails() {
  const [state, dispatch] = useReducer(emailReducer, {
    emails: mockEmails,
    selectedFolder: "inbox",
    searchQuery: "",
    filter: "all",
  });

  const filteredEmails = useMemo(() => {
    const { emails, selectedFolder, searchQuery, filter } = state;
    const lowerSearch = searchQuery.toLowerCase();

    return emails.filter((email) => {
      const matchesFolder = email.folder === selectedFolder;
      const matchesSearch =
        !lowerSearch ||
        email.subject.toLowerCase().includes(lowerSearch) ||
        email.sender.toLowerCase().includes(lowerSearch) ||
        email.content.toLowerCase().includes(lowerSearch);
      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && !email.isRead) ||
        (filter === "starred" && email.isStarred);
      return matchesFolder && matchesSearch && matchesFilter;
    });
  }, [state]);

  const sendEmail = useCallback(
    (email: Omit<Email, "id" | "timestamp" | "isRead" | "isStarred">) => {
      const newEmail: Email = {
        ...email,
        id: crypto.randomUUID(),
        timestamp: new Date(),
        isRead: true,
        isStarred: false,
      };
      dispatch({ type: "add", email: newEmail });
    },
    [],
  );

  return { state, dispatch, filteredEmails, sendEmail };
}

// ---------- 7. useFilteredNotes ----------

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

// ---------- 8. useKeyboardShortcuts ----------

export function useKeyboardShortcuts(
  actions: ShortcutActions,
  disabled = false,
) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            e.shiftKey ? actions.newCategory?.() : actions.newNote?.();
            break;
          case "f":
            e.preventDefault();
            e.shiftKey ? actions.toggleFilters?.() : actions.focusSearch?.();
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
            e.preventDefault();
            actions.saveNote?.();
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
    [actions, disabled],
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}

// ---------- 9. useNotes ----------

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

// ---------- 10. useTodos ----------

export function useTodos() {
  const { data: todos, update: setTodos } = useResource<Todo[]>({
    storageKey: "todos",
    initialValue: [],
  });

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
    (id: string) => setTodos((prev) => prev.filter((t) => t.id !== id)),
    [setTodos],
  );

  const toggleTodo = useCallback(
    (id: string) =>
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
      ),
    [setTodos],
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
    toast.success("Cleared completed tasks");
  }, [setTodos]);

  const activeTodos = useMemo(() => todos.filter((t) => !t.completed), [todos]);
  const completedTodos = useMemo(
    () => todos.filter((t) => t.completed),
    [todos],
  );

  return {
    todos,
    activeTodos,
    completedTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
  };
}
