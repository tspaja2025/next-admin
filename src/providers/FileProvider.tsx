"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { FILE_MANAGER_CONFIG, STORAGE_KEYS } from "@/lib/constants";
import type { FileContextType, FileItem, ViewMode } from "@/lib/types";

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
