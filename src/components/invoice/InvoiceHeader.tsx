import { FileTextIcon } from "lucide-react";
import type { InvoiceHeaderProps } from "@/components/providers/types";
import { Badge } from "@/components/ui/badge";
import { CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { statusColors } from "@/lib/invoice-utils";

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
