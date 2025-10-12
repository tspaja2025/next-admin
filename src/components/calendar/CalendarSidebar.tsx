"use client";

import { PlusIcon } from "lucide-react";
import type React from "react";
import { CalendarEventFilters } from "@/components/calendar/CalendarEventFilters";
import { CalendarMini } from "@/components/calendar/CalendarMini";
import { useCalendar } from "@/components/calendar/CalendarProvider";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function CalendarSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { setSelectedEvent, setSelectedDate, setIsEventDialogOpen } =
    useCalendar();

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setIsEventDialogOpen(true);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-16 justify-center border-b">
        {/* Create button */}
        <Button onClick={handleCreateEvent}>
          <PlusIcon /> Create
        </Button>
      </SidebarHeader>
      <SidebarContent className="px-4">
        {/* Mini Calendar */}
        <CalendarMini />
        {/* Event Filters */}
        <CalendarEventFilters />
      </SidebarContent>
    </Sidebar>
  );
}
