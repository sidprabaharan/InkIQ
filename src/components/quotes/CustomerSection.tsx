
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerDialog } from "./CustomerDialog";
import { useCustomers } from "@/context/CustomersContext";

interface CustomerSectionProps {
  initialCustomer?: any; // Using any since we don't have the exact type definition
}

export function CustomerSection({ initialCustomer }: CustomerSectionProps = {}) {
  const [openDialog, setOpenDialog] = useState(false);
  const { customers, selectedCustomer, selectCustomer } = useCustomers();
  
  // If initialCustomer is provided, use it to select a customer
  useEffect(() => {
    if (initialCustomer && customers.length > 0) {
      // Try to find a customer that matches the initialCustomer
      // This is a basic example, you might need more sophisticated matching
      const matchingCustomer = customers.find(
        customer => customer.companyName === initialCustomer.company
      );
      
      if (matchingCustomer) {
        selectCustomer(matchingCustomer.id);
      }
    }
  }, [initialCustomer, customers, selectCustomer]);

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
        value={selectedCustomer?.id || ""} 
        onValueChange={(value) => selectCustomer(value)}
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
