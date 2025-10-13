"use client";

import KanbanBoard from "@/components/kanban/KanbanBoard";
import { useAuth } from "@/components/providers/Provider";

export default function KanbanBoardPage() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }
  return <KanbanBoard />;
}
