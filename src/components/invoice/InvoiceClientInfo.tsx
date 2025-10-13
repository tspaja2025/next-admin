import { format } from "date-fns";
import type { Invoice } from "@/components/providers/types";
import { Separator } from "@/components/ui/separator";

interface Props {
  invoice: Invoice;
}

export function InvoiceClientInfo({ invoice }: Props) {
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
            {format(new Date(invoice_date), "MMMM dd, yyyy")}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500 mb-1">Due Date</p>
          <p className="font-semibold">
            {format(new Date(due_date), "MMMM dd, yyyy")}
          </p>
        </div>
      </div>
      <Separator className="col-span-2 my-8" />
    </div>
  );
}
