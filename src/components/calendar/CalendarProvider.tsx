"use client";

import { eventColors } from "@/lib/event-colors";
import { CalendarContextType, CalendarEvent, CalendarView } from "@/lib/types";
import { createContext, ReactNode, useContext, useState, useMemo } from "react";

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hiddenColors, setHiddenColors] = useState<string[]>([]);

  const addEvent = (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: crypto.randomUUID(),
      color:
        eventData.color ||
        eventColors[Math.floor(Math.random() * eventColors.length)],
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const updateEvent = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event,
      ),
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const toggleColorVisibility = (color: string) => {
    setHiddenColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const openEventDialog = (date: Date, event?: CalendarEvent) => {
    setSelectedDate(date);
    setSelectedEvent(event ?? null);
    setIsEventDialogOpen(true);
  };

  const closeEventDialog = () => {
    setSelectedDate(null);
    setSelectedEvent(null);
    setIsEventDialogOpen(false);
  };

  const visibleEvents = useMemo(
    () =>
      events.filter((event) => !hiddenColors.includes(event.color.toString())),
    [events, hiddenColors],
  );

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        view,
        setView,
        events,
        selectedEvent,
        isEventDialogOpen,
        selectedDate,
        setSelectedEvent,
        setIsEventDialogOpen,
        setSelectedDate,
        hiddenColors,
        setHiddenColors,
        visibleEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleColorVisibility,
        openEventDialog,
        closeEventDialog,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
