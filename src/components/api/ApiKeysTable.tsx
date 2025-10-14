"use client";

import { format } from "date-fns";
import { Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { maskApiKey } from "@/lib/api-keys";
import type { ApiKeysTableProps } from "@/lib/types";

export function ApiKeysTable({ apiKeys, onDelete }: ApiKeysTableProps) {
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
    <div className="border rounded-lg overflow-x-auto">
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
                <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                  {maskApiKey(key.key_prefix)}
                </code>
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                {format(new Date(key.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-sm text-slate-600">
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
    </div>
  );
}
