"use client";

import { format } from "date-fns";
import {
  ArrowLeftIcon,
  DownloadIcon,
  EyeIcon,
  FileTextIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
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
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateInvoiceTotals,
  createInvoice,
  deleteInvoice,
  generateInvoiceNumber,
  getInvoices,
  statusColors,
  updateInvoice,
} from "@/lib/invoice-utils";
import type {
  FormItem,
  InvoiceClientInfoProps,
  InvoiceFormProps,
  InvoiceHeaderProps,
  InvoiceListProps,
  InvoiceNotesProps,
  InvoiceStatus,
  InvoiceTableProps,
  InvoiceTotalsProps,
  InvoiceViewProps,
  InvoiceWithItems,
  View,
} from "@/lib/types";

const formatCurrency = (num: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);

const safeFormatDate = (dateString: string, formatString: string): string => {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date:", dateString);
      return "Invalid Date";
    }
    return format(date, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

export default function InvoicePage() {
  const [view, setView] = useState<View>("list");
  const [selectedInvoice, setSelectedInvoice] = useState<
    InvoiceWithItems | undefined
  >();

  function handleCreateNew() {
    setSelectedInvoice(undefined);
    setView("form");
  }

  function handleEdit(invoice: InvoiceWithItems) {
    setSelectedInvoice(invoice);
    setView("form");
  }

  function handleView(invoice: InvoiceWithItems) {
    setSelectedInvoice(invoice);
    setView("view");
  }

  function handleSave() {
    setSelectedInvoice(undefined);
    setView("list");
  }

  function handleCancel() {
    setSelectedInvoice(undefined);
    setView("list");
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12  rounded-lg flex items-center justify-center">
                <FileTextIcon />
              </div>
              <div>
                <h1 className="text-3xl font-bold ">Invoice Manager</h1>
                <p className="text-muted-foreground">
                  Create and manage your invoices
                </p>
              </div>
            </div>
            {view === "list" && (
              <div className="flex items-center gap-2">
                <Button onClick={handleCreateNew}>
                  <PlusIcon />
                  New Invoice
                </Button>
              </div>
            )}
          </div>
        </header>

        <main>
          {view === "list" && (
            <InvoiceList
              onCreateNew={handleCreateNew}
              onEdit={handleEdit}
              onView={handleView}
            />
          )}
          {view === "form" && (
            <InvoiceForm
              invoice={selectedInvoice}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
          {view === "view" && selectedInvoice && (
            <InvoiceView
              invoice={selectedInvoice}
              onEdit={() => handleEdit(selectedInvoice)}
              onBack={handleCancel}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function InvoiceForm({ invoice, onSave, onCancel }: InvoiceFormProps) {
  const [loading, setLoading] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<InvoiceStatus>("draft");
  const [taxRate, setTaxRate] = useState("0");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<FormItem[]>([
    { description: "", quantity: 1, unit_price: 0, amount: 0 },
  ]);

  useEffect(() => {
    if (invoice) {
      setInvoiceNumber(invoice.invoice_number);
      setClientName(invoice.client_name);
      setClientEmail(invoice.client_email);
      setClientAddress(invoice.client_address);
      setInvoiceDate(invoice.invoice_date);
      setDueDate(invoice.due_date);
      setStatus(invoice.status);
      setTaxRate(invoice.tax_rate.toString());
      setNotes(invoice.notes);
      setItems(
        invoice.invoice_items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          amount: item.amount,
        })),
      );
    } else {
      setInvoiceNumber(generateInvoiceNumber());
      const today = new Date();
      const due = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

      // Format dates as YYYY-MM-DD for input[type="date"]
      setInvoiceDate(today.toISOString().split("T")[0]);
      setDueDate(due.toISOString().split("T")[0]);
    }
  }, [invoice]);

  function handleItemChange(
    index: number,
    field: keyof FormItem,
    value: string | number,
  ) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "unit_price") {
      const qty =
        field === "quantity" ? Number(value) : newItems[index].quantity;
      const price =
        field === "unit_price" ? Number(value) : newItems[index].unit_price;
      newItems[index].amount = Number((qty * price).toFixed(2));
    }

    setItems(newItems);
  }

  function addItem() {
    setItems([
      ...items,
      { description: "", quantity: 1, unit_price: 0, amount: 0 },
    ]);
  }

  function removeItem(index: number) {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const totals = calculateInvoiceTotals(items, Number(taxRate));

      const invoiceData = {
        invoice_number: invoiceNumber,
        client_name: clientName,
        client_email: clientEmail,
        client_address: clientAddress,
        invoice_date: invoiceDate,
        due_date: dueDate,
        status,
        subtotal: totals.subtotal,
        tax_rate: Number(taxRate),
        tax_amount: totals.taxAmount,
        total: totals.total,
        notes,
      };

      if (invoice) {
        await updateInvoice(invoice.id, invoiceData, items);
      } else {
        await createInvoice(invoiceData, items);
      }

      onSave();
    } catch (error) {
      console.error("Error saving invoice:", error);
    } finally {
      setLoading(false);
    }
  }

  const totals = calculateInvoiceTotals(items, Number(taxRate));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <ArrowLeftIcon />
          Back
        </Button>
        <Button type="submit" disabled={loading}>
          <SaveIcon />
          {loading ? "Saving..." : "Save Invoice"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(val: InvoiceStatus) => setStatus(val)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="clientEmail">Client Email</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea
              id="clientAddress"
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button type="button" variant="outline" onClick={addItem}>
              <PlusIcon />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 rounded-lg"
            >
              <div className="md:col-span-5">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  placeholder="Service or product description"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.unit_price}
                  onChange={(e) =>
                    handleItemChange(index, "unit_price", e.target.value)
                  }
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label>Amount</Label>
                <Input value={`$${item.amount.toFixed(2)}`} disabled />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                >
                  <Trash2Icon className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Tax Rate:</span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-20 h-8"
                />
                <span className="text-slate-600">%</span>
              </div>
              <span className="font-medium">
                ${totals.taxAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t">
              <span>Total:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Payment terms, additional information, etc."
          />
        </CardContent>
      </Card>
    </form>
  );
}

function InvoiceList({ onCreateNew, onEdit, onView }: InvoiceListProps) {
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
      const safeData = data.map((invoice) => ({
        ...invoice,
        invoice_items: invoice.invoice_items || [],
      }));
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
                      {safeFormatDate(invoice.invoice_date, "MMM dd, yyyy")}
                    </div>
                    <div>
                      <span className="text-slate-500">Due: </span>
                      {safeFormatDate(invoice.due_date, "MMM dd, yyyy")}
                    </div>
                    <div>
                      <span className="text-slate-500">Items: </span>
                      {(invoice.invoice_items || []).length}
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

function InvoiceView({ invoice, onEdit, onBack }: InvoiceViewProps) {
  const handlePrint = () => window.print();

  return (
    <div className="space-y-6">
      {/* Header actions (hidden when printing) */}
      <div className="flex items-center justify-between print:hidden">
        {onBack && (
          <Button variant="ghost" onClick={onBack} aria-label="Go back">
            <ArrowLeftIcon />
            Back
          </Button>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            aria-label="Print invoice"
          >
            <DownloadIcon />
            Print / PDF
          </Button>
          {onEdit && (
            <Button onClick={onEdit} aria-label="Edit invoice">
              <PencilIcon />
              Edit
            </Button>
          )}
        </div>
      </div>

      <Card className="print:shadow-none print:border-0">
        <CardContent>
          <InvoiceHeader invoice={invoice} />
          <InvoiceClientInfo invoice={invoice} />
          <InvoiceTable items={invoice.invoice_items} />
          <InvoiceTotals invoice={invoice} />
          {invoice.notes && <InvoiceNotes notes={invoice.notes} />}

          <div className="mt-12 pt-8 border-t text-center text-sm text-slate-600">
            <p>Thank you for your business!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex gap-2 items-center">
        <FileTextIcon />
        INVOICE
      </CardTitle>
      <CardAction>
        <Badge className={`${statusColors[invoice.status]}`}>
          {invoice.status.toUpperCase()}
        </Badge>
      </CardAction>
    </CardHeader>
  );
}

function InvoiceClientInfo({ invoice }: InvoiceClientInfoProps) {
  const { client_name, client_email, client_address, invoice_date, due_date } =
    invoice;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-3">
          Bill To
        </h3>
        <address className="not-italic text-slate-700">
          <p className="font-semibold text-lg mb-1">{client_name}</p>
          <p className="text-slate-600 mb-1">{client_email}</p>
          {client_address ? (
            <p className="text-slate-600 whitespace-pre-line">
              {client_address}
            </p>
          ) : (
            <p className="text-slate-500 italic">No address provided</p>
          )}
        </address>
      </div>
      <div className="md:text-right">
        <div className="mb-4">
          <p className="text-sm text-slate-500 mb-1">Invoice Date</p>
          <p className="font-semibold">
            {safeFormatDate(invoice_date, "MMMM dd, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500 mb-1">Due Date</p>
          <p className="font-semibold">
            {safeFormatDate(due_date, "MMMM dd, yyyy")}
          </p>
        </div>
      </div>
      <Separator className="col-span-2 my-8" />
    </div>
  );
}

function InvoiceTable({ items }: InvoiceTableProps) {
  return (
    <div className="mb-8">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items && items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                <TableCell>{formatCurrency(item.amount)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-slate-500 italic"
              >
                No items added
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function InvoiceTotals({ invoice }: InvoiceTotalsProps) {
  const { subtotal, tax_rate, tax_amount, total } = invoice;

  return (
    <div className="flex justify-end mb-8">
      <div className="w-full md:w-80 space-y-3">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({tax_rate}%):</span>
          <span className="font-medium">{formatCurrency(tax_amount)}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

function InvoiceNotes({ notes }: InvoiceNotesProps) {
  return (
    <div className="mt-8 pt-8 border-t">
      <h3 className="text-sm font-semibold uppercase mb-3">Notes</h3>
      <p className="text-slate-700 whitespace-pre-line">{notes}</p>
    </div>
  );
}
