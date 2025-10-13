import type {
  AuthUser,
  CalendarEvent,
  CalendarView,
  FileItem,
  ViewMode,
} from "@/components/providers/types";

export interface UnifiedAuthContextType {
  user: AuthUser;
  loading: boolean;
  error: string | null;
  signInLocal: (username: string) => void;
  signInSocial: (email: string, password: string) => Promise<void>;
  signUpSocial: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

export interface CalendarContextType {
  // Core state
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  view: CalendarView;
  setView: (view: CalendarView) => void;
  events: CalendarEvent[];

  // Filtering
  hiddenColors: string[];
  setHiddenColors: (colors: string[]) => void;
  toggleColorVisibility: (color: string) => void;
  visibleEvents: CalendarEvent[];

  // Dialog state
  selectedEvent: CalendarEvent | null;
  selectedDate: Date | null;
  isEventDialogOpen: boolean;
  openEventDialog: (date: Date, event?: CalendarEvent) => void;
  closeEventDialog: () => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setIsEventDialogOpen: (open: boolean) => void;
  setSelectedDate: (date: Date | null) => void;

  // CRUD
  addEvent: (event: Omit<CalendarEvent, "id">) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (id: string) => void;
}

export interface FileContextType {
  files: FileItem[];
  currentPath: string;
  selectedFiles: string[];
  viewMode: ViewMode;
  searchQuery: string;
  isInitialized: boolean;
  isLoading: boolean;
  uploadProgress: { [key: string]: number };
  storageUsed: number;
  storageLimit: number;

  // Methods
  createFolder: (name: string, parentId: string | null) => void;
  deleteFiles: (fileIds: string[]) => void;
  renameFile: (fileId: string, newName: string) => void;
  uploadFiles: (files: File[], parentId: string | null) => void;
  setCurrentPath: (path: string) => void;
  setSelectedFiles: (files: string[]) => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  getCurrentFiles: () => FileItem[];
  getFileById: (id: string) => FileItem | undefined;
  getPathSegments: () => Array<{ name: string; path: string }>;
  canUpload: (files: File[]) => boolean;
}
