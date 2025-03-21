
import React, { useState, useEffect } from "react";
import { InvoiceSummary } from "./QuoteData";

interface InvoiceSummarySectionProps {
  initialSummary?: InvoiceSummary;
}

export function InvoiceSummarySection({ initialSummary }: InvoiceSummarySectionProps) {
  const [summary, setSummary] = useState<InvoiceSummary | undefined>(initialSummary);

  useEffect(() => {
    if (initialSummary) {
      setSummary(initialSummary);
    }
  }, [initialSummary]);

  return (
    <div className="bg-white p-4 rounded-md border">
      <h3 className="text-base font-medium mb-4">Invoice Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Item Total:</span>
          <span className="text-sm font-medium">{summary?.itemTotal || "$0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Fees Total:</span>
          <span className="text-sm font-medium">{summary?.feesTotal || "$0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Sub Total:</span>
          <span className="text-sm font-medium">{summary?.subTotal || "$0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Discount:</span>
          <span className="text-sm font-medium">{summary?.discount || "$0.00"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Sales Tax:</span>
          <span className="text-sm font-medium">{summary?.salesTax || "$0.00"}</span>
        </div>
        <div className="h-px bg-gray-200 my-2"></div>
        <div className="flex justify-between">
          <span className="text-base font-medium">Total Due:</span>
          <span className="text-base font-bold">{summary?.totalDue || "$0.00"}</span>
        </div>
      </div>
    </div>
  );
}
