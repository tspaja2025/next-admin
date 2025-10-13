import {
  ArchiveIcon,
  CodeIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FilmIcon,
  FolderIcon,
  ImageIcon,
  MusicIcon,
} from "lucide-react";
import type { FileCategory, FileTypeConfig } from "@/components/providers/types";

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

// Helper: find category by extension
export function getFileCategory(extension?: string): FileCategory {
  if (!extension) return "other";

  const ext = extension.toLowerCase();
  for (const [category, config] of Object.entries(fileTypeMap)) {
    if (config.extensions?.includes(ext)) return category as FileCategory;
  }
  return "other";
}
