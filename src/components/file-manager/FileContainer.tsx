"use client";

import { DropZone } from "@/components/file-manager/DropZone";
import { FileGrid } from "@/components/file-manager/FileGrid";
import { FileList } from "@/components/file-manager/FileList";
import { useFiles } from "@/components/providers/Provider";

export function FileContainer() {
  const { getCurrentFiles, viewMode } = useFiles();
  const files = getCurrentFiles();

  if (files.length === 0) return <DropZone />;

  return viewMode === "grid" ? <FileGrid /> : <FileList />;
}
