"use client";

import { format, isToday, isYesterday } from "date-fns";
import {
  DownloadIcon,
  EditIcon,
  FolderPlusIcon,
  GridIcon,
  HomeIcon,
  ListIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getFileIcon, getFileTypeColor } from "@/lib/files";
import type {
  CreateFolderDialogProps,
  FileItem,
  FileRowProps,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { useFiles } from "@/providers/FileProvider";

function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / k ** i;

  // Avoid trailing ".00" when decimals = 0
  return `${value.toFixed(decimals)} ${sizes[i]}`;
}

function RelativeDate({ date }: { date: Date }) {
  if (isToday(date)) {
    return <span>Today</span>;
  } else if (isYesterday(date)) {
    return <span>Yesterday</span>;
  } else {
    return <span>{format(date, "MMM d, yyyy")}</span>;
  }
}

export default function FileManagerPage() {
  return <FileManager />;
}

function FileManager() {
  return (
    <div className="flex flex-col">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1  overflow-hidden">
          <div className="h-full overflow-auto">
            <FileContainer />
          </div>
        </main>
      </div>
    </div>
  );
}

function Header() {
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    uploadFiles,
    currentPath,
    files,
  } = useFiles();

  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getPathSegments, setCurrentPath } = useFiles();
  const segments = getPathSegments();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (!uploadedFiles.length) return;

    const currentParentId =
      currentPath === "/"
        ? null
        : files.find((f) => f.path === currentPath)?.id || null;

    uploadFiles(uploadedFiles, currentParentId);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <header className="border-b pb-2">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              {segments.map((segment, index) => {
                const isLast = index === segments.length - 1;
                return (
                  <BreadcrumbItem key={segment.path}>
                    {isLast ? (
                      <span className="flex items-center gap-1">
                        {index === 0 ? (
                          <HomeIcon className="h-4 w-4" />
                        ) : (
                          segment.name
                        )}
                      </span>
                    ) : (
                      <BreadcrumbLink
                        onClick={() => setCurrentPath(segment.path)}
                      >
                        {index === 0 ? (
                          <HomeIcon className="h-4 w-4" />
                        ) : (
                          segment.name
                        )}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <GridIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <PlusIcon /> New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCreateFolderOpen(true)}>
                <PlusIcon /> New Folder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <UploadIcon /> Upload Files
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
        <CreateFolderDialog
          open={createFolderOpen}
          onOpenChange={setCreateFolderOpen}
        />
      </div>
    </header>
  );
}

function FileContainer() {
  const { getCurrentFiles, viewMode } = useFiles();
  const files = getCurrentFiles();

  if (files.length === 0) return <DropZone />;

  return viewMode === "grid" ? <FileGrid /> : <FileList />;
}

function FileList() {
  const { getCurrentFiles, selectedFiles, setSelectedFiles } = useFiles();
  const files = getCurrentFiles();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <Checkbox
              checked={
                selectedFiles.length === files.length && files.length > 0
              }
              onCheckedChange={(checked) =>
                setSelectedFiles(checked ? files.map((f) => f.id) : [])
              }
            />
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="w-32">Size</TableHead>
          <TableHead className="w-48">Modified</TableHead>
          <TableHead className="w-12">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <FileRow key={file.id} file={file} isGridView={false} />
        ))}
      </TableBody>
    </Table>
  );
}

function FileRow({ file, isGridView = true }: FileRowProps) {
  const { selectedFiles, setSelectedFiles, setCurrentPath } = useFiles();
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedFiles.includes(file.id);
  const Icon = getFileIcon(file);
  const color = getFileTypeColor(file);

  const toggleSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFiles(
      isSelected
        ? selectedFiles.filter((id) => id !== file.id)
        : [...selectedFiles, file.id],
    );
  };

  const handleClick = () => {
    if (file.type === "folder") {
      setCurrentPath(file.path);
    }
  };

  if (isGridView) {
    return (
      <Card
        className="relative p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group bg-card"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Checkbox - Top left */}
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onClick={toggleSelection}
            className="h-4 w-4"
          />
        </div>

        {/* Actions dropdown - Top right */}
        <div className="absolute top-3 right-3 z-10">
          <FileActionsDropdown file={file} />
        </div>

        {/* File content */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="mb-3">
            <Icon className={`h-12 w-12 ${color}`} />
          </div>
          <div className="w-full">
            <p className="text-sm font-medium truncate mb-1">{file.name}</p>
            <div className="flex flex-col text-xs text-muted-foreground space-y-1">
              {file.type === "file" && file.size && (
                <span>{formatFileSize(file.size)}</span>
              )}
              <span>
                <RelativeDate date={file.modified} />
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // TABLE VIEW (keep your existing table view code)
  return (
    <TableRow
      className="cursor-pointer hover:bg-accent/50"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isSelected}
          onChange={() => {
            setSelectedFiles(
              isSelected
                ? selectedFiles.filter((id) => id !== file.id)
                : [...selectedFiles, file.id],
            );
          }}
        />
      </TableCell>

      <TableCell className="flex items-center gap-2">
        <Icon className={cn("w-5 h-5", color)} />
        <span className="truncate">{file.name}</span>
      </TableCell>

      <TableCell>
        {file.type === "file" && file.size ? formatFileSize(file.size) : "—"}
      </TableCell>

      <TableCell>
        <RelativeDate date={file.modified} />
      </TableCell>

      <TableCell onClick={(e) => e.stopPropagation()}>
        <FileActionsDropdown file={file} />
      </TableCell>
    </TableRow>
  );
}

function FileActionsDropdown({ file }: { file: FileItem }) {
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

function DropZone() {
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
        className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${
          isDragOver ? "border-blue-400" : "border-gray-300"
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

function FileGrid() {
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

function CreateFolderDialog({ open, onOpenChange }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("");
  const { createFolder, currentPath, files } = useFiles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      const currentParentId =
        currentPath === "/"
          ? null
          : files.find((f) => f.path === currentPath)?.id || null;
      createFolder(folderName.trim(), currentParentId);
      setFolderName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>New folder</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="folder-name" className="text-right">
                Name
              </Label>
              <Input
                id="folder-name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="col-span-3"
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!folderName.trim()}>
              Create Folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
