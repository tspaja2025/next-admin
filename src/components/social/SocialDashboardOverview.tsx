"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  FileTextIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/Provider";
import type { Post, SocialAccount } from "@/components/providers/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusColor } from "@/lib/social-utils";

export function SocialDashboardOverview() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Simulate network delay (optional)
      await new Promise((r) => setTimeout(r, 300));

      const allPosts: Post[] = JSON.parse(
        localStorage.getItem("demo_posts") || "[]",
      );
      const allAccounts: SocialAccount[] = JSON.parse(
        localStorage.getItem("demo_accounts") || "[]",
      );

      // Filter by logged-in user
      const userPosts = allPosts
        .filter((p) => p.user_id === user?.id)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 10);

      const userAccounts = allAccounts.filter((a) => a.user_id === user?.id);

      setPosts(userPosts);
      setAccounts(userAccounts);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const scheduledCount = posts.filter((p) => p.status === "scheduled").length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const totalEngagement = posts.reduce(
    (sum, p) =>
      sum + p.engagement_likes + p.engagement_comments + p.engagement_shares,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Connected Accounts
            </CardTitle>
            <UsersIcon className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{accounts.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active social accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled Posts
            </CardTitle>
            <CalendarIcon className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{scheduledCount}</div>
            <p className="text-xs text-gray-500 mt-1">Ready to publish</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Published Posts
            </CardTitle>
            <FileTextIcon className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{publishedCount}</div>
            <p className="text-xs text-gray-500 mt-1">Total published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Engagement
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalEngagement.toLocaleString()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Likes, comments & shares
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading posts...
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No posts yet. Create your first post to get started!
            </div>
          ) : (
            <div className="space-y-3">
              {posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(post.status)}>
                        {post.status}
                      </Badge>
                      {post.scheduled_for && (
                        <span className="text-xs text-gray-500">
                          {format(
                            new Date(post.scheduled_for),
                            "MMM d, yyyy h:mm a",
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 ml-4">
                    <div className="text-center">
                      <div className="font-medium">{post.engagement_likes}</div>
                      <div className="text-xs">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">
                        {post.engagement_comments}
                      </div>
                      <div className="text-xs">Comments</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">
                        {post.engagement_shares}
                      </div>
                      <div className="text-xs">Shares</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
