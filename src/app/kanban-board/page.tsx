"use client";

import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { KanbanToolbar } from "@/components/kanban/KanbanToolbar";

export default function KanbanBoardPage() {
  return (
    <div className="p-4 md:p-6 flex flex-col gap-6">
      <KanbanToolbar />
      <KanbanBoard />
    </div>
  );
}
