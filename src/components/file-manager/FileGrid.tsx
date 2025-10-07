"use client";

import { DropZone } from "@/components/file-manager/DropZone";
import { useFiles } from "@/components/file-manager/FileContext";
import { FileRow } from "@/components/file-manager/FileRow";

export function FileGrid() {
  const { getCurrentFiles } = useFiles();
  const files = getCurrentFiles();

  if (files.length === 0) return <DropZone />;

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file) => (
          <FileRow key={file.id} file={file} isGridView />
        ))}
      </div>
    </div>
  );
}
