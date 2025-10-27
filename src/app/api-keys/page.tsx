"use client";

import { format } from "date-fns";
import { CopyIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiKeys } from "@/hooks/use-api-keys";
import { maskApiKey } from "@/lib/api-keys";
import type { ApiKeysTableProps } from "@/lib/types";

export default function ApiKeysPage() {
  const { apiKeys, createKey, deleteKey } = useApiKeys();
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
    <div>
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon /> Create New Key
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

function ApiKeysTable({ apiKeys, onDelete }: ApiKeysTableProps) {
  if (apiKeys.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-2">No API keys yet</p>
        <p className="text-sm text-slate-500">
          Create your first API key to get started
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {apiKeys.map((key) => (
          <TableRow key={key.id}>
            <TableCell>{key.name}</TableCell>
            <TableCell>
              <code className="text-sm font-mono px-2 py-1 rounded">
                {maskApiKey(key.key_prefix)}
              </code>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {format(new Date(key.created_at), "MMM d, yyyy")}
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {key.last_used_at
                ? format(new Date(key.last_used_at), "MMM d, yyyy")
                : "Never"}
            </TableCell>
            <TableCell>
              <Badge variant={key.is_active ? "default" : "secondary"}>
                {key.is_active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(key.id)}
              >
                <Trash2Icon className="h-4 w-4 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
