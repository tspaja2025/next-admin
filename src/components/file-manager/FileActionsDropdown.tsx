"use client";

import {
  DownloadIcon,
  EditIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { useFiles } from "@/components/file-manager/FileContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FileItem } from "@/lib/types";

export function FileActionsDropdown({ file }: { file: FileItem }) {
  const { deleteFiles, renameFile } = useFiles();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add download logic here
    console.log("Download:", file.name);
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Add rename logic here
    const newName = prompt("Enter new name:", file.name);
    if (newName?.trim() && newName !== file.name) {
      renameFile(file.id, newName.trim());
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      deleteFiles([file.id]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => e.stopPropagation()}
          className="h-8 w-8 p-0"
        >
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={handleDownload}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRename}>
          <EditIcon className="h-4 w-4 mr-2" />
          Rename
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash2Icon className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
