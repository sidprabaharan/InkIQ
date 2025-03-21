
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomers } from "@/context/CustomersContext";

export function BillingSection() {
  const { selectedCustomer } = useCustomers();

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Customer Billing</h3>
      <div className="space-y-4">
        <Input 
          placeholder="Company" 
          value={selectedCustomer?.companyName || ""}
          readOnly={!!selectedCustomer}
        />
        <Input 
          placeholder="Name" 
          value={selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` : ""}
          readOnly={!!selectedCustomer}
        />
        <Input 
          placeholder="Address" 
          value={selectedCustomer?.billingAddress.address1 || ""}
          readOnly={!!selectedCustomer}
        />
        <Input 
          placeholder="Address" 
          value={selectedCustomer?.billingAddress.address2 || ""}
          readOnly={!!selectedCustomer}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select disabled={!!selectedCustomer} value={selectedCustomer?.billingAddress.country || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            placeholder="State/ Province" 
            value={selectedCustomer?.billingAddress.stateProvince || ""}
            readOnly={!!selectedCustomer}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input 
            placeholder="City" 
            value={selectedCustomer?.billingAddress.city || ""}
            readOnly={!!selectedCustomer}
          />
          <Input 
            placeholder="Zip Code Postal Code" 
            value={selectedCustomer?.billingAddress.zipCode || ""}
            readOnly={!!selectedCustomer}
          />
        </div>
      </div>
    </div>
  );
}
