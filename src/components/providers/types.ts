import {
  ArchiveIcon,
  CodeIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FilmIcon,
  FolderIcon,
  ImageIcon,
  type LucideIcon,
  type LucideProps,
  MusicIcon,
} from "lucide-react";

export type AuthUserType = "local" | "social";

export type BaseUser = {
  id: string;
  type: AuthUserType;
};

export type LocalUser = BaseUser & {
  type: "local";
  username: string;
};

export type SocialUser = BaseUser & {
  type: "social";
  email: string;
  full_name: string;
};

export type AuthUser = LocalUser | SocialUser | null;

/*
 * API Types
 */
export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
}

export interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onDelete: (id: string) => void;
}

/*
 * Calendar Types
 */
export type EventColors = {
  name: string;
  value: string;
};

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color: string | EventColors;
  allDay: boolean;
}

export type CalendarView = "month" | "week" | "day";

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

/*
 * Chat Types
 */
export interface Message {
  id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

export interface User {
  id: string;
  username: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string) => void;
  signOut: () => void;
}

/*
 * File Manager Types
 */
export interface FileRowProps {
  file: FileItem;
  isGridView?: boolean;
}

export interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: number;
  modified: Date;
  parentId: string | null;
  path: string;
  extension?: string;
}

export interface FileContextType {
  files: FileItem[];
  currentPath: string;
  selectedFiles: string[];
  viewMode: "grid" | "list";
  searchQuery: string;
  isInitialized: boolean; // Add this
  createFolder: (name: string, parentId: string | null) => void;
  deleteFiles: (fileIds: string[]) => void;
  renameFile: (fileId: string, newName: string) => void;
  uploadFiles: (files: File[], parentId: string | null) => void;
  setCurrentPath: (path: string) => void;
  setSelectedFiles: (files: string[]) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSearchQuery: (query: string) => void;
  getCurrentFiles: () => FileItem[];
  getFileById: (id: string) => FileItem | undefined;
  getPathSegments: () => Array<{ name: string; path: string }>;
}

export type FileCategory =
  | "folder"
  | "image"
  | "video"
  | "audio"
  | "doc"
  | "sheet"
  | "code"
  | "archive"
  | "other";

export interface FileTypeConfig {
  icon: LucideIcon;
  color: string;
  extensions?: string[];
}

export const fileTypeMap: Record<FileCategory, FileTypeConfig> = {
  folder: { icon: FolderIcon, color: "text-blue-500" },
  image: {
    icon: ImageIcon,
    color: "text-green-500",
    extensions: ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"],
  },
  video: {
    icon: FilmIcon,
    color: "text-purple-500",
    extensions: ["mp4", "avi", "mkv", "mov", "wmv", "flv", "webm"],
  },
  audio: {
    icon: MusicIcon,
    color: "text-pink-500",
    extensions: ["mp3", "wav", "flac", "aac", "ogg", "wma"],
  },
  doc: {
    icon: FileTextIcon,
    color: "text-red-500",
    extensions: ["pdf", "doc", "docx", "txt", "rtf", "odt"],
  },
  sheet: {
    icon: FileSpreadsheetIcon,
    color: "text-teal-500",
    extensions: ["xls", "xlsx", "csv", "ods"],
  },
  code: {
    icon: CodeIcon,
    color: "text-yellow-600",
    extensions: [
      "js",
      "ts",
      "jsx",
      "tsx",
      "html",
      "css",
      "scss",
      "py",
      "java",
      "cpp",
      "c",
      "php",
      "rb",
      "go",
      "rs",
      "swift",
      "kt",
    ],
  },
  archive: {
    icon: ArchiveIcon,
    color: "text-orange-500",
    extensions: ["zip", "rar", "7z", "tar", "gz", "bz2"],
  },
  other: { icon: FileIcon, color: "text-gray-400" },
};

/*
 * Invoice Types
 */
export type Invoice = {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address: string;
  invoice_date: string;
  due_date: string;
  status: "draft" | "sent" | "paid" | "overdue";
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type InvoiceItem = {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  created_at: string;
};

export type InvoiceWithItems = Invoice & {
  invoice_items: InvoiceItem[];
};

export type View = "list" | "form" | "view";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface InvoiceFormProps {
  invoice?: InvoiceWithItems;
  onSave: () => void;
  onCancel: () => void;
}

export type FormItem = Omit<InvoiceItem, "id" | "invoice_id" | "created_at">;

export interface InvoiceListProps {
  onCreateNew: () => void;
  onEdit: (invoice: InvoiceWithItems) => void;
  onView: (invoice: InvoiceWithItems) => void;
}

export interface InvoiceViewProps {
  invoice: InvoiceWithItems;
  onEdit: () => void;
  onBack: () => void;
}

export interface InvoiceNotesProps {
  notes: string;
}

export interface InvoiceTableProps {
  items: InvoiceItem[];
}

export interface InvoiceTotalsProps {
  invoice: Invoice;
}

export interface InvoiceHeaderProps {
  invoice: Invoice;
}

export interface InvoiceClientInfoProps {
  invoice: Invoice;
}

/*
 * Kanban Board Types
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export type KanbanData = {
  columns: Column[];
};

export interface KanbanColumnProps {
  column: Column;
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTaskDrop: (
    taskId: string,
    targetColumnId: string,
    targetIndex?: number,
  ) => void;
  onDragStart?: (taskId: string) => void;
  draggedTaskId: string | null;
}

export interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task, columnId: string) => void;
  columnId: string;
  editingTask?: Task | null;
}

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDragStart?: (taskId: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  isDragging: boolean;
}

/*
 * Email Types
 */
export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: Date;
  isRead: boolean | EmailAction;
  isStarred: boolean | EmailAction;
  folder: EmailFolder | EmailAction;
  attachments: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  size: string; // e.g., "123 KB"
  type: string; // MIME type like "application/pdf"
  file?: File; // optional reference to uploaded file
}

export interface EmailAttachmentProps {
  attachment: Attachment;
  onDownload?: (attachment: Attachment) => void;
}

export type EmailFolder =
  | "inbox"
  | "sent"
  | "drafts"
  | "spam"
  | "trash"
  | "starred";

export type EmailAction = "star" | "archive" | "delete" | "markUnread";

export interface FolderInfo {
  id: EmailFolder;
  name: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  count?: number;
  unreadCount?: number;
}

export interface EmailSidebarProps {
  selectedFolder: EmailFolder;
  onFolderSelect: (folder: EmailFolder) => void;
  onComposeClick: () => void;
}

export interface EmailSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick?: () => void;
}

export type EmailFilter = "all" | "unread" | "starred";

export interface EmailSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter?: EmailFilter; // optional current filter
  onFilterChange?: (filter: EmailFilter) => void; // callback
}

export interface EmailListProps {
  emails: Email[];
  selectedEmail: Email | null;
  onEmailSelect: (email: Email) => void;
  onEmailAction: (action: EmailAction, email: Email) => void;
}

export type NewEmail = Omit<Email, "id" | "timestamp" | "isRead" | "isStarred">;

export interface EmailComposeProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (email: NewEmail) => void;
}

export interface EmailCardProps {
  email: Email;
  isSelected: boolean;
  onSelect: () => void;
  onAction: (action: EmailAction, email: Email) => void;
}

export interface EmailViewProps {
  email: Email;
  onReply: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onStar: () => void;
}

/*
 * Notes Types
 */
export interface Options {
  notes: Note[];
  searchTerm: string;
  sortBy: SortOption;
  selectedCategory: string;
}

export interface ShortcutActions {
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

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

export type SortOption = "updated" | "created" | "title" | "category";
export type ViewMode = "grid" | "list";

export interface NoteCardProps {
  note: Note;
  categories: Category[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  viewMode: ViewMode;
}

export interface NoteEditorState {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
}

export type Action =
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_CONTENT"; payload: string }
  | { type: "ADD_TAG"; payload: string }
  | { type: "REMOVE_TAG"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "RESET"; payload: NoteEditorState };

export interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCategory: (name: string, color: string) => void;
  onDeleteCategory: (id: string) => void;
  categories: Category[];
}

export interface NoteEditorProps {
  note: Note | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (noteData: Partial<Note>) => void;
}

export interface SearchAndFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Category[];
  onExport: (format: "json" | "txt") => void;
  onCreateNote: () => void;
  onCreateCategory: () => void;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TitleInputProps {
  value: string;
  onChange: (val: string) => void;
}

export interface ContentInputProps {
  value: string;
  onChange: (val: string) => void;
}

export interface CategorySelectorProps {
  value: string;
  categories: Category[];
  onChange: (val: string) => void;
}

export interface TagEditorProps {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export interface VirtualizedNoteListProps {
  notes: Note[];
  viewMode: ViewMode;
  categories: string[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

/*
 * Social Media Types
 */
export type Post = {
  id: string;
  user_id: string;
  social_account_id: string;
  content: string;
  media_urls: string[];
  status: "draft" | "scheduled" | "published" | "failed";
  scheduled_for: string | null;
  published_at: string | null;
  engagement_likes: number;
  engagement_comments: number;
  engagement_shares: number;
  engagement_impressions: number;
  created_at: string;
  updated_at: string;
};

export type SocialAccount = {
  id: string;
  user_id: string;
  platform: string;
  account_name: string;
  account_username: string;
  avatar_url: string | null;
  is_active: boolean;
  connected_at: string;
  created_at: string;
};

export type AnalyticsRecord = {
  id: string;
  social_account_id: string;
  date: string;
  followers_count: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_impressions: number;
};

export type DashboardSidebarProps = {
  activeView: string;
  onViewChange: (view: string) => void;
};

/*
 * TODO Types
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export interface TodoItemProps {
  todo: Todo;
  editingId: string | null;
  editValue: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string, text: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditChange: (val: string) => void;
}

export interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  editingId: string | null;
  editValue: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string, text: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditChange: (val: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export type FilterType = "all" | "active" | "completed";

export interface TodoInputProps {
  value: string;
  onChange: (val: string) => void;
  onAdd: () => void;
}

export interface TodoStatsProps {
  active: number;
  completed: number;
  total: number;
}

export interface TodoFiltersProps {
  filter: FilterType;
  onChange: (f: FilterType) => void;
  onClearCompleted: () => void;
  completed: number;
}
