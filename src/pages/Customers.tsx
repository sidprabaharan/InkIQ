
import React, { useState } from "react";
import { useCustomers } from "@/context/CustomersContext";
import { Contact } from "@/types/customer";
import { CustomerDialog } from "@/components/quotes/CustomerDialog";
import { AddContactDialog, ContactFormValues } from "@/components/customers/AddContactDialog";
import { EditContactDialog } from "@/components/customers/EditContactDialog";
import { EditCompanyDialog, CompanyFormValues } from "@/components/customers/EditCompanyDialog";
import { EditAddressDialog, AddressFormValues } from "@/components/customers/EditAddressDialog";
import { EditTaxInfoDialog, TaxInfoFormValues } from "@/components/customers/EditTaxInfoDialog";
import { CustomerList } from "@/components/customers/CustomerList";
import { CustomerDetail } from "@/components/customers/CustomerDetail";
import { industries, customerOrders, customerQuotes, artworkFiles } from "@/components/customers/CustomerConstants";
import { toast } from "sonner";

export default function Customers() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const { customers, addContactToCustomer, updateCustomer, updateCustomerContact } = useCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [editContactDialog, setEditContactDialog] = useState(false);
  const [editCompanyDialog, setEditCompanyDialog] = useState(false);
  const [editBillingAddressDialog, setEditBillingAddressDialog] = useState(false);
  const [editShippingAddressDialog, setEditShippingAddressDialog] = useState(false);
  const [editTaxInfoDialog, setEditTaxInfoDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const selectedCustomer = selectedCustomerId 
    ? customers.find(c => c.id === selectedCustomerId) 
    : null;

  const filteredCustomers = customers.filter(customer => 
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIndustryName = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId);
    return industry ? industry.name : industryId;
  };

  const handleAddContact = (data: ContactFormValues) => {
    if (selectedCustomerId) {
      const newContact: Omit<Contact, "id"> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        jobTitle: data.jobTitle,
        department: data.department,
        contactOwner: data.contactOwner,
      };
      
      addContactToCustomer(selectedCustomerId, newContact);
      toast.success("Contact added successfully");
    }
  };

  const handleEditContact = (contactId: string, data: ContactFormValues) => {
    if (selectedCustomerId) {
      updateCustomerContact(selectedCustomerId, contactId, data);
      toast.success("Contact updated successfully");
    }
  };

  const handleEditCompany = (data: CompanyFormValues) => {
    if (selectedCustomerId) {
      updateCustomer(selectedCustomerId, data);
      toast.success("Company information updated successfully");
    }
  };

  const handleEditBillingAddress = (data: AddressFormValues) => {
    if (selectedCustomerId) {
      const billingAddress = {
        address1: data.address1,
        address2: data.address2 || "",
        city: data.city,
        stateProvince: data.stateProvince || "",
        zipCode: data.zipCode,
        country: data.country,
      };
      
      updateCustomer(selectedCustomerId, { billingAddress });
      toast.success("Billing address updated successfully");
    }
  };

  const handleEditShippingAddress = (data: AddressFormValues) => {
    if (selectedCustomerId) {
      const shippingAddress = {
        address1: data.address1,
        address2: data.address2 || "",
        city: data.city,
        stateProvince: data.stateProvince || "",
        zipCode: data.zipCode,
        country: data.country,
      };
      
      updateCustomer(selectedCustomerId, { shippingAddress });
      toast.success("Shipping address updated successfully");
    }
  };

  const handleEditTaxInfo = (data: TaxInfoFormValues) => {
    if (selectedCustomerId) {
      const taxInfo = {
        taxId: data.taxId || "",
        taxRate: data.taxRate || "",
        taxExemptionNumber: data.taxExemptionNumber || "",
      };
      
      updateCustomer(selectedCustomerId, { taxInfo });
      toast.success("Tax information updated successfully");
    }
  };

  const handleEditPrimaryContact = () => {
    if (selectedCustomer) {
      setEditCompanyDialog(true);
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {!selectedCustomer ? (
        <CustomerList 
          customers={customers}
          filteredCustomers={filteredCustomers}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateNew={() => setOpenDialog(true)}
          onSelectCustomer={setSelectedCustomerId}
          getIndustryName={getIndustryName}
        />
      ) : (
        <CustomerDetail 
          customer={selectedCustomer}
          industries={industries}
          customerQuotes={customerQuotes}
          customerOrders={customerOrders}
          artworkFiles={artworkFiles}
          onBack={() => setSelectedCustomerId(null)}
          onEditContact={(contact) => {
            setSelectedContact(contact);
            setEditContactDialog(true);
          }}
          onEditPrimaryContact={handleEditPrimaryContact}
          onAddContact={() => setOpenContactDialog(true)}
          onEditBillingAddress={() => setEditBillingAddressDialog(true)}
          onEditShippingAddress={() => setEditShippingAddressDialog(true)}
          onEditTaxInfo={() => setEditTaxInfoDialog(true)}
        />
      )}

      <CustomerDialog 
        open={openDialog}
        onOpenChange={setOpenDialog}
      />

      {selectedCustomerId && (
        <>
          <AddContactDialog 
            open={openContactDialog}
            onOpenChange={setOpenContactDialog}
            onAddContact={handleAddContact}
            customerId={selectedCustomerId}
          />
          
          {selectedContact && (
            <EditContactDialog 
              open={editContactDialog}
              onOpenChange={setEditContactDialog}
              onUpdateContact={handleEditContact}
              contact={selectedContact}
            />
          )}
          
          {selectedCustomer && (
            <>
              <EditCompanyDialog 
                open={editCompanyDialog}
                onOpenChange={setEditCompanyDialog}
                onUpdateCompany={handleEditCompany}
                customer={selectedCustomer}
              />
              
              <EditAddressDialog 
                open={editBillingAddressDialog}
                onOpenChange={setEditBillingAddressDialog}
                onUpdateAddress={handleEditBillingAddress}
                address={selectedCustomer.billingAddress}
                title="Billing Address"
              />
              
              <EditAddressDialog 
                open={editShippingAddressDialog}
                onOpenChange={setEditShippingAddressDialog}
                onUpdateAddress={handleEditShippingAddress}
                address={selectedCustomer.shippingAddress}
                title="Shipping Address"
              />
              
              <EditTaxInfoDialog 
                open={editTaxInfoDialog}
                onOpenChange={setEditTaxInfoDialog}
                onUpdateTaxInfo={handleEditTaxInfo}
                taxInfo={selectedCustomer.taxInfo}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
