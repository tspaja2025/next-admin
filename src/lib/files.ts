import { fileTypeMap, getFileCategory } from "@/lib/file-type-config";
import type { FileItem } from "@/lib/types";

export function getFileIcon(file: FileItem) {
  if (file.type === "folder") return fileTypeMap.folder.icon;
  return fileTypeMap[getFileCategory(file.extension)].icon;
}

export function getFileTypeColor(file: FileItem): string {
  if (file.type === "folder") return fileTypeMap.folder.color;
  return fileTypeMap[getFileCategory(file.extension)].color;
}
