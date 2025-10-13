import type { InvoiceNotesProps } from "@/components/providers/types";

export function InvoiceNotes({ notes }: InvoiceNotesProps) {
  return (
    <div className="mt-8 pt-8 border-t">
      <h3 className="text-sm font-semibold uppercase mb-3">Notes</h3>
      <p className="text-slate-700 whitespace-pre-line">{notes}</p>
    </div>
  );
}
