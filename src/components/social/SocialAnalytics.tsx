"use client";

import {
  HeartIcon,
  MessageCircleIcon,
  Share2Icon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AnalyticsRecord, SocialAccount } from "@/lib/types";
import { useAuth } from "@/providers/UnifiedAuthProvider";

export function SocialAnalytics() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch accounts
  useEffect(() => {
    if (user) {
      const stored = JSON.parse(localStorage.getItem("demo_accounts") || "[]");
      const userAccounts = stored.filter((a: any) => a.user_id === user.id);
      setAccounts(userAccounts);
      if (userAccounts.length > 0) {
        setSelectedAccount(userAccounts[0].id);
      }
    }
  }, [user]);

  // Fetch or generate analytics for selected account
  useEffect(() => {
    if (selectedAccount) {
      fetchAnalytics(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchAnalytics = (accountId: string) => {
    setLoading(true);
    const stored = JSON.parse(localStorage.getItem("demo_analytics") || "[]");
    let data = stored.filter(
      (a: AnalyticsRecord) => a.social_account_id === accountId,
    );

    // If none exist yet, generate fake data
    if (data.length === 0) {
      data = generateFakeAnalytics(accountId);
      const all = [...stored, ...data];
      localStorage.setItem("demo_analytics", JSON.stringify(all));
    }

    setAnalytics(data);
    setLoading(false);
  };

  // Generate 30 days of random analytics data
  const generateFakeAnalytics = (accountId: string): AnalyticsRecord[] => {
    const today = new Date();
    let followers = 1000 + Math.floor(Math.random() * 1000);
    const records: AnalyticsRecord[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const total_likes = Math.floor(Math.random() * 100);
      const total_comments = Math.floor(Math.random() * 50);
      const total_shares = Math.floor(Math.random() * 30);
      const total_impressions =
        total_likes * 10 + total_comments * 20 + total_shares * 30;

      followers += Math.floor(Math.random() * 10) - 2; // small fluctuations

      records.push({
        id: crypto.randomUUID(),
        social_account_id: accountId,
        date: date.toISOString(),
        followers_count: followers,
        total_likes,
        total_comments,
        total_shares,
        total_impressions,
      });
    }

    return records;
  };

  const chartData = analytics.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    followers: item.followers_count,
    engagement: item.total_likes + item.total_comments + item.total_shares,
    likes: item.total_likes,
    comments: item.total_comments,
    shares: item.total_shares,
    impressions: item.total_impressions,
  }));

  const latestData = analytics[analytics.length - 1];
  const previousData = analytics[analytics.length - 2];

  const calculateChange = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const stats = [
    {
      title: "Total Followers",
      value: latestData?.followers_count || 0,
      change: previousData
        ? calculateChange(
            latestData?.followers_count || 0,
            previousData.followers_count,
          )
        : 0,
      icon: <TrendingUpIcon className="h-5 w-5" />,
    },
    {
      title: "Total Likes",
      value: analytics.reduce((sum, item) => sum + item.total_likes, 0),
      icon: <HeartIcon className="h-5 w-5" />,
    },
    {
      title: "Total Comments",
      value: analytics.reduce((sum, item) => sum + item.total_comments, 0),
      icon: <MessageCircleIcon className="h-5 w-5" />,
    },
    {
      title: "Total Shares",
      value: analytics.reduce((sum, item) => sum + item.total_shares, 0),
      icon: <Share2Icon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.platform} - @{account.account_username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">
          Loading analytics...
        </div>
      ) : analytics.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No analytics data available yet. (Fake data will be generated for
            demo accounts)
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className="text-gray-400">{stat.icon}</div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </div>
                  {stat.change !== undefined && (
                    <div className="flex items-center mt-2 text-sm">
                      {stat.change >= 0 ? (
                        <>
                          <TrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-green-600">
                            +{stat.change.toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <TrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                          <span className="text-red-600">
                            {stat.change.toFixed(1)}%
                          </span>
                        </>
                      )}
                      <span className="text-gray-500 ml-1">
                        from last period
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="followers"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="likes" fill="#ef4444" />
                    <Bar dataKey="comments" fill="#3b82f6" />
                    <Bar dataKey="shares" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Impressions Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="impressions"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
