
import React from "react";
import { Input } from "@/components/ui/input";

interface BillingFieldProps {
  placeholder: string;
  value: string;
  readOnly?: boolean;
}

export function BillingField({ placeholder, value, readOnly = false }: BillingFieldProps) {
  return (
    <Input 
      placeholder={placeholder} 
      value={value}
      readOnly={readOnly}
    />
  );
}
