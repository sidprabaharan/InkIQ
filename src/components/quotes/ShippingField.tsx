
import React from "react";
import { Input } from "@/components/ui/input";

interface ShippingFieldProps {
  placeholder: string;
  value: string;
  readOnly?: boolean;
}

export function ShippingField({ placeholder, value, readOnly = false }: ShippingFieldProps) {
  return (
    <Input 
      placeholder={placeholder} 
      value={value}
      readOnly={readOnly}
    />
  );
}
