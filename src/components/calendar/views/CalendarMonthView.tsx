"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useCalendar } from "@/components/calendar/CalendarProvider";
import type { CalendarEvent } from "@/lib/types";

export function CalendarMonthView() {
  const { currentDate, visibleEvents, openEventDialog } = useCalendar();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDay = (day: Date) => {
    return visibleEvents.filter(
      (event) =>
        isSameDay(event.startDate, day) ||
        (event.startDate <= day && event.endDate >= day),
    );
  };

  const handleDayClick = (day: Date) => {
    openEventDialog(day); // open new event dialog
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    openEventDialog(event.startDate, event); // open existing event dialog
  };

  return (
    <div className="flex flex-col h-full">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`border-r border-b p-2 min-h-[120px] cursor-pointer hover:bg-primary/90 dark:hover:bg-input/50 transition-colors ${
                !isCurrentMonth ? "bg-secondary text-secondary-foreground" : ""
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  isCurrentDay
                    ? "bg-[#1a73e8] text-white"
                    : isCurrentMonth
                      ? "text-gray-900"
                      : "text-gray-400"
                }`}
              >
                {format(day, "d")}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => handleEventClick(event, e)}
                    className="text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity truncate"
                    style={{ backgroundColor: event.color.toString() }}
                  >
                    {event.allDay
                      ? event.title
                      : `${format(event.startDate, "HH:mm")} ${event.title}`}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 font-medium">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
