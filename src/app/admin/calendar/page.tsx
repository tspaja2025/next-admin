"use client";

import { CalendarDialog } from "@/components/calendar/CalendarDialog";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { CalendarProvider, useAuth } from "@/components/providers/Provider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function CalendarPage() {
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
  return (
    <SidebarProvider>
      <CalendarProvider>
        <div className="flex h-screen w-full">
          <CalendarSidebar />
          <SidebarInset className="flex-1">
            <CalendarHeader />
            <CalendarGrid />
          </SidebarInset>
          <CalendarDialog />
        </div>
      </CalendarProvider>
    </SidebarProvider>
  );
}
