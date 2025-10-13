"use client";

import { FolderPlusIcon, UploadIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { CreateFolderDialog } from "@/components/file-manager/CreateFolderDialog";
import { useFiles } from "@/components/providers/Provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function DropZone() {
  const { uploadFiles, currentPath, files } = useFiles();
  const [isDragOver, setIsDragOver] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const droppedFiles = Array.from(e.dataTransfer.files);
      if (!droppedFiles.length) return;

      const currentParentId =
        currentPath === "/"
          ? null
          : files.find((f) => f.path === currentPath)?.id || null;

      uploadFiles(droppedFiles, currentParentId);
    },
    [uploadFiles, currentPath, files],
  );

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      const currentParentId =
        currentPath === "/"
          ? null
          : files.find((f) => f.path === currentPath)?.id || null;
      uploadFiles(selectedFiles, currentParentId);
    }
  };

  return (
    <>
      <Card
        className={`flex-1 flex flex-col items-center justify-center p-8 m-6 border-2 border-dashed rounded-lg transition-colors ${
          isDragOver
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-50"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon className="h-16 w-16  mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {isDragOver ? "Drop files here" : "No files here yet"}
        </h3>
        <p className="mb-6 text-center">
          {isDragOver
            ? "Release to upload your files"
            : "Drag and drop files here, or use the buttons below to get started"}
        </p>

        <div className="flex gap-4">
          <label htmlFor="file-upload">
            <Button asChild>
              <span>
                <UploadIcon className="h-4 w-4 mr-2" />
                Upload Files
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          <Button variant="outline" onClick={() => setCreateFolderOpen(true)}>
            <FolderPlusIcon className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </Card>

      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
      />
    </>
  );
}
