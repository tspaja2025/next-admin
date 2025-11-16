// import type { Invoice, InvoiceItem, InvoiceWithItems } from "@/lib/types";


// export const statusColors = {
//   draft: "bg-slate-100 text-slate-700 hover:bg-slate-100",
//   sent: "bg-blue-100 text-blue-700 hover:bg-blue-100",
//   paid: "bg-green-100 text-green-700 hover:bg-green-100",
//   overdue: "bg-red-100 text-red-700 hover:bg-red-100",
// };

// const INVOICES_STORAGE_KEY = "invoices";

// export async function getInvoices(): Promise<InvoiceWithItems[]> {
//   try {
//     const invoicesJson = localStorage.getItem(INVOICES_STORAGE_KEY);
//     return invoicesJson ? JSON.parse(invoicesJson) : [];
//   } catch (error) {
//     console.error("Error loading invoices from localStorage:", error);
//     return [];
//   }
// }

// export async function getInvoice(id: string): Promise<InvoiceWithItems | null> {
//   try {
//     const invoices = await getInvoices();
//     return invoices.find((inv) => inv.id === id) || null;
//   } catch (error) {
//     console.error("Error loading invoice from localStorage:", error);
//     return null;
//   }
// }

// export async function createInvoice(
//   invoice: Omit<Invoice, "id" | "created_at" | "updated_at">,
//   items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[],
// ): Promise<InvoiceWithItems> {
//   const invoices = await getInvoices();
//   const invoiceId = generateId();

//   const newInvoice: InvoiceWithItems = {
//     ...invoice,
//     id: invoiceId,
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//     invoice_items: items.map((item) => ({
//       ...item,
//       id: generateId(),
//       invoice_id: invoiceId,
//       created_at: new Date().toISOString(),
//     })),
//   };

//   const updatedInvoices = [newInvoice, ...invoices];
//   localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updatedInvoices));

//   return newInvoice;
// }

// export async function updateInvoice(
//   id: string,
//   invoice: Partial<Invoice>,
//   items?: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[],
// ): Promise<InvoiceWithItems> {
//   const invoices = await getInvoices();
//   const invoiceIndex = invoices.findIndex((inv) => inv.id === id);

//   if (invoiceIndex === -1) {
//     throw new Error("Invoice not found");
//   }

//   const updatedInvoice: InvoiceWithItems = {
//     ...invoices[invoiceIndex],
//     ...invoice,
//     updated_at: new Date().toISOString(),
//   };

//   if (items) {
//     updatedInvoice.invoice_items = items.map((item) => ({
//       ...item,
//       id: generateId(),
//       invoice_id: id,
//       created_at: new Date().toISOString(),
//     }));
//   }

//   invoices[invoiceIndex] = updatedInvoice;
//   localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(invoices));

//   return updatedInvoice;
// }

// export async function deleteInvoice(id: string): Promise<void> {
//   const invoices = await getInvoices();
//   const updatedInvoices = invoices.filter((inv) => inv.id !== id);
//   localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(updatedInvoices));
// }

// function generateId(): string {
//   return Date.now().toString(36) + Math.random().toString(36).substr(2);
// }

// export function generateInvoiceNumber(): string {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const random = Math.floor(Math.random() * 10000)
//     .toString()
//     .padStart(4, "0");
//   return `INV-${year}${month}-${random}`;
// }

// export function calculateInvoiceTotals(
//   items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[],
//   taxRate: number,
// ) {
//   const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
//   const taxAmount = (subtotal * taxRate) / 100;
//   const total = subtotal + taxAmount;

//   return {
//     subtotal: Number(subtotal.toFixed(2)),
//     taxAmount: Number(taxAmount.toFixed(2)),
//     total: Number(total.toFixed(2)),
//   };
// }
import type { Invoice, InvoiceItem, InvoiceWithItems } from "@/lib/types";

const STORAGE_KEY = "invoices";

// ----------------------------------------------------------
// Status colors
// ----------------------------------------------------------
export const statusColors = {
  draft: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  sent: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  paid: "bg-green-100 text-green-700 hover:bg-green-100",
  overdue: "bg-red-100 text-red-700 hover:bg-red-100",
} as const;

// ----------------------------------------------------------
// Local Storage Helpers
// ----------------------------------------------------------
function loadInvoices(): InvoiceWithItems[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load invoices:", err);
    return [];
  }
}

function saveInvoices(invoices: InvoiceWithItems[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  } catch (err) {
    console.error("Failed to save invoices:", err);
  }
}

// ----------------------------------------------------------
// Public Getters
// ----------------------------------------------------------
export function getInvoices(): Promise<InvoiceWithItems[]> {
  return Promise.resolve(loadInvoices());
}

export async function getInvoice(id: string): Promise<InvoiceWithItems | null> {
  const invoices = loadInvoices();
  return invoices.find((i) => i.id === id) ?? null;
}

// ----------------------------------------------------------
// Create Invoice
// ----------------------------------------------------------
export async function createInvoice(
  invoice: Omit<Invoice, "id" | "created_at" | "updated_at">,
  items: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[]
): Promise<InvoiceWithItems> {
  const invoices = loadInvoices();
  const id = generateId();
  const now = new Date().toISOString();

  const newInvoice: InvoiceWithItems = {
    ...invoice,
    id,
    created_at: now,
    updated_at: now,
    invoice_items: items.map((item) => ({
      ...item,
      id: generateId(),
      invoice_id: id,
      created_at: now,
    })),
  };

  saveInvoices([newInvoice, ...invoices]);
  return newInvoice;
}

// ----------------------------------------------------------
// Update Invoice
// ----------------------------------------------------------
export async function updateInvoice(
  id: string,
  invoiceUpdates: Partial<Invoice>,
  items?: Omit<InvoiceItem, "id" | "invoice_id" | "created_at">[]
): Promise<InvoiceWithItems> {
  const invoices = loadInvoices();
  const index = invoices.findIndex((i) => i.id === id);

  if (index === -1) throw new Error("Invoice not found");

  const now = new Date().toISOString();

  const updatedInvoice: InvoiceWithItems = {
    ...invoices[index],
    ...invoiceUpdates,
    updated_at: now,
    invoice_items: items
      ? items.map((item) => ({
          ...item,
          id: generateId(),
          invoice_id: id,
          created_at: now,
        }))
      : invoices[index].invoice_items,
  };

  invoices[index] = updatedInvoice;
  saveInvoices(invoices);
  return updatedInvoice;
}

// ----------------------------------------------------------
// Delete Invoice
// ----------------------------------------------------------
export async function deleteInvoice(id: string): Promise<void> {
  const invoices = loadInvoices().filter((inv) => inv.id !== id);
  saveInvoices(invoices);
}

// ----------------------------------------------------------
// Helpers
// ----------------------------------------------------------
export function generateId(): string {
  return crypto.randomUUID?.() ??
    Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `INV-${year}${month}-${random}`;
}

// ----------------------------------------------------------
// Totals Calculator
// ----------------------------------------------------------
export function calculateInvoiceTotals(
  items: { amount: number }[],
  taxRate: number
) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  return {
    subtotal: round(subtotal),
    taxAmount: round(taxAmount),
    total: round(total),
  };
}

function round(num: number): number {
  return Number(num.toFixed(2));
}
