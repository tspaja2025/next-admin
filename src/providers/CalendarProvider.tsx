"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { CALENDAR_VIEWS, eventColors, STORAGE_KEYS } from "@/lib/constants";
import type {
  CalendarContextType,
  CalendarEvent,
  CalendarView,
} from "@/lib/types";

const CalendarContext = createContext<CalendarContextType | null>(null);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(CALENDAR_VIEWS.MONTH);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>(
    STORAGE_KEYS.CALENDAR_EVENTS,
    [],
  );
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hiddenColors, setHiddenColors] = useLocalStorage<string[]>(
    STORAGE_KEYS.HIDDEN_COLORS,
    [],
  );

  // Event validation
  const validateEvent = (event: Omit<CalendarEvent, "id">): boolean => {
    return event.title.trim().length > 0 && event.startDate <= event.endDate;
  };

  const getDefaultEventColor = () => eventColors[0];

  const addEvent = useCallback(
    (eventData: Omit<CalendarEvent, "id">) => {
      if (!validateEvent(eventData)) {
        throw new Error("Invalid event data");
      }

      const newEvent: CalendarEvent = {
        ...eventData,
        id: crypto.randomUUID(),
        color: eventData.color || getDefaultEventColor(),
      };
      setEvents((prev) => [...prev, newEvent]);
    },
    [setEvents],
  );

  const updateEvent = useCallback(
    (updatedEvent: CalendarEvent) => {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      );
    },
    [setEvents],
  );

  const deleteEvent = useCallback(
    (id: string) => {
      setEvents((prev) => prev.filter((event) => event.id !== id));
    },
    [setEvents],
  );

  const toggleColorVisibility = useCallback(
    (color: string) => {
      setHiddenColors((prev) =>
        prev.includes(color)
          ? prev.filter((c) => c !== color)
          : [...prev, color],
      );
    },
    [setHiddenColors],
  );

  const openEventDialog = useCallback((date: Date, event?: CalendarEvent) => {
    setSelectedDate(date);
    setSelectedEvent(event ?? null);
    setIsEventDialogOpen(true);
  }, []);

  const closeEventDialog = useCallback(() => {
    setSelectedDate(null);
    setSelectedEvent(null);
    setIsEventDialogOpen(false);
  }, []);

  const visibleEvents = useMemo(
    () =>
      events.filter((event) => !hiddenColors.includes(event.color.toString())),
    [events, hiddenColors],
  );

  const value = useMemo(
    (): CalendarContextType => ({
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
    }),
    [
      currentDate,
      view,
      events,
      selectedEvent,
      isEventDialogOpen,
      selectedDate,
      hiddenColors,
      visibleEvents,
      addEvent,
      updateEvent,
      deleteEvent,
      toggleColorVisibility,
      openEventDialog,
      closeEventDialog,
    ],
  );

  return (
    <CalendarContext.Provider value={value}>
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
