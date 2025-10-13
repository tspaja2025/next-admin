"use client";

import { ArrowLeftIcon, DownloadIcon, PencilIcon } from "lucide-react";
import { InvoiceClientInfo } from "@/components/invoice/InvoiceClientInfo";
import { InvoiceHeader } from "@/components/invoice/InvoiceHeader";
import { InvoiceNotes } from "@/components/invoice/InvoiceNotes";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { InvoiceTotals } from "@/components/invoice/InvoiceTotals";
import type { InvoiceViewProps } from "@/components/providers/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function InvoiceView({ invoice, onEdit, onBack }: InvoiceViewProps) {
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
