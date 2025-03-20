
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ShippingSection() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Customer Shipping Address</h3>
      <div className="space-y-4">
        <Input placeholder="Company" />
        <Input placeholder="Name" />
        <Input placeholder="Address" />
        <Input placeholder="Address" />
        <div className="grid grid-cols-2 gap-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="State/ Province" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="City" />
          <Input placeholder="Zip Code Postal Code" />
        </div>
      </div>
    </div>
  );
}
