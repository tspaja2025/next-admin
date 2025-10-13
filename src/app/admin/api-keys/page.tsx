"use client";

import { CopyIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ApiKeysTable } from "@/components/api/ApiKeysTable";
import { useApiKeys } from "@/components/providers/hooks";
import { useAuth } from "@/components/providers/Provider";
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

export default function ApiKeysPage() {
  const { apiKeys, createKey, deleteKey } = useApiKeys();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const { loading } = useAuth();

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

  return (
    <div className="font-sans min-h-screen">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-2">
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
            <ApiKeysTable apiKeys={apiKeys} onDelete={deleteKey} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
