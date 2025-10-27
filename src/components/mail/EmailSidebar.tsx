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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EmailSidebarProps, FolderInfo } from "@/lib/types";

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
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-background/70 backdrop-blur-sm">
      <div className="p-4 border-b bg-muted/30">
        <Button onClick={onComposeClick} className="w-full font-medium">
          <Edit3Icon className="mr-2 h-4 w-4" /> Compose
        </Button>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={selectedFolder === folder.id ? "secondary" : "ghost"}
            className="w-full justify-start text-left py-2 px-3 text-sm rounded-lg"
            onClick={() => onFolderSelect(folder.id)}
          >
            <folder.icon className="mr-3 h-4 w-4" />
            <span className="flex-1">{folder.name}</span>
            {folder.count && (
              <Badge variant="outline" className="text-xs">
                {folder.count}
              </Badge>
            )}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
