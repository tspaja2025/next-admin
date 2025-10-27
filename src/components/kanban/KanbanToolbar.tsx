"use client";

import { FilterIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function KanbanToolbar() {
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("createdAt");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/50 pb-3">
      {/* Left side: Board Title */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Project Kanban</h1>
        <Badge variant="secondary" className="text-xs">
          v1.0
        </Badge>
      </div>

      {/* Right side: Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8 w-[200px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm">
          <FilterIcon className="h-4 w-4 mr-2" /> Filter
        </Button>

        <Button size="sm">
          <PlusIcon className="h-4 w-4 mr-2" /> Add Column
        </Button>
      </div>
    </div>
  );
}
