
import React, { useState } from "react";
import { ArrowLeft, Mail, Phone, FileText, Calendar, MessageSquare, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Customer } from "@/context/CustomersContext";
import { Contact } from "@/types/customer";
import { CustomerOverview } from "./CustomerOverview";
import { CustomerQuotes } from "./CustomerQuotes";
import { CustomerOrders } from "./CustomerOrders";
import { CustomerArtwork } from "./CustomerArtwork";
import { CustomerActivities } from "./CustomerActivities";

interface CustomerDetailProps {
  customer: Customer;
  industries: Array<{ id: string; name: string }>;
  customerQuotes: any[];
  customerOrders: any[];
  artworkFiles: any;
  onBack: () => void;
  onEditContact: (contact: Contact) => void;
  onEditPrimaryContact: () => void;
  onAddContact: () => void;
  onEditBillingAddress: () => void;
  onEditShippingAddress: () => void;
  onEditTaxInfo: () => void;
}

export function CustomerDetail({
  customer,
  industries,
  customerQuotes,
  customerOrders,
  artworkFiles,
  onBack,
  onEditContact,
  onEditPrimaryContact,
  onAddContact,
  onEditBillingAddress,
  onEditShippingAddress,
  onEditTaxInfo
}: CustomerDetailProps) {
  const getInitials = (companyName: string) => {
    return companyName.charAt(0).toUpperCase();
  };

  const getIndustryName = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId);
    return industry ? industry.name : industryId;
  };

  return (
    <div className="flex gap-6 h-full p-6 overflow-auto">
      <div className="w-1/3">
        <Button 
          variant="ghost" 
          className="mb-4 text-gray-500"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
        
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="flex justify-end w-full">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={onEditPrimaryContact}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit company</span>
              </Button>
            </div>
            
            <Avatar className="h-24 w-24 my-4 bg-blue-100 text-blue-600">
              <AvatarFallback className="text-2xl">
                {getInitials(customer.companyName)}
              </AvatarFallback>
            </Avatar>
            
            <h2 className="text-2xl font-bold mt-2">{customer.companyName}</h2>
            <p className="text-gray-500 mb-6">{getIndustryName(customer.industry)}</p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Meeting
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="w-2/3">
        <h1 className="text-2xl font-semibold mb-6">Customer Detail</h1>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="artwork">Artwork & Files</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <CustomerOverview 
              customer={customer}
              onEditContact={onEditContact}
              onEditPrimaryContact={onEditPrimaryContact}
              onAddContact={onAddContact}
              onEditBillingAddress={onEditBillingAddress}
              onEditShippingAddress={onEditShippingAddress}
              onEditTaxInfo={onEditTaxInfo}
            />
          </TabsContent>
          
          <TabsContent value="quotes">
            <CustomerQuotes quotes={customerQuotes} />
          </TabsContent>
          
          <TabsContent value="orders">
            <CustomerOrders orders={customerOrders} />
          </TabsContent>
          
          <TabsContent value="artwork">
            <CustomerArtwork files={artworkFiles} />
          </TabsContent>
          
          <TabsContent value="activities">
            <CustomerActivities />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
