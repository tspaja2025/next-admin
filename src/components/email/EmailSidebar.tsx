"use client";

import {
  AlertTriangleIcon,
  Edit3Icon,
  FileTextIcon,
  InboxIcon,
  SendIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react";
import type {
  EmailSidebarProps,
  FolderInfo,
} from "@/components/providers/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const folders: FolderInfo[] = [
  { id: "inbox", name: "Inbox", icon: InboxIcon, count: 5 },
  { id: "starred", name: "Starred", icon: StarIcon },
  { id: "sent", name: "Sent", icon: SendIcon, count: 12 },
  { id: "drafts", name: "Drafts", icon: FileTextIcon, count: 2 },
  { id: "spam", name: "Spam", icon: AlertTriangleIcon },
  { id: "trash", name: "Trash", icon: Trash2Icon },
];

export function EmailSidebar({
  selectedFolder,
  onFolderSelect,
  onComposeClick,
}: EmailSidebarProps) {
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b ">
        <Button onClick={onComposeClick} className="w-full">
          <Edit3Icon />
          Compose
        </Button>
      </div>

      {/* Folders */}
      <div className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {folders.map((folder) => {
            return (
              <Button
                key={folder.id}
                variant={selectedFolder === folder.id ? "default" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => {
                  onFolderSelect(folder.id);
                }}
              >
                <folder.icon />
                <span className="flex-1">{folder.name}</span>
                {folder.count && (
                  <Badge
                    variant={
                      selectedFolder === folder.id ? "default" : "secondary"
                    }
                    className="ml-auto text-xs"
                  >
                    {folder.count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return <div className="hidden md:flex w-64 border-r">{sidebarContent}</div>;
}
