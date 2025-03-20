
import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CustomerSection() {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">Customers</h3>
        <Button variant="outline" className="text-blue-500 border-blue-500">New Customer</Button>
      </div>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select A Customer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="customer1">Customer 1</SelectItem>
          <SelectItem value="customer2">Customer 2</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
