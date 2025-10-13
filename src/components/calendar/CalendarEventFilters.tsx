"use client";

import React from "react";
import { useCalendar } from "@/components/providers/Provider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { eventColors } from "@/lib/event-colors";

export function CalendarEventFilters() {
  const { events, hiddenColors, setHiddenColors } = useCalendar();

  // Get unique colors that are actually used in events
  const usedColors = [...new Set(events.map((event) => event.color))];
  const availableColors = eventColors.filter((color) =>
    usedColors.includes(color.value),
  );

  const handleColorToggle = (colorValue: string, checked: boolean) => {
    if (checked) {
      // Remove from hidden colors (show the color)
      // @ts-expect-error argument can be assigned
      setHiddenColors((prev) => prev.filter((color) => color !== colorValue));
    } else {
      // Add to hidden colors (hide the color)
      // @ts-expect-error argument is assigned
      setHiddenColors((prev) => [...prev, colorValue]);
    }
  };

  const getEventCountForColor = (colorValue: string) => {
    return events.filter((event) => event.color === colorValue).length;
  };

  if (availableColors.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">My calendars</h3>
        <p className="text-xs text-gray-500">No events to filter</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-3">My calendars</h3>
      <div className="space-y-2">
        {availableColors.map((color) => {
          const isVisible = !hiddenColors.includes(color.value);
          const eventCount = getEventCountForColor(color.value);

          return (
            <div key={color.value} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color.value}`}
                checked={isVisible}
                onCheckedChange={(checked) =>
                  handleColorToggle(color.value, checked as boolean)
                }
                className="data-[state=checked]:bg-[#1a73e8] data-[state=checked]:border-[#1a73e8]"
              />
              <Label
                htmlFor={`color-${color.value}`}
                className="flex items-center gap-2 text-sm cursor-pointer flex-1"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color.value }}
                />
                <span className="flex-1">{color.name}</span>
                <span className="text-xs text-gray-500">({eventCount})</span>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
