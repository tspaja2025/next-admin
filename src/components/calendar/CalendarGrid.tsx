"use client";

import { CalendarDayView } from "@/components/calendar/views/CalendarDayView";
import { CalendarMonthView } from "@/components/calendar/views/CalendarMonthView";
import { CalendarWeekView } from "@/components/calendar/views/CalendarWeekView";
import { useCalendar } from "@/providers/CalendarProvider";

export function CalendarGrid() {
  const { view } = useCalendar();

  return (
    <div className="flex-1 overflow-y-auto">
      {view === "month" && <CalendarMonthView />}
      {view === "week" && <CalendarWeekView />}
      {view === "day" && <CalendarDayView />}
    </div>
  );
}
