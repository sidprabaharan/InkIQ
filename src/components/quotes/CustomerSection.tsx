
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerDialog } from "./CustomerDialog";

export function CustomerSection() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">Customers</h3>
        <Button 
          variant="outline" 
          className="text-blue-500"
          onClick={() => setOpenDialog(true)}
        >
          New Customer
        </Button>
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

      <CustomerDialog 
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </div>
  );
}
