
import React, { useState } from "react";
import { ContactsTable } from "@/components/contacts/ContactsTable";
import { ContactDetails } from "@/components/contacts/ContactDetails";
import { useCustomers } from "@/context/CustomersContext";
import { Contact } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Contacts() {
  const { customers } = useCustomers();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Flatten all contacts from all customers
  const allContacts = customers.flatMap(customer => 
    customer.contacts.map(contact => ({
      ...contact,
      companyName: customer.companyName
    }))
  );

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
  };

  const handleBackToList = () => {
    setSelectedContact(null);
  };

  return (
    <div className="container mx-auto p-6">
      {!selectedContact ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Contacts</h1>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add New Contact
            </Button>
          </div>
          <ContactsTable contacts={allContacts} onSelectContact={handleContactSelect} />
        </div>
      ) : (
        <ContactDetails contact={selectedContact} onBack={handleBackToList} />
      )}
    </div>
  );
}
