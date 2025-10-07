import { FileTextIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { statusColors } from "@/lib/invoice-utils";
import type { InvoiceHeaderProps } from "@/lib/types";

export function InvoiceHeader({ invoice }: InvoiceHeaderProps) {
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
