"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { FileContextType, FileItem } from "@/lib/types";

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
  {
    id: "5",
    name: "presentation.pdf",
    type: "file",
    size: 2048576,
    modified: new Date("2024-01-16"),
    parentId: "1",
    path: "/Documents/presentation.pdf",
    extension: "pdf",
  },
  {
    id: "6",
    name: "photo.jpg",
    type: "file",
    size: 1536000,
    modified: new Date("2024-01-12"),
    parentId: "2",
    path: "/Images/photo.jpg",
    extension: "jpg",
  },
  {
    id: "7",
    name: "Web App",
    type: "folder",
    modified: new Date("2024-01-22"),
    parentId: "3",
    path: "/Projects/Web App",
  },
];

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Load files from localStorage or use initial files
      const storedFiles = localStorage.getItem("file-manager-files");
      const storedViewMode = localStorage.getItem("file-manager-view-mode");
      const storedCurrentPath = localStorage.getItem(
        "file-manager-current-path",
      );

      if (storedFiles) {
        // Parse files and convert modified dates back to Date objects
        const parsedFiles = JSON.parse(storedFiles).map((file: FileItem) => ({
          ...file,
          modified: new Date(file.modified),
        }));
        setFiles(parsedFiles);
      } else {
        // Use initial files if no stored data
        setFiles(initialFiles);
      }

      if (storedViewMode) {
        setViewMode(storedViewMode as "grid" | "list");
      }

      if (storedCurrentPath) {
        setCurrentPath(storedCurrentPath);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      // Fallback to initial files
      setFiles(initialFiles);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    try {
      localStorage.setItem("file-manager-files", JSON.stringify(files));
    } catch (error) {
      console.error("Error saving files to localStorage:", error);
    }
  }, [files, isInitialized]);

  // Save view mode to localStorage
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    try {
      localStorage.setItem("file-manager-view-mode", viewMode);
    } catch (error) {
      console.error("Error saving view mode to localStorage:", error);
    }
  }, [viewMode, isInitialized]);

  // Save current path to localStorage
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;

    try {
      localStorage.setItem("file-manager-current-path", currentPath);
    } catch (error) {
      console.error("Error saving current path to localStorage:", error);
    }
  }, [currentPath, isInitialized]);

  // ... rest of your existing FileProvider code remains the same
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
      if (a.type !== b.type) {
        return a.type === "folder" ? -1 : 1;
      }
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

    let path = "";
    segments.forEach((segment) => {
      path += `${path}/${segment}`;
      pathSegments.push({ name: segment, path });
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
        id: Date.now().toString(),
        name,
        type: "folder",
        modified: new Date(), // This should be the current date/time
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

        // Also delete children of deleted folders
        const findChildren = (parentId: string) => {
          const children = prev.filter((f) => f.parentId === parentId);
          children.forEach((child) => {
            toDelete.add(child.id);
            if (child.type === "folder") {
              findChildren(child.id);
            }
          });
        };

        fileIds.forEach((id) => {
          const file = prev.find((f) => f.id === id);
          if (file?.type === "folder") {
            findChildren(id);
          }
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
      if (!isInitialized) return;

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
    },
    [files, isInitialized],
  );

  const value: FileContextType = {
    files,
    currentPath,
    selectedFiles,
    viewMode,
    searchQuery,
    isInitialized,
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
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFiles() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
}
