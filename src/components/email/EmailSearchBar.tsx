import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type {
  EmailFilter,
  EmailSearchBarProps,
} from "@/components/providers/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function EmailSearchBar({
  searchQuery,
  onSearchChange,
  filter = "all",
  onFilterChange,
}: EmailSearchBarProps) {
  const filterLabels = {
    all: "All",
    unread: "Unread",
    starred: "Starred",
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b border-border bg-background">
      {/* Search Input */}
      <div className="flex-1 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search mail..."
          className="pl-10 pr-4 py-2 w-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            {filterLabels[filter]} <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
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
