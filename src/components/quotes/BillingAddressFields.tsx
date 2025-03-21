
import React from "react";
import { BillingField } from "./BillingField";
import { CountrySelect } from "./CountrySelect";

interface BillingAddressFieldsProps {
  selectedCustomer: any;
  billingInfo: any;
  handleCountryChange: (value: string) => void;
}

export function BillingAddressFields({ 
  selectedCustomer, 
  billingInfo, 
  handleCountryChange 
}: BillingAddressFieldsProps) {
  return (
    <>
      <BillingField 
        placeholder="Address" 
        value={selectedCustomer?.billingAddress?.address1 || billingInfo?.address || ""}
        readOnly={!!selectedCustomer}
      />
      <BillingField 
        placeholder="Address" 
        value={selectedCustomer?.billingAddress?.address2 || ""}
        readOnly={!!selectedCustomer}
      />
      <div className="grid grid-cols-2 gap-4">
        <CountrySelect 
          value={selectedCustomer?.billingAddress?.country || billingInfo?.country || ""}
          onValueChange={handleCountryChange}
          disabled={!selectedCustomer}
        />
        <BillingField 
          placeholder="State/ Province" 
          value={selectedCustomer?.billingAddress?.stateProvince || billingInfo?.region || ""}
          readOnly={!!selectedCustomer}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <BillingField 
          placeholder="City" 
          value={selectedCustomer?.billingAddress?.city || billingInfo?.city || ""}
          readOnly={!!selectedCustomer}
        />
        <BillingField 
          placeholder="Zip Code Postal Code" 
          value={selectedCustomer?.billingAddress?.zipCode || billingInfo?.postalCode || ""}
          readOnly={!!selectedCustomer}
        />
      </div>
    </>
  );
}
