
import React from "react";
import { Input } from "@/components/ui/input";

export function InvoiceSummarySection() {
  return (
    <div className="space-y-4">
      <div className="bg-blue-100 p-4 rounded-md">
        <h3 className="text-base font-medium text-center">Invoice Summary</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Sub Total</span>
          <span className="text-sm">$0.00</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Discount</span>
          <div className="flex items-center">
            <Input className="w-16 h-8 text-xs" placeholder="%" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm">Sales Tax</span>
          <div className="flex items-center">
            <Input className="w-16 h-8 text-xs" placeholder="%" />
          </div>
        </div>
        <div className="flex justify-between items-center font-medium">
          <span>Total Due</span>
          <span>$0.00</span>
        </div>
      </div>
    </div>
  );
}
