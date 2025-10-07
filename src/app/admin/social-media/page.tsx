"use client";

import { SocialAccounts } from "@/components/social/SocialAccounts";
import { SocialAnalytics } from "@/components/social/SocialAnalytics";
import { useAuth } from "@/components/social/SocialAuthProvider";
import { SocialCalendarView } from "@/components/social/SocialCalendarView";
import { SocialCreatePost } from "@/components/social/SocialCreatePost";
import { SocialDashboardHeader } from "@/components/social/SocialDashboardHeader";
import { SocialDashboardOverview } from "@/components/social/SocialDashboardOverview";
import { SocialDashboardSidebar } from "@/components/social/SocialDashboardSidebar";
import { SocialLoginForm } from "@/components/social/SocialLoginForm";
import { SocialSignUpForm } from "@/components/social/SocialSignUpForm";
import { useState } from "react";

export default function SocialMediaPage() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [activeView, setActiveView] = useState("dashboard");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
        {showLogin ? (
          <SocialLoginForm onToggle={() => setShowLogin(false)} />
        ) : (
          <SocialSignUpForm onToggle={() => setShowLogin(true)} />
        )}
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
    <div className="min-h-screen bg-gray-50">
      <SocialDashboardHeader />
      <div className="flex">
        <SocialDashboardSidebar
          activeView={activeView}
          onViewChange={setActiveView}
        />
        <main className="flex-1 p-8">{renderView()}</main>
      </div>
    </div>
  );
}
