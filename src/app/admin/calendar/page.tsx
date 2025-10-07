"use client";

import { CalendarDialog } from "@/components/calendar/CalendarDialog";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarProvider } from "@/components/calendar/CalendarProvider";
import { CalendarSidebar } from "@/components/calendar/CalendarSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function CalendarPage() {
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
