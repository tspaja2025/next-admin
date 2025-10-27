"use client";

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
} from "date-fns";
import {
  BarChart3Icon,
  CalendarIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FacebookIcon,
  FileTextIcon,
  HeartIcon,
  InstagramIcon,
  LayoutDashboardIcon,
  LinkedinIcon,
  Loader2Icon,
  MessageCircleIcon,
  PenSquareIcon,
  PlusIcon,
  SettingsIcon,
  Share2Icon,
  Trash2Icon,
  TrendingDownIcon,
  TrendingUpIcon,
  TwitterIcon,
  UsersIcon,
  YoutubeIcon,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getStatusColor } from "@/lib/social-utils";
import type {
  AnalyticsRecord,
  DashboardSidebarProps,
  NavItem,
  Post,
  SocialAccount,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/UnifiedAuthProvider";

const platformIcons: Record<string, React.ReactNode> = {
  Twitter: <TwitterIcon className="h-5 w-5" />,
  Facebook: <FacebookIcon className="h-5 w-5" />,
  LinkedIn: <LinkedinIcon className="h-5 w-5" />,
  Instagram: <InstagramIcon className="h-5 w-5" />,
  YouTube: <YoutubeIcon className="h-5 w-5" />,
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

export default function SocialMediaPage() {
  const [activeView, setActiveView] = useState("dashboard");

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

function SocialAccounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountUsername, setAccountUsername] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  const fetchAccounts = () => {
    const storedAccounts = JSON.parse(
      localStorage.getItem("demo_accounts") || "[]",
    );
    const userAccounts = storedAccounts.filter(
      (acc: SocialAccount) => acc.user_id === user?.id,
    );
    setAccounts(userAccounts);
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const storedAccounts = JSON.parse(
        localStorage.getItem("demo_accounts") || "[]",
      );

      const newAccount: SocialAccount = {
        id: crypto.randomUUID(),
        user_id: user!.id,
        platform,
        account_name: accountName,
        account_username: accountUsername,
        avatar_url: null,
        is_active: true,
        connected_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      storedAccounts.push(newAccount);
      localStorage.setItem("demo_accounts", JSON.stringify(storedAccounts));

      setSuccess(true);
      setPlatform("");
      setAccountName("");
      setAccountUsername("");
      fetchAccounts();

      setTimeout(() => setOpen(false), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to add account");
    }
  };

  const handleDeleteAccount = (id: string) => {
    if (!confirm("Are you sure you want to remove this account?")) return;

    const storedAccounts = JSON.parse(
      localStorage.getItem("demo_accounts") || "[]",
    );
    const updated = storedAccounts.filter(
      (acc: SocialAccount) => acc.id !== id,
    );
    localStorage.setItem("demo_accounts", JSON.stringify(updated));
    fetchAccounts();
  };

  const toggleAccountStatus = (id: string, currentStatus: boolean) => {
    const storedAccounts = JSON.parse(
      localStorage.getItem("demo_accounts") || "[]",
    );
    const updated = storedAccounts.map((acc: SocialAccount) =>
      acc.id === id ? { ...acc, is_active: !currentStatus } : acc,
    );
    localStorage.setItem("demo_accounts", JSON.stringify(updated));
    fetchAccounts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Social Account</DialogTitle>
              <DialogDescription>
                Add a new social media account to manage from your dashboard
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddAccount}>
              <div className="space-y-4 py-4">
                {success && (
                  <Alert className="bg-green-50 text-green-900 border-green-200">
                    <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Account added successfully!
                    </AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Name</Label>
                  <Input
                    id="accountName"
                    placeholder="e.g., My Business Page"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accountUsername">Username</Label>
                  <Input
                    id="accountUsername"
                    placeholder="e.g., @mybusiness"
                    value={accountUsername}
                    onChange={(e) => setAccountUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Account</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {accounts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-500 mb-4">
              No social accounts connected yet
            </div>
            <Button onClick={() => setOpen(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Your First Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <Card key={account.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white">
                      {platformIcons[account.platform] || (
                        <TwitterIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {account.account_name}
                      </CardTitle>
                      <CardDescription>
                        @{account.account_username}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant={account.is_active ? "default" : "secondary"}>
                    {account.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <div className="font-medium">{account.platform}</div>
                    <div className="text-xs text-gray-500">
                      Connected{" "}
                      {new Date(account.connected_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toggleAccountStatus(account.id, account.is_active)
                      }
                    >
                      {account.is_active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAccount(account.id)}
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function SocialAnalytics() {
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

function SocialCalendarView() {
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
      <div className="flex items-center justify-center">
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
                className="text-center font-semibold text-sm  py-2"
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
                    "min-h-[120px] border rounded-lg p-2 ",
                    isToday && "border-blue-500 border-2",
                  )}
                >
                  <div
                    className={cn(
                      "text-sm font-medium mb-2",
                      isToday ? "text-blue-600" : "",
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

function SocialCreatePost() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [status, setStatus] = useState<"draft" | "scheduled">("draft");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load connected accounts from localStorage
  const fetchAccounts = () => {
    const storedAccounts = JSON.parse(
      localStorage.getItem("demo_accounts") || "[]",
    );
    const userAccounts = storedAccounts.filter(
      (acc: SocialAccount) => acc.user_id === user?.id,
    );
    setAccounts(userAccounts);
  };

  useEffect(() => {
    if (user) {
      fetchAccounts();
    }
  }, [user]);

  // ✅ Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      let scheduledFor = null;
      if (status === "scheduled" && date && time) {
        const [hours, minutes] = time.split(":");
        const scheduledDate = new Date(date);
        scheduledDate.setHours(parseInt(hours), parseInt(minutes));
        scheduledFor = scheduledDate.toISOString();
      }

      const newPost: Post = {
        id: crypto.randomUUID(),
        user_id: user!.id,
        social_account_id: selectedAccount,
        content,
        media_urls: [""],
        status,
        scheduled_for: scheduledFor,
        published_at: "",
        engagement_likes: 0,
        engagement_comments: 0,
        engagement_shares: 0,
        engagement_impressions: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save post to localStorage
      const storedPosts = JSON.parse(
        localStorage.getItem("demo_posts") || "[]",
      );
      storedPosts.push(newPost);
      localStorage.setItem("demo_posts", JSON.stringify(storedPosts));

      // Reset state
      setSuccess(true);
      setContent("");
      setDate(undefined);
      setTime("12:00");
      setStatus("draft");
      setSelectedAccount("");
    } catch (err: any) {
      console.error("Error creating post:", err);
      setError("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Post Content</CardTitle>
              <CardDescription>
                Write your message and schedule it for publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {success && (
                  <Alert className="bg-green-50 text-green-900 border-green-200">
                    <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                    <AlertDescription>
                      Post created successfully!
                    </AlertDescription>
                  </Alert>
                )}
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="account">Social Account</Label>
                  <Select
                    value={selectedAccount}
                    onValueChange={setSelectedAccount}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an account" />
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

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    {content.length} characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Post Status</Label>
                  <Select
                    value={status}
                    onValueChange={(value: "draft" | "scheduled") =>
                      setStatus(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Save as Draft</SelectItem>
                      <SelectItem value="scheduled">
                        Schedule for Later
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {status === "scheduled" && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <Label>Schedule Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Schedule Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !selectedAccount}
                >
                  {loading ? (
                    <>
                      <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>{status === "draft" ? "Save Draft" : "Schedule Post"}</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500" />
                    <div>
                      <p className="font-medium text-sm">
                        {accounts.find((a) => a.id === selectedAccount)
                          ?.account_name || "Your Account"}
                      </p>
                      <p className="text-xs text-gray-500">
                        @
                        {accounts.find((a) => a.id === selectedAccount)
                          ?.account_username || "username"}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                    {content || "Your post content will appear here..."}
                  </p>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    Platform:{" "}
                    {accounts.find((a) => a.id === selectedAccount)?.platform ||
                      "Not selected"}
                  </p>
                  {status === "scheduled" && date && (
                    <p>
                      Scheduled: {format(date, "PPP")} at {time}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SocialDashboardOverview() {
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

function SocialDashboardSidebar({
  activeView,
  onViewChange,
}: DashboardSidebarProps) {
  return (
    <aside className="w-64 border-r  min-h-[calc(100vh-96px)]">
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
