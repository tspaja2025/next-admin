"use client";

import { format, startOfToday, subMonths } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useCalendar } from "@/components/calendar/CalendarProvider";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function CalendarHeader() {
  const { currentDate, setCurrentDate, view, setView } = useCalendar();

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

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
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
        <DarkModeToggle />
      </div>
    </header>
  );
}
