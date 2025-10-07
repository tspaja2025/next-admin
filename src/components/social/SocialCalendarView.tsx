"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
} from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/social/SocialAuthProvider";
import type { Post, SocialAccount } from "@/lib/types";
import { getStatusColor } from "@/lib/social-utils";

export function SocialCalendarView() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, currentDate]);

  const fetchData = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);

    // Fetch from localStorage instead of Supabase
    const allPosts: Post[] = JSON.parse(
      localStorage.getItem("demo_posts") || "[]",
    );
    const allAccounts: SocialAccount[] = JSON.parse(
      localStorage.getItem("demo_accounts") || "[]",
    );

    // Filter by logged-in user
    const userPosts = allPosts.filter(
      (p) =>
        p.user_id === user?.id &&
        p.scheduled_for &&
        new Date(p.scheduled_for) >= start &&
        new Date(p.scheduled_for) <= end,
    );

    const userAccounts = allAccounts.filter((a) => a.user_id === user?.id);

    setPosts(userPosts);
    setAccounts(userAccounts);
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const getPostsForDay = (day: Date) => {
    return posts.filter((post) => {
      if (!post.scheduled_for) return false;
      return isSameDay(parseISO(post.scheduled_for), day);
    });
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Content Calendar</h2>
          <p className="text-gray-500 mt-1">
            View and manage your scheduled posts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <div className="text-lg font-semibold px-4">
            {format(currentDate, "MMMM yyyy")}
          </div>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-sm text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {daysInMonth.map((day) => {
              const dayPosts = getPostsForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  className={cn(
                    "min-h-[120px] border rounded-lg p-2 bg-white",
                    isToday && "border-blue-500 border-2",
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-2",
                      isToday ? "text-blue-600" : "text-gray-900",
                    )}
                  >
                    {format(day, "d")}
                  </div>
                  <div className="space-y-1">
                    {dayPosts.map((post) => {
                      const account = accounts.find(
                        (a) => a.id === post.social_account_id,
                      );
                      return (
                        <div
                          key={post.id}
                          className={cn(
                            "text-xs p-2 rounded border",
                            getStatusColor(post.status),
                          )}
                        >
                          <div className="font-medium truncate">
                            {account?.platform || "Account"}
                          </div>
                          <div className="truncate text-[10px] mt-1">
                            {format(parseISO(post.scheduled_for!), "h:mm a")}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                Scheduled
              </Badge>
              <span className="text-sm text-gray-600">Ready to publish</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Published
              </Badge>
              <span className="text-sm text-gray-600">Successfully posted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gray-100 text-gray-700 border-gray-200">
                Draft
              </Badge>
              <span className="text-sm text-gray-600">Work in progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-red-100 text-red-700 border-red-200">
                Failed
              </Badge>
              <span className="text-sm text-gray-600">Publishing error</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
