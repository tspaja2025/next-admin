"use client";

import { format, getHours, isSameDay, isToday } from "date-fns";
import React, { useRef } from "react";
import { useCalendar } from "@/components/providers/Provider";
import type { CalendarEvent } from "@/components/providers/types";

export function CalendarDayView() {
  const { currentDate, visibleEvents, openEventDialog } = useCalendar();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Separate all-day and hourly events
  const allDayEvents = visibleEvents.filter(
    (event) => event.allDay && isSameDay(event.startDate, currentDate),
  );
  const hourlyEvents = visibleEvents.filter(
    (event) => !event.allDay && isSameDay(event.startDate, currentDate),
  );

  const getEventsForHour = (hour: number) =>
    hourlyEvents.filter((event) => getHours(event.startDate) === hour);

  const handleTimeSlotClick = (hour: number) => {
    const selectedDateTime = new Date(currentDate);
    selectedDateTime.setHours(hour, 0, 0, 0);
    openEventDialog(selectedDateTime);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = hour * 60;
    }
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    openEventDialog(event.startDate, event);

    if (!event.allDay && scrollContainerRef.current) {
      const hour = getHours(event.startDate);
      scrollContainerRef.current.scrollTop = hour * 60;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Day header */}
      <div className="border-b p-4 text-center">
        <div className="text-sm font-medium">{format(currentDate, "EEEE")}</div>
        <div
          className={`text-2xl font-medium w-12 h-12 flex items-center justify-center rounded-full mx-auto mt-1 ${
            isToday(currentDate)
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "text-gray-900 dark:text-gray-300"
          }`}
        >
          {format(currentDate, "d")}
        </div>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="border-b p-2 space-y-1">
          {allDayEvents.map((event) => (
            <div
              key={event.id}
              onClick={(e) => handleEventClick(event, e)}
              className="text-sm p-2 rounded cursor-pointer hover:opacity-80 transition-opacity text-white"
              style={{ backgroundColor: event.color.toString() }}
            >
              {event.title}
            </div>
          ))}
        </div>
      )}

      {/* Hourly events */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2">
          {hours.map((hour) => {
            const hourEvents = getEventsForHour(hour);
            return (
              <React.Fragment key={hour}>
                {/* Hour label */}
                <div className="p-2 border-r border-b border-gray-200 dark:border-gray-700 text-right text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                        ? "12 PM"
                        : `${hour - 12} PM`}
                </div>

                {/* Hour slot */}
                <div
                  onClick={() => handleTimeSlotClick(hour)}
                  className="border-b border-gray-200 dark:border-gray-700 min-h-[60px] p-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => handleEventClick(event, e)}
                      className="text-sm p-2 rounded cursor-pointer hover:opacity-80 transition-opacity mb-1 text-white"
                      style={{ backgroundColor: event.color.toString() }}
                    >
                      {format(event.startDate, "HH:mm")} {event.title}
                    </div>
                  ))}
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
