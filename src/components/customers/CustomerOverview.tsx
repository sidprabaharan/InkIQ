
import React from "react";
import { Edit, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Contact } from "@/types/customer";
import { Customer } from "@/context/CustomersContext";
import { ContactsList } from "@/components/customers/ContactsList";

interface CustomerOverviewProps {
  customer: Customer;
  onEditContact: (contact: Contact) => void;
  onEditPrimaryContact: () => void;
  onAddContact: () => void;
  onEditBillingAddress: () => void;
  onEditShippingAddress: () => void;
  onEditTaxInfo: () => void;
}

export function CustomerOverview({
  customer,
  onEditContact,
  onEditPrimaryContact,
  onAddContact,
  onEditBillingAddress,
  onEditShippingAddress,
  onEditTaxInfo
}: CustomerOverviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Highlights</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-500 mb-1">Number of Orders</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-500 mb-1">Total Sales Volume</p>
              <p className="text-2xl font-bold">$4,125.50</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-500 mb-1">Current Quotes Volume</p>
              <p className="text-2xl font-bold">$6,630.00</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Information</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600"
            onClick={onAddContact}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <ContactsList 
            contacts={customer.contacts || []}
            primaryContact={{
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email,
              phoneNumber: customer.phoneNumber
            }}
            onEditContact={onEditContact}
            onEditPrimaryContact={onEditPrimaryContact}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Billing Address</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={onEditBillingAddress}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit billing address</span>
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p>{customer.billingAddress.address1}</p>
              {customer.billingAddress.address2 && (
                <p>{customer.billingAddress.address2}</p>
              )}
              <p>
                {customer.billingAddress.city}, 
                {customer.billingAddress.stateProvince && ` ${customer.billingAddress.stateProvince},`} 
                {customer.billingAddress.zipCode}
              </p>
              <p>{customer.billingAddress.country}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Shipping Address</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={onEditShippingAddress}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit shipping address</span>
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p>{customer.shippingAddress.address1}</p>
              {customer.shippingAddress.address2 && (
                <p>{customer.shippingAddress.address2}</p>
              )}
              <p>
                {customer.shippingAddress.city}, 
                {customer.shippingAddress.stateProvince && ` ${customer.shippingAddress.stateProvince},`} 
                {customer.shippingAddress.zipCode}
              </p>
              <p>{customer.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tax Information</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={onEditTaxInfo}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit tax information</span>
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Tax ID</p>
              <p>{customer.taxInfo.taxId || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tax Rate</p>
              <p>{customer.taxInfo.taxRate ? `${customer.taxInfo.taxRate}%` : "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tax Exemption Number</p>
              <p>{customer.taxInfo.taxExemptionNumber || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
