"use client";

import { format } from "date-fns";
import {
  EyeIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteInvoice, getInvoices, statusColors } from "@/lib/invoice-utils";
import type { InvoiceListProps, InvoiceWithItems } from "@/lib/types";

export function InvoiceList({ onCreateNew, onEdit, onView }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<InvoiceWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  async function loadInvoices() {
    try {
      setLoading(true);
      const data = await getInvoices();
      setInvoices(data);
    } catch (error) {
      console.error("Error loading invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteInvoice(id);
      setInvoices(invoices.filter((inv) => inv.id !== id));
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
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

  if (invoices.length === 0) {
    return (
      <div className="text-center py-12">
        <FileTextIcon className="h-16 w-16  mx-auto mb-4" />
        <h3 className="text-lg font-medium  mb-2">No invoices yet</h3>
        <p className="text-slate-500 mb-6">
          Get started by creating your first invoice
        </p>
        <Button onClick={onCreateNew} size="lg">
          <PlusIcon />
          Create Invoice
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold  ">
                      {invoice.invoice_number}
                    </h3>
                    <Badge className={statusColors[invoice.status]}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <p className=" font-medium mb-1">{invoice.client_name}</p>
                  <p className="text-sm text-slate-500 mb-3">
                    {invoice.client_email}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <div>
                      <span className="text-slate-500">Date: </span>
                      {format(new Date(invoice.invoice_date), "MMM dd, yyyy")}
                    </div>
                    <div>
                      <span className="text-slate-500">Due: </span>
                      {format(new Date(invoice.due_date), "MMM dd, yyyy")}
                    </div>
                    <div>
                      <span className="text-slate-500">Items: </span>
                      {invoice.invoice_items.length}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 ml-6">
                  <div className="text-right">
                    <div className="text-2xl font-bold ">
                      ${invoice.total.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(invoice)}
                    >
                      <EyeIcon />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(invoice)}
                    >
                      <PencilIcon />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(invoice.id)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
