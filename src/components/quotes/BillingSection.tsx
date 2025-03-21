
import React, { useState, useEffect } from "react";
import { useCustomers } from "@/context/CustomersContext";
import { BillingField } from "./BillingField";
import { BillingAddressFields } from "./BillingAddressFields";

interface BillingSectionProps {
  initialBillingInfo?: any; // Using any since we don't have the exact type definition
}

export function BillingSection({ initialBillingInfo }: BillingSectionProps = {}) {
  const { selectedCustomer, updateCustomer } = useCustomers();
  const [billingInfo, setBillingInfo] = useState(initialBillingInfo || {});

  // Update state when initialBillingInfo changes
  useEffect(() => {
    if (initialBillingInfo) {
      setBillingInfo(initialBillingInfo);
    }
  }, [initialBillingInfo]);

  const handleCountryChange = (value: string) => {
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, {
        billingAddress: {
          ...selectedCustomer.billingAddress,
          country: value
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Customer Billing</h3>
      <div className="space-y-4">
        <BillingField 
          placeholder="Company" 
          value={selectedCustomer?.companyName || billingInfo?.company || ""}
          readOnly={!!selectedCustomer}
        />
        <BillingField 
          placeholder="Name" 
          value={selectedCustomer 
            ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` 
            : billingInfo?.name || ""}
          readOnly={!!selectedCustomer}
        />
        <BillingAddressFields 
          selectedCustomer={selectedCustomer}
          billingInfo={billingInfo}
          handleCountryChange={handleCountryChange}
        />
      </div>
    </div>
  );
}
