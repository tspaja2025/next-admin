"use client";

import { format } from "date-fns";
import { ArrowLeftIcon, PlusIcon, SaveIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateInvoiceTotals,
  createInvoice,
  generateInvoiceNumber,
  updateInvoice,
} from "@/lib/invoice-utils";
import type { FormItem, InvoiceFormProps, InvoiceStatus } from "@/lib/types";

export function InvoiceForm({ invoice, onSave, onCancel }: InvoiceFormProps) {
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
      const today = format(new Date(), "yyyy-MM-dd");
      const due = format(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd",
      );
      setInvoiceDate(today);
      setDueDate(due);
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
