"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  CALENDAR_VIEWS,
  eventColors,
  FILE_MANAGER_CONFIG,
  STORAGE_KEYS,
} from "@/components/providers/constants";
import type {
  CalendarContextType,
  FileContextType,
  UnifiedAuthContextType,
} from "@/components/providers/contexts";
import { useLocalStorage } from "@/components/providers/hooks";
import type {
  AuthUser,
  CalendarEvent,
  CalendarView,
  FileItem,
  LocalUser,
  SocialUser,
  ViewMode,
} from "@/components/providers/types";

// Initial files data
const initialFiles: FileItem[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    modified: new Date("2024-01-15"),
    parentId: null,
    path: "/Documents",
  },
  {
    id: "2",
    name: "Images",
    type: "folder",
    modified: new Date("2024-01-10"),
    parentId: null,
    path: "/Images",
  },
  {
    id: "3",
    name: "Projects",
    type: "folder",
    modified: new Date("2024-01-20"),
    parentId: null,
    path: "/Projects",
  },
  {
    id: "4",
    name: "readme.txt",
    type: "file",
    size: 1024,
    modified: new Date("2024-01-18"),
    parentId: null,
    path: "/readme.txt",
    extension: "txt",
  },
];

// Calendar Context
const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(CALENDAR_VIEWS.MONTH);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>(
    STORAGE_KEYS.CALENDAR_EVENTS,
    [],
  );
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hiddenColors, setHiddenColors] = useLocalStorage<string[]>(
    STORAGE_KEYS.HIDDEN_COLORS,
    [],
  );

  // Event validation
  const validateEvent = (event: Omit<CalendarEvent, "id">): boolean => {
    return event.title.trim().length > 0 && event.startDate <= event.endDate;
  };

  const getDefaultEventColor = () => eventColors[0];

  const addEvent = useCallback(
    (eventData: Omit<CalendarEvent, "id">) => {
      if (!validateEvent(eventData)) {
        throw new Error("Invalid event data");
      }

      const newEvent: CalendarEvent = {
        ...eventData,
        id: crypto.randomUUID(),
        color: eventData.color || getDefaultEventColor(),
      };
      setEvents((prev) => [...prev, newEvent]);
    },
    [setEvents],
  );

  const updateEvent = useCallback(
    (updatedEvent: CalendarEvent) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      );
    },
    [setEvents],
  );

  const deleteEvent = useCallback(
    (id: string) => {
      setEvents((prev) => prev.filter((event) => event.id !== id));
    },
    [setEvents],
  );

  const toggleColorVisibility = useCallback(
    (color: string) => {
      setHiddenColors((prev) =>
        prev.includes(color)
          ? prev.filter((c) => c !== color)
          : [...prev, color],
      );
    },
    [setHiddenColors],
  );

  const openEventDialog = useCallback((date: Date, event?: CalendarEvent) => {
    setSelectedDate(date);
    setSelectedEvent(event ?? null);
    setIsEventDialogOpen(true);
  }, []);

  const closeEventDialog = useCallback(() => {
    setSelectedDate(null);
    setSelectedEvent(null);
    setIsEventDialogOpen(false);
  }, []);

  const visibleEvents = useMemo(
    () =>
      events.filter((event) => !hiddenColors.includes(event.color.toString())),
    [events, hiddenColors],
  );

  const value = useMemo(
    (): CalendarContextType => ({
      currentDate,
      setCurrentDate,
      view,
      setView,
      events,
      selectedEvent,
      isEventDialogOpen,
      selectedDate,
      setSelectedEvent,
      setIsEventDialogOpen,
      setSelectedDate,
      hiddenColors,
      setHiddenColors,
      visibleEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      toggleColorVisibility,
      openEventDialog,
      closeEventDialog,
    }),
    [
      currentDate,
      view,
      events,
      selectedEvent,
      isEventDialogOpen,
      selectedDate,
      hiddenColors,
      visibleEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      toggleColorVisibility,
      openEventDialog,
      closeEventDialog,
    ],
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}

// File Context
const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useLocalStorage(
    STORAGE_KEYS.CURRENT_PATH,
    "/",
  );
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    STORAGE_KEYS.VIEW_MODE,
    "grid",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedFiles = localStorage.getItem(STORAGE_KEYS.FILES);

      if (storedFiles) {
        const parsedFiles = JSON.parse(storedFiles).map((file: FileItem) => ({
          ...file,
          modified: new Date(file.modified),
        }));
        setFiles(parsedFiles);
      } else {
        setFiles(initialFiles);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      setFiles(initialFiles);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Storage calculations
  const storageUsed = useMemo(
    () => files.reduce((total, file) => total + (file.size || 0), 0),
    [files],
  );

  const storageLimit = FILE_MANAGER_CONFIG.STORAGE_LIMIT;

  const canUpload = useCallback(
    (newFiles: File[]) => {
      const newSize = newFiles.reduce((total, file) => total + file.size, 0);
      return storageUsed + newSize <= storageLimit;
    },
    [storageUsed],
  );

  // File operations
  const getCurrentFiles = useCallback(() => {
    if (!isInitialized) return [];

    const currentParentId =
      currentPath === "/"
        ? null
        : files.find((f) => f.path === currentPath)?.id || null;

    let currentFiles = files.filter(
      (file) => file.parentId === currentParentId,
    );

    if (searchQuery) {
      currentFiles = currentFiles.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return currentFiles.sort((a, b) => {
      if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [files, currentPath, searchQuery, isInitialized]);

  const getFileById = useCallback(
    (id: string) => {
      return files.find((file) => file.id === id);
    },
    [files],
  );

  const getPathSegments = useCallback(() => {
    if (currentPath === "/") return [{ name: "Home", path: "/" }];

    const segments = currentPath.split("/").filter(Boolean);
    const pathSegments = [{ name: "Home", path: "/" }];

    let currentPathSegment = "";
    segments.forEach((segment) => {
      currentPathSegment = currentPathSegment
        ? `${currentPathSegment}/${segment}`
        : `/${segment}`;
      pathSegments.push({ name: segment, path: currentPathSegment });
    });

    return pathSegments;
  }, [currentPath]);

  const createFolder = useCallback(
    (name: string, parentId: string | null) => {
      if (!isInitialized) return;

      const parentPath = parentId
        ? files.find((f) => f.id === parentId)?.path || "/"
        : "/";
      const newPath = parentPath === "/" ? `/${name}` : `${parentPath}/${name}`;

      const newFolder: FileItem = {
        id: crypto.randomUUID(),
        name,
        type: "folder",
        modified: new Date(),
        parentId,
        path: newPath,
      };

      setFiles((prev) => [...prev, newFolder]);
    },
    [files, isInitialized],
  );

  const deleteFiles = useCallback(
    (fileIds: string[]) => {
      if (!isInitialized) return;

      setFiles((prev) => {
        const toDelete = new Set(fileIds);

        const findChildren = (parentId: string) => {
          const children = prev.filter((f) => f.parentId === parentId);
          children.forEach((child) => {
            toDelete.add(child.id);
            if (child.type === "folder") findChildren(child.id);
          });
        };

        fileIds.forEach((id) => {
          const file = prev.find((f) => f.id === id);
          if (file?.type === "folder") findChildren(id);
        });

        return prev.filter((file) => !toDelete.has(file.id));
      });
      setSelectedFiles([]);
    },
    [isInitialized],
  );

  const renameFile = useCallback(
    (fileId: string, newName: string) => {
      if (!isInitialized) return;

      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const pathParts = file.path.split("/");
            pathParts[pathParts.length - 1] = newName;
            const newPath = pathParts.join("/");

            return {
              ...file,
              name: newName,
              path: newPath,
              extension:
                file.type === "file" ? newName.split(".").pop() : undefined,
            };
          }
          return file;
        }),
      );
    },
    [isInitialized],
  );

  const uploadFiles = useCallback(
    (uploadedFiles: File[], parentId: string | null) => {
      if (!isInitialized || !canUpload(uploadedFiles)) return;

      setIsLoading(true);
      const parentPath = parentId
        ? files.find((f) => f.id === parentId)?.path || "/"
        : "/";

      const newFiles: FileItem[] = uploadedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        type: "file",
        size: file.size,
        modified: new Date(),
        parentId,
        path:
          parentPath === "/" ? `/${file.name}` : `${parentPath}/${file.name}`,
        extension: file.name.split(".").pop() || undefined,
      }));

      setFiles((prev) => [...prev, ...newFiles]);
      setIsLoading(false);
    },
    [files, isInitialized, canUpload],
  );

  const value = useMemo(
    (): FileContextType => ({
      files,
      currentPath,
      selectedFiles,
      viewMode,
      searchQuery,
      isInitialized,
      isLoading,
      uploadProgress,
      storageUsed,
      storageLimit,
      createFolder,
      deleteFiles,
      renameFile,
      uploadFiles,
      setCurrentPath,
      setSelectedFiles,
      setViewMode,
      setSearchQuery,
      getCurrentFiles,
      getFileById,
      getPathSegments,
      canUpload,
    }),
    [
      files,
      currentPath,
      selectedFiles,
      viewMode,
      searchQuery,
      isInitialized,
      isLoading,
      uploadProgress,
      storageUsed,
      storageLimit,
      createFolder,
      deleteFiles,
      renameFile,
      uploadFiles,
      getCurrentFiles,
      getFileById,
      getPathSegments,
      canUpload,
    ],
  );

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFiles() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
}

// Auth Context
const UnifiedAuthContext = createContext<UnifiedAuthContextType | undefined>(
  undefined,
);

export function UnifiedAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error("Error parsing stored user:", err);
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    }
    setLoading(false);
  }, []);

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.AUTH_USER && e.newValue !== e.oldValue) {
        if (e.newValue) {
          setUser(JSON.parse(e.newValue));
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // Local (simple) sign-in
  const signInLocal = useCallback(
    (username: string) => {
      clearError();
      const newUser: LocalUser = {
        id: crypto.randomUUID(),
        username,
        type: "local",
      };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));
    },
    [clearError],
  );

  // Social sign-up
  const signUpSocial = useCallback(
    async (email: string, password: string, fullName: string) => {
      clearError();
      try {
        const users = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.DEMO_USERS) || "[]",
        );

        if (users.find((u: any) => u.email === email)) {
          throw new Error("User with this email already exists");
        }

        const newUser: SocialUser = {
          id: crypto.randomUUID(),
          email,
          full_name: fullName,
          type: "social",
        };

        users.push({ ...newUser, password });
        localStorage.setItem(STORAGE_KEYS.DEMO_USERS, JSON.stringify(users));
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(newUser));
        setUser(newUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
        throw err;
      }
    },
    [clearError],
  );

  // Social sign-in
  const signInSocial = useCallback(
    async (email: string, password: string) => {
      clearError();
      try {
        const users = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.DEMO_USERS) || "[]",
        );
        const existing = users.find(
          (u: any) => u.email === email && u.password === password,
        );

        if (!existing) throw new Error("Invalid email or password");

        const user: SocialUser = {
          id: existing.id,
          email: existing.email,
          full_name: existing.full_name,
          type: "social",
        };

        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Sign in failed");
        throw err;
      }
    },
    [clearError],
  );

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    clearError();
  }, [clearError]);

  const value = useMemo(
    (): UnifiedAuthContextType => ({
      user,
      loading,
      error,
      signInLocal,
      signInSocial,
      signUpSocial,
      signOut,
      clearError,
    }),
    [
      user,
      loading,
      error,
      signInLocal,
      signInSocial,
      signUpSocial,
      signOut,
      clearError,
    ],
  );

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a UnifiedAuthProvider");
  }
  return context;
}

// Theme Provider (unchanged)
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
