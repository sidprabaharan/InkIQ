
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function QuotationDetailsSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Quotation Details</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner1">Owner 1</SelectItem>
              <SelectItem value="owner2">Owner 2</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Delivery Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="method1">Method 1</SelectItem>
              <SelectItem value="method2">Method 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input placeholder="PO Number" />
        <Input placeholder="Created" />
        <Input placeholder="Production Due Date" />
        <Input placeholder="Customer Due Date" />
        <Input placeholder="Payment Due Date" />
        <Input placeholder="Invoice Date" />
      </div>
    </div>
  );
}
