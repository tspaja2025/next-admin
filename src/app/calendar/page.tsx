"use client";

import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getHours,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfToday,
  startOfWeek,
  subMonths,
} from "date-fns";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { eventColors } from "@/lib/event-colors";
import type { CalendarEvent } from "@/lib/types";
import { CalendarProvider, useCalendar } from "@/providers/CalendarProvider";

export default function CalendarPage() {
  return (
    <CalendarProvider>
      <div className="flex flex-col flex-1">
        <CalendarHeader />
        <CalendarGrid />
        <CalendarDialog />
      </div>
    </CalendarProvider>
  );
}

function CalendarHeader() {
  const {
    currentDate,
    setCurrentDate,
    view,
    setView,
    setSelectedEvent,
    setSelectedDate,
    setIsEventDialogOpen,
  } = useCalendar();

  const handlePrevious = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === "week") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
    }
  };

  const handleToday = () => {
    setCurrentDate(startOfToday());
  };

  const getDateTitle = () => {
    if (view === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (view === "week") {
      return format(currentDate, "MMMM yyyy");
    } else {
      return format(currentDate, "EEEE, MMMM d, yyyy");
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setIsEventDialogOpen(true);
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b ">
      <Button variant="outline" size="sm" onClick={handlePrevious}>
        <ChevronLeftIcon />
      </Button>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{getDateTitle()}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Button variant="outline" size="sm" onClick={handleNext}>
        <ChevronRightIcon />
      </Button>
      <div className="flex items-center ml-auto px-3">
        <Button variant="outline" size="sm" onClick={handleToday}>
          Today
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Button
          variant={view === "month" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("month")}
        >
          Month
        </Button>
        <Button
          variant={view === "week" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("week")}
        >
          Week
        </Button>
        <Button
          variant={view === "day" ? "default" : "ghost"}
          size="sm"
          onClick={() => setView("day")}
        >
          Day
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Button onClick={handleCreateEvent}>
          <PlusIcon /> Create
        </Button>
      </div>
    </header>
  );
}

function CalendarGrid() {
  const { view } = useCalendar();

  return (
    <div className="flex-1 overflow-y-auto">
      {view === "month" && <CalendarMonthView />}
      {view === "week" && <CalendarWeekView />}
      {view === "day" && <CalendarDayView />}
    </div>
  );
}

function CalendarDialog() {
  const {
    isEventDialogOpen,
    setIsEventDialogOpen,
    selectedEvent,
    selectedDate,
    addEvent,
    updateEvent,
    deleteEvent,
    closeEventDialog,
  } = useCalendar();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [color, setColor] = useState("#1a73e8");

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description || "");
      setStartDate(format(selectedEvent.startDate, "yyyy-MM-dd"));
      setStartTime(format(selectedEvent.startDate, "HH:mm"));
      setEndDate(format(selectedEvent.endDate, "yyyy-MM-dd"));
      setEndTime(format(selectedEvent.endDate, "HH:mm"));
      setAllDay(selectedEvent.allDay);
      setColor(selectedEvent.color.toString());
    } else if (selectedDate) {
      setTitle("");
      setDescription("");
      setStartDate(format(selectedDate, "yyyy-MM-dd"));
      setStartTime(format(selectedDate, "HH:mm"));
      setEndDate(format(selectedDate, "yyyy-MM-dd"));
      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(endDateTime.getHours() + 1);
      setEndTime(format(endDateTime, "HH:mm"));
      setAllDay(false);
      setColor("#1a73e8");
    }
  }, [selectedEvent, selectedDate]);

  const handleSave = () => {
    if (!title.trim()) return;

    const eventStartDate = new Date(
      `${startDate}T${allDay ? "00:00" : startTime}`,
    );
    const eventEndDate = new Date(`${endDate}T${allDay ? "23:59" : endTime}`);

    const eventData = {
      title: title.trim(),
      description: description.trim(),
      startDate: eventStartDate,
      endDate: eventEndDate,
      allDay,
      color,
    };

    if (selectedEvent) {
      updateEvent({ ...eventData, id: selectedEvent.id });
    } else {
      addEvent(eventData);
    }

    handleClose();
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      handleClose();
    }
  };

  const handleClose = () => {
    closeEventDialog();
    setTitle("");
    setDescription("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setAllDay(false);
    setColor("#1a73e8");
  };

  useEffect(() => {
    console.log("Dialog open state:", isEventDialogOpen);
  }, [isEventDialogOpen]);

  return (
    <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit Event" : "New Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title"
              className="col-span-3"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
              className="col-span-3"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="all-day" checked={allDay} onCheckedChange={setAllDay} />
            <Label htmlFor="all-day">All day</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            {!allDay && (
              <div className="grid gap-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {!allDay && (
              <div className="grid gap-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="color">Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {eventColors.find((c) => c.value === color)?.name}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {eventColors.map((colorOption) => (
                  <SelectItem key={colorOption.value} value={colorOption.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: colorOption.value }}
                      />
                      {colorOption.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between">
          {selectedEvent && (
            <Button
              onClick={handleDelete}
              variant="destructive"
              size="sm"
              className="flex items-center gap-2"
            >
              <Trash2Icon className="w-4 h-4" />
              Delete
            </Button>
          )}

          <div className="flex gap-2 ml-auto">
            <Button onClick={handleClose} variant="outline" size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!title.trim()}
              size="sm"
              className="bg-[#1a73e8] hover:bg-[#1557b0] flex items-center gap-2"
            >
              <SaveIcon className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CalendarMonthView() {
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

function CalendarWeekView() {
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
          <div key={i} className="p-1 border-r min-h-10">
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

function CalendarDayView() {
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
