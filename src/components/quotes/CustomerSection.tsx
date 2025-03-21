
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerDialog } from "./CustomerDialog";
import { useCustomers } from "@/context/CustomersContext";

export function CustomerSection() {
  const [openDialog, setOpenDialog] = useState(false);
  const { customers, selectedCustomer, selectCustomer } = useCustomers();

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
      <Select 
        value={selectedCustomer?.id} 
        onValueChange={selectCustomer}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select A Customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.companyName} ({customer.firstName} {customer.lastName})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CustomerDialog 
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </div>
  );
}
