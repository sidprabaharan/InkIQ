
import React, { createContext, useContext, useState } from "react";
import { Contact } from "@/types/customer";

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
  contacts: Contact[];
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
  addCustomer: (customer: Omit<Customer, "id" | "contacts">) => Customer;
  selectCustomer: (customerId: string) => void;
  getCustomerById: (customerId: string) => Customer | undefined;
  addContactToCustomer: (customerId: string, contact: Omit<Contact, "id">) => void;
}

// Example customers data
const exampleCustomers: Customer[] = [
  {
    id: "customer-1",
    companyName: "Nestle Print",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@nestleprint.com",
    phoneNumber: "+1 (416) 555-1234",
    faxNumber: "+1 (416) 555-1235",
    industry: "tech",
    invoiceOwner: "Finance Department",
    contacts: [],
    billingAddress: {
      address1: "123 Print Avenue",
      address2: "Suite 400",
      city: "Toronto",
      stateProvince: "Ontario",
      zipCode: "M5V 2H1",
      country: "Canada"
    },
    shippingAddress: {
      address1: "123 Print Avenue",
      address2: "Suite 400",
      city: "Toronto",
      stateProvince: "Ontario",
      zipCode: "M5V 2H1",
      country: "Canada"
    },
    taxInfo: {
      taxId: "CA123456789",
      taxRate: "13",
      taxExemptionNumber: ""
    }
  },
  {
    id: "customer-2",
    companyName: "Tech Innovators",
    firstName: "Emma",
    lastName: "Wilson",
    email: "emma@techinnovators.com",
    phoneNumber: "+1 (415) 555-7890",
    faxNumber: "+1 (415) 555-7891",
    industry: "tech",
    invoiceOwner: "Accounts Payable",
    contacts: [],
    billingAddress: {
      address1: "456 Innovation Drive",
      address2: "Floor 10",
      city: "San Francisco",
      stateProvince: "California",
      zipCode: "94105",
      country: "USA"
    },
    shippingAddress: {
      address1: "456 Innovation Drive",
      address2: "Floor 10",
      city: "San Francisco",
      stateProvince: "California",
      zipCode: "94105",
      country: "USA"
    },
    taxInfo: {
      taxId: "US987654321",
      taxRate: "8.5",
      taxExemptionNumber: ""
    }
  },
  {
    id: "customer-3",
    companyName: "Global Retail Solutions",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@globalretail.com",
    phoneNumber: "+44 20 7946 0958",
    faxNumber: "+44 20 7946 0959",
    industry: "retail",
    invoiceOwner: "Finance",
    contacts: [],
    billingAddress: {
      address1: "789 Retail Row",
      address2: "Building C",
      city: "London",
      stateProvince: "",
      zipCode: "EC1A 1BB",
      country: "United Kingdom"
    },
    shippingAddress: {
      address1: "789 Retail Row",
      address2: "Building C",
      city: "London",
      stateProvince: "",
      zipCode: "EC1A 1BB",
      country: "United Kingdom"
    },
    taxInfo: {
      taxId: "GB123456789",
      taxRate: "20",
      taxExemptionNumber: ""
    }
  }
];

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(exampleCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const addCustomer = (customer: Omit<Customer, "id" | "contacts">) => {
    const newCustomer = {
      ...customer,
      id: `customer-${Date.now()}`,
      contacts: []
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const selectCustomer = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId) || null;
    setSelectedCustomer(customer);
  };

  const getCustomerById = (customerId: string) => {
    return customers.find(c => c.id === customerId);
  };

  const addContactToCustomer = (customerId: string, contact: Omit<Contact, "id">) => {
    const newContact = {
      ...contact,
      id: `contact-${Date.now()}`
    };

    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          contacts: [...customer.contacts, newContact]
        };
      }
      return customer;
    }));

    // Update selectedCustomer if it's the one being modified
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer({
        ...selectedCustomer,
        contacts: [...selectedCustomer.contacts, newContact]
      });
    }
  };

  return (
    <CustomersContext.Provider value={{ 
      customers, 
      selectedCustomer, 
      addCustomer, 
      selectCustomer,
      getCustomerById,
      addContactToCustomer
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
