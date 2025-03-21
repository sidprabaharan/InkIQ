
import React from "react";
import { ShippingField } from "./ShippingField";
import { CountrySelect } from "./CountrySelect";

interface ShippingAddressFieldsProps {
  selectedCustomer: any;
  shippingInfo: any;
  handleCountryChange: (value: string) => void;
}

export function ShippingAddressFields({ 
  selectedCustomer, 
  shippingInfo, 
  handleCountryChange 
}: ShippingAddressFieldsProps) {
  return (
    <>
      <ShippingField 
        placeholder="Address" 
        value={selectedCustomer?.shippingAddress?.address1 || shippingInfo?.address || ""}
        readOnly={!!selectedCustomer}
      />
      <ShippingField 
        placeholder="Address" 
        value={selectedCustomer?.shippingAddress?.address2 || shippingInfo?.unit || ""}
        readOnly={!!selectedCustomer}
      />
      <div className="grid grid-cols-2 gap-4">
        <CountrySelect 
          value={selectedCustomer?.shippingAddress?.country || ""}
          onValueChange={handleCountryChange}
          disabled={!selectedCustomer}
        />
        <ShippingField 
          placeholder="State/ Province" 
          value={selectedCustomer?.shippingAddress?.stateProvince || shippingInfo?.region || ""}
          readOnly={!!selectedCustomer}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <ShippingField 
          placeholder="City" 
          value={selectedCustomer?.shippingAddress?.city || shippingInfo?.city || ""}
          readOnly={!!selectedCustomer}
        />
        <ShippingField 
          placeholder="Zip Code Postal Code" 
          value={selectedCustomer?.shippingAddress?.zipCode || ""}
          readOnly={!!selectedCustomer}
        />
      </div>
    </>
  );
}
