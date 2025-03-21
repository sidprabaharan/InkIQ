
import React, { useState, useEffect } from "react";
import { useCustomers } from "@/context/CustomersContext";
import { ShippingField } from "./ShippingField";
import { ShippingAddressFields } from "./ShippingAddressFields";

interface ShippingSectionProps {
  initialShippingInfo?: any; // Using any since we don't have the exact type definition
}

export function ShippingSection({ initialShippingInfo }: ShippingSectionProps = {}) {
  const { selectedCustomer, updateCustomer } = useCustomers();
  const [shippingInfo, setShippingInfo] = useState(initialShippingInfo || {});

  // Update state when initialShippingInfo changes
  useEffect(() => {
    if (initialShippingInfo) {
      setShippingInfo(initialShippingInfo);
    }
  }, [initialShippingInfo]);

  const handleCountryChange = (value: string) => {
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, {
        shippingAddress: {
          ...selectedCustomer.shippingAddress,
          country: value
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Customer Shipping Address</h3>
      <div className="space-y-4">
        <ShippingField 
          placeholder="Company" 
          value={selectedCustomer?.companyName || shippingInfo?.company || ""}
          readOnly={!!selectedCustomer}
        />
        <ShippingField 
          placeholder="Name" 
          value={selectedCustomer 
            ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}` 
            : shippingInfo?.contact || ""}
          readOnly={!!selectedCustomer}
        />
        <ShippingAddressFields 
          selectedCustomer={selectedCustomer}
          shippingInfo={shippingInfo}
          handleCountryChange={handleCountryChange}
        />
      </div>
    </div>
  );
}
