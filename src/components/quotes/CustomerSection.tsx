
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomerDialog } from "./CustomerDialog";
import { useCustomers } from "@/context/CustomersContext";
import { useNavigate } from "react-router-dom";

interface CustomerSectionProps {
  leadData?: {
    leadId: string;
    customerName: string;
    company: string;
    email: string;
    phone?: string;
    address?: any;
    estimatedValue: number;
  } | null;
}

export function CustomerSection({ leadData }: CustomerSectionProps) {
  const [openDialog, setOpenDialog] = useState(false);
  const { customers, selectedCustomer, selectCustomer } = useCustomers();
  const navigate = useNavigate();

  const handleNavigateToContacts = () => {
    navigate("/contacts");
  };

  return (
    <div className="space-y-2">
      {/* Lead Data Banner */}
      {leadData && (
        <div className="bg-muted/50 p-3 rounded border border-dashed">
          <div className="text-sm font-medium text-muted-foreground mb-1">Lead Information</div>
          <div className="text-sm">
            <strong>{leadData.customerName}</strong> at <strong>{leadData.company}</strong>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {leadData.email} {leadData.phone && `• ${leadData.phone}`}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">
          {leadData ? 'Customer (from Lead)' : 'Customers'}
        </h3>
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
