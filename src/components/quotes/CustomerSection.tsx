
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerDialog } from "./CustomerDialog";
import { useCustomers } from "@/context/CustomersContext";
import { useNavigate } from "react-router-dom";

export function CustomerSection() {
  const [openDialog, setOpenDialog] = useState(false);
  const { customers, selectedCustomer, selectCustomer } = useCustomers();
  const navigate = useNavigate();

  const handleNavigateToContacts = () => {
    navigate("/contacts");
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">Customers</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNavigateToContacts}
          >
            View Contacts
          </Button>
          <Button 
            variant="outline" 
            className="text-blue-500"
            onClick={() => setOpenDialog(true)}
          >
            New Customer
          </Button>
        </div>
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
