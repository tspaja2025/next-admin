"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  InstagramIcon,
  YoutubeIcon,
  PlusIcon,
  Trash2Icon,
  CheckCircle2Icon,
} from "lucide-react";
import { useAuth } from "@/components/social/SocialAuthProvider";
import type { SocialAccount } from "@/lib/types";

const platformIcons: Record<string, React.ReactNode> = {
  Twitter: <TwitterIcon className="h-5 w-5" />,
  Facebook: <FacebookIcon className="h-5 w-5" />,
  LinkedIn: <LinkedinIcon className="h-5 w-5" />,
  Instagram: <InstagramIcon className="h-5 w-5" />,
  YouTube: <YoutubeIcon className="h-5 w-5" />,
};

export function SocialAccounts() {
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
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Social Accounts</h2>
          <p className="text-gray-500 mt-1">
            Manage your connected social media accounts
          </p>
        </div>
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
