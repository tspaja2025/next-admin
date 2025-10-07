"use client";

import React, { useRef } from "react";
import {
  startOfWeek,
  addDays,
  format,
  isSameDay,
  isToday,
  getHours,
} from "date-fns";
import { useCalendar } from "@/components/calendar/CalendarProvider";
import type { CalendarEvent } from "@/lib/types";

export function CalendarWeekView() {
  const { currentDate, visibleEvents, openEventDialog } = useCalendar();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Separate all-day events
  const allDayEvents = weekDays.map((day) =>
    visibleEvents.filter(
      (event) => event.allDay && isSameDay(event.startDate, day),
    ),
  );

  const getEventsForDayAndHour = (day: Date, hour: number) =>
    visibleEvents.filter(
      (event) =>
        !event.allDay &&
        isSameDay(event.startDate, day) &&
        getHours(event.startDate) === hour,
    );

  const handleTimeSlotClick = (day: Date, hour: number) => {
    const selectedDateTime = new Date(day);
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
      scrollContainerRef.current.scrollTop = getHours(event.startDate) * 60;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 border-r"></div>
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="p-4 text-center border-r">
            <div className="text-sm font-medium">{format(day, "EEE")}</div>
            <div
              className={`text-lg font-medium w-8 h-8 flex items-center justify-center rounded-full mx-auto mt-1 ${
                isToday(day)
                  ? "bg-[#1a73e8] text-white"
                  : "text-secondary-foreground"
              }`}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* All-day row */}
      <div className="grid grid-cols-8 border-b">
        <div className="p-2 border-r text-sm font-medium text-gray-600">
          All Day
        </div>
        {weekDays.map((_, i) => (
          <div key={i} className="p-1 border-r min-h-[40px]">
            {allDayEvents[i].map((event) => (
              <div
                key={event.id}
                onClick={(e) => handleEventClick(event, e)}
                className="text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity mb-1"
                style={{ backgroundColor: event.color.toString() }}
              >
                {event.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Hourly grid */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8">
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              {/* Hour label */}
              <div className="p-2 border-r border-b text-right text-sm">
                {hour === 0
                  ? "12 AM"
                  : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
              </div>

              {weekDays.map((day) => {
                const dayEvents = getEventsForDayAndHour(day, hour);
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    onClick={() => handleTimeSlotClick(day, hour)}
                    className="border-r border-b min-h-[60px] p-1 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => handleEventClick(event, e)}
                        className="text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 transition-opacity mb-1 truncate"
                        style={{ backgroundColor: event.color.toString() }}
                      >
                        {format(event.startDate, "HH:mm")} {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
