"use client";

import React from "react";
import { useCalendar } from "@/components/calendar/CalendarProvider";
import { isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

export function CalendarMini() {
  const { currentDate, setCurrentDate, events } = useCalendar();

  const hasEventsOnDay = (day: Date) => {
    return events.some(
      (event) =>
        isSameDay(event.startDate, day) ||
        (event.startDate <= day && event.endDate >= day),
    );
  };

  return (
    <Calendar
      mode="single"
      selected={currentDate}
      onSelect={(day) => day && setCurrentDate(day)}
      month={currentDate}
      onMonthChange={(month) => setCurrentDate(month)}
      showOutsideDays
      modifiers={{
        hasEvents: hasEventsOnDay,
      }}
      modifiersClassNames={{
        hasEvents:
          "relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#1a73e8] after:rounded-full",
      }}
      className="bg-transparent m-0 p-0 pt-2 w-full"
    />
  );
}
