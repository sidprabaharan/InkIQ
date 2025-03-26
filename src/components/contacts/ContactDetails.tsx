
import React, { useState } from "react";
import { Contact } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Book,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Activity,
  User,
  Briefcase,
  Building,
  FileText,
  ShoppingCart,
  Clock,
  Edit,
  Trash,
  Plus
} from "lucide-react";

interface ContactDetailsProps {
  contact: Contact & { companyName?: string };
  onBack: () => void;
}

export function ContactDetails({ contact, onBack }: ContactDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const getInitials = () => {
    return `${contact.firstName.charAt(0)}${contact.lastName.charAt(0)}`.toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">
            {contact.firstName} {contact.lastName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" className="gap-2 text-red-500">
            <Trash className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar */}
        <div className="md:col-span-1 space-y-6">
          {/* Contact info card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center mb-6 text-center">
                <Avatar className="h-20 w-20 mb-4 text-xl">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">
                  {contact.firstName} {contact.lastName}
                </h2>
                {contact.jobTitle && (
                  <p className="text-gray-500">{contact.jobTitle}</p>
                )}
                <p className="text-blue-600">{contact.companyName}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center mb-6">
                <Button variant="ghost" className="flex flex-col items-center h-auto py-3 px-1">
                  <Phone className="h-5 w-5 mb-1 text-gray-500" />
                  <span className="text-xs">Call</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center h-auto py-3 px-1">
                  <Mail className="h-5 w-5 mb-1 text-gray-500" />
                  <span className="text-xs">Email</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center h-auto py-3 px-1">
                  <MessageSquare className="h-5 w-5 mb-1 text-gray-500" />
                  <span className="text-xs">Message</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center h-auto py-3 px-1">
                  <Calendar className="h-5 w-5 mb-1 text-gray-500" />
                  <span className="text-xs">Meeting</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center h-auto py-3 px-1">
                  <FileText className="h-5 w-5 mb-1 text-gray-500" />
                  <span className="text-xs">Task</span>
                </Button>
                <Button variant="ghost" className="flex flex-col items-center h-auto py-3 px-1">
                  <Book className="h-5 w-5 mb-1 text-gray-500" />
                  <span className="text-xs">Notes</span>
                </Button>
              </div>
              
              <div className="space-y-4">                
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Email Address</h4>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    {contact.email}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Phone Number</h4>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    {contact.phoneNumber}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Company</h4>
                  <p className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    {contact.companyName || "Not specified"}
                  </p>
                </div>
                
                {contact.jobTitle && (
                  <div>
                    <h4 className="text-sm text-gray-500 mb-1">Job Title</h4>
                    <p className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-gray-500" />
                      {contact.jobTitle}
                    </p>
                  </div>
                )}
                
                {contact.department && (
                  <div>
                    <h4 className="text-sm text-gray-500 mb-1">Department</h4>
                    <p className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      {contact.department}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm text-gray-500 mb-1">Contact Owner</h4>
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    {contact.contactOwner || "Unassigned"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-3">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-blue-50 rounded-lg p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white"
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="orders" 
                className="data-[state=active]:bg-white"
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="quotes" 
                className="data-[state=active]:bg-white"
                onClick={() => setActiveTab("quotes")}
              >
                Quotes
              </TabsTrigger>
              <TabsTrigger 
                value="activities" 
                className="data-[state=active]:bg-white"
                onClick={() => setActiveTab("activities")}
              >
                Activities
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Recent Activity</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Activity
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      No recent activities to show.
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Notes</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Note
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      No notes to show yet.
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Tasks</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Task
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      No tasks assigned yet.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Orders</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Create Order
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      No orders to show yet.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="quotes" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Quotes</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Create Quote
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      No quotes to show yet.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Activities Timeline</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Clock className="h-4 w-4" />
                      Log Activity
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-center py-8 text-gray-500">
                      No activities to show yet.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
