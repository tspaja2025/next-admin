"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/Provider";
import { SocialAccounts } from "@/components/social/SocialAccounts";
import { SocialAnalytics } from "@/components/social/SocialAnalytics";
import { SocialCalendarView } from "@/components/social/SocialCalendarView";
import { SocialCreatePost } from "@/components/social/SocialCreatePost";
import { SocialDashboardOverview } from "@/components/social/SocialDashboardOverview";
import { SocialDashboardSidebar } from "@/components/social/SocialDashboardSidebar";

export default function SocialMediaPage() {
  const { loading } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <SocialDashboardOverview />;
      case "create":
        return <SocialCreatePost />;
      case "calendar":
        return <SocialCalendarView />;
      case "analytics":
        return <SocialAnalytics />;
      case "accounts":
        return <SocialAccounts />;
      default:
        return <SocialDashboardOverview />;
    }
  };

  return (
    <div className="flex">
      <SocialDashboardSidebar
        activeView={activeView}
        onViewChange={setActiveView}
      />
      <main className="flex-1 p-4">{renderView()}</main>
    </div>
  );
}
