export const STORAGE_KEYS = {
  FILES: "file-manager-files",
  VIEW_MODE: "file-manager-view-mode",
  CURRENT_PATH: "file-manager-current-path",
  AUTH_USER: "auth_user",
  DEMO_USERS: "demo_users",
  CALENDAR_EVENTS: "calendar-events",
  HIDDEN_COLORS: "hidden-colors",
} as const;

export const FILE_MANAGER_CONFIG = {
  STORAGE_LIMIT: 100 * 1024 * 1024, // 100MB
  ALLOWED_FILE_TYPES: ["image/*", "application/pdf", "text/plain"],
} as const;

export const eventColors = [
  { name: "Blue", value: "#1a73e8" },
  { name: "Green", value: "#137333" },
  { name: "Red", value: "#d50000" },
  { name: "Yellow", value: "#f9ab00" },
  { name: "Purple", value: "#9c27b0" },
  { name: "Orange", value: "#ff6d01" },
  { name: "Brown", value: "#795548" },
  { name: "Blue Grey", value: "#607d8b" },
] as const;

export const CALENDAR_VIEWS = {
  MONTH: "month",
  WEEK: "week",
  DAY: "day",
} as const;
