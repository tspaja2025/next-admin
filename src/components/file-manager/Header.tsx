"use client";

import {
  GridIcon,
  ListIcon,
  PlusIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import { useRef, useState } from "react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { Breadcrumbs } from "@/components/file-manager/Breadcrumbs";
import { CreateFolderDialog } from "@/components/file-manager/CreateFolderDialog";
import { useFiles } from "@/components/providers/Provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function Header() {
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
    <header className="border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Breadcrumbs />
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
                <PlusIcon className="h-4 w-4 mr-2" /> New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setCreateFolderOpen(true)}>
                <PlusIcon className="h-4 w-4 mr-2" /> New Folder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                <UploadIcon className="h-4 w-4 mr-2" /> Upload Files
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DarkModeToggle />
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
