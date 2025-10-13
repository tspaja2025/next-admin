"use client";

import type { TodoStatsProps } from "@/components/providers/types";
import { Badge } from "@/components/ui/badge";

export function TodoStats({ active, completed, total }: TodoStatsProps) {
  return (
    <div className="flex gap-2 text-sm">
      <Badge>
        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
        {active} Active
      </Badge>
      <Badge>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        {completed} Completed
      </Badge>
      <Badge>
        <span className="w-3 h-3 rounded-full bg-gray-400"></span>
        {total} Total
      </Badge>
    </div>
  );
}
