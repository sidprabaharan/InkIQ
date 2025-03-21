
import React, { createContext, useContext, useState } from "react";

// Define the customer interface
export interface Customer {
  id: string;
  companyName: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  faxNumber: string;
  industry: string;
  invoiceOwner: string;
  billingAddress: {
    address1: string;
    address2: string;
    city: string;
    stateProvince: string;
    zipCode: string;
    country: string;
  };
  shippingAddress: {
    address1: string;
    address2: string;
    city: string;
    stateProvince: string;
    zipCode: string;
    country: string;
  };
  taxInfo: {
    taxId: string;
    taxRate: string;
    taxExemptionNumber: string;
  };
}

interface CustomersContextType {
  customers: Customer[];
  selectedCustomer: Customer | null;
  addCustomer: (customer: Omit<Customer, "id">) => Customer; // Update return type to Customer
  selectCustomer: (customerId: string) => void;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer = {
      ...customer,
      id: `customer-${Date.now()}`
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer; // Ensure we're returning the new customer
  };

  const selectCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId) || null;
    setSelectedCustomer(customer);
  };

  return (
    <CustomersContext.Provider value={{ 
      customers, 
      selectedCustomer, 
      addCustomer, 
      selectCustomer
    }}>
      {children}
    </CustomersContext.Provider>
  );
}

export function useCustomers() {
  const context = useContext(CustomersContext);
  if (context === undefined) {
    throw new Error("useCustomers must be used within a CustomersProvider");
  }
  return context;
}
