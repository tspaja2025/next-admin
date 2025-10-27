"use client";

import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { EmailFilter, EmailSearchBarProps } from "@/lib/types";

export function EmailSearchBar({
  searchQuery,
  onSearchChange,
  filter = "all",
  onFilterChange,
}: EmailSearchBarProps) {
  const filterLabels = { all: "All", unread: "Unread", starred: "Starred" };

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-background/60 backdrop-blur-sm">
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search mail..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-sm">
            {filterLabels[filter]} <ChevronDownIcon className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(filterLabels).map(([key, label]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => onFilterChange?.(key as EmailFilter)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
