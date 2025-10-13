import type { InvoiceTotalsProps } from "@/components/providers/types";
import { Separator } from "@/components/ui/separator";

const formatCurrency = (num: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);

export function InvoiceTotals({ invoice }: InvoiceTotalsProps) {
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
