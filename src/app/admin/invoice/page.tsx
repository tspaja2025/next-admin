"use client";

import { FileTextIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import type { InvoiceWithItems, View } from "@/lib/types";
import { InvoiceList } from "@/components/invoice/InvoiceList";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoiceView } from "@/components/invoice/InvoiceView";

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
    <div className="font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <DarkModeToggle />
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
