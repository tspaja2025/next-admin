"use client";

import { CopyIcon, KeyIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ApiKeysTable } from "@/components/api/ApiKeysTable";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApiKeys } from "@/hooks/use-api-keys";

export default function ApiKeysPage() {
  const { apiKeys, loading, createKey, deleteKey } = useApiKeys();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  function handleCreate() {
    const key = createKey(newKeyName);
    if (key) {
      setGeneratedKey(key);
      setNewKeyName("");
      toast.success("API key created successfully");
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  return (
    <div className="font-sans min-h-screen">
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-slate-900 rounded-lg p-2">
                <KeyIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">API Keys</h1>
            </div>
            <p className="text-slate-600">
              Manage your application API keys securely
            </p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <PlusIcon className="h-4 w-4" /> Create New Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              {!generatedKey ? (
                <>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Key Name</Label>
                      <Input
                        id="name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create Key</Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>API Key Created</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={generatedKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(generatedKey)}
                      >
                        <CopyIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-amber-900 font-medium bg-amber-50 p-2 rounded">
                      Important: Copy this key now. You won’t be able to see it
                      again.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button
                      className="w-full"
                      onClick={() => {
                        setGeneratedKey(null);
                        setDialogOpen(false);
                      }}
                    >
                      Done
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your API Keys</CardTitle>
            <CardDescription>Manage and monitor your API keys.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-slate-500">Loading...</div>
            ) : (
              <ApiKeysTable apiKeys={apiKeys} onDelete={deleteKey} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
