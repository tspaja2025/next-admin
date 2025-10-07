"use client";

import { Button } from "@/components/ui/button";
import type { DashboardSidebarProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboardIcon,
  PenSquareIcon,
  CalendarIcon,
  BarChart3Icon,
  UsersIcon,
  SettingsIcon,
} from "lucide-react";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  value: string;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
    value: "dashboard",
  },
  {
    label: "Create Post",
    icon: <PenSquareIcon />,
    value: "create",
  },
  {
    label: "Calendar",
    icon: <CalendarIcon />,
    value: "calendar",
  },
  {
    label: "Analytics",
    icon: <BarChart3Icon />,
    value: "analytics",
  },
  {
    label: "Accounts",
    icon: <UsersIcon />,
    value: "accounts",
  },
  {
    label: "Settings",
    icon: <SettingsIcon />,
    value: "settings",
  },
];

export function SocialDashboardSidebar({
  activeView,
  onViewChange,
}: DashboardSidebarProps) {
  return (
    <aside className="w-64 border-r  min-h-[calc(100vh-73px)]">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.value}
            variant={activeView === item.value ? "default" : "ghost"}
            onClick={() => onViewChange(item.value)}
            className="w-full justify-start"
          >
            {item.icon}
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
