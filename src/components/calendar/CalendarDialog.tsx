"use client";

import { useState, useEffect } from "react";
import { useCalendar } from "@/components/calendar/CalendarProvider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2Icon, SaveIcon } from "lucide-react";
import { format } from "date-fns";
import { eventColors } from "@/lib/event-colors";

export function CalendarDialog() {
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
