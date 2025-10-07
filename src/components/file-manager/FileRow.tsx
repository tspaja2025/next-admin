"use client";

import { format, isToday, isYesterday } from "date-fns";
import { useState } from "react";
import { FileActionsDropdown } from "@/components/file-manager/FileActionsDropdown";
import { useFiles } from "@/components/file-manager/FileContext";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import { getFileIcon, getFileTypeColor } from "@/lib/files";
import type { FileRowProps } from "@/lib/types";
import { cn } from "@/lib/utils";

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

export function FileRow({ file, isGridView = true }: FileRowProps) {
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
