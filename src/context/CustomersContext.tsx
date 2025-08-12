
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
  jobTitle?: string;
  department?: string;
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
  updateCustomer: (customerId: string, data: Partial<Customer>) => void;
  updateCustomerContact: (customerId: string, contactId: string, data: Partial<Contact>) => void;
}

// No sample data: start empty

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export function CustomersProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
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

  // Add new function to update customer information
  const updateCustomer = (customerId: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const updatedCustomer = { ...customer, ...data };
        
        // If we're updating contacts directly (which is an array), make sure to handle it properly
        if (data.contacts) {
          updatedCustomer.contacts = data.contacts;
        }
        
        return updatedCustomer;
      }
      return customer;
    }));

    // Update selectedCustomer if it's the one being modified
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer(prev => prev ? { ...prev, ...data } : null);
    }
  };

  // Add function to update a specific contact of a customer
  const updateCustomerContact = (customerId: string, contactId: string, data: Partial<Contact>) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        const updatedContacts = customer.contacts.map(contact => 
          contact.id === contactId ? { ...contact, ...data } : contact
        );
        
        return {
          ...customer,
          contacts: updatedContacts
        };
      }
      return customer;
    }));

    // Update selectedCustomer if it's the one being modified
    if (selectedCustomer && selectedCustomer.id === customerId) {
      const updatedContacts = selectedCustomer.contacts.map(contact => 
        contact.id === contactId ? { ...contact, ...data } : contact
      );
      
      setSelectedCustomer({
        ...selectedCustomer,
        contacts: updatedContacts
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
      addContactToCustomer,
      updateCustomer,
      updateCustomerContact
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
