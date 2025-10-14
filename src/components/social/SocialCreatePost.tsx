"use client";

import { format } from "date-fns";
import { CalendarIcon, CheckCircle2Icon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import type { Post, SocialAccount } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/UnifiedAuthProvider";

export function SocialCreatePost() {
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
