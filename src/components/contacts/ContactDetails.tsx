
import React, { useState } from "react";
import { Contact } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Book, 
  Mail, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Activity 
} from "lucide-react";

interface ContactDetailsProps {
  contact: Contact & { companyName?: string };
  onBack: () => void;
}

export function ContactDetails({ contact, onBack }: ContactDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const getInitial = () => {
    return contact.firstName.charAt(0).toUpperCase();
  };
  
  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to contacts
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg border p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4">
              {getInitial()}
            </div>
            <h2 className="text-xl font-semibold text-center">
              {contact.firstName} {contact.lastName}
            </h2>
            <p className="text-gray-500 text-center">{contact.email}</p>
          </div>
          
          <div className="flex flex-wrap -mx-1 mb-6">
            <div className="px-1 mb-2">
              <Button variant="outline" className="w-full flex items-center" size="sm">
                <Book className="mr-2 h-4 w-4" />
                Note
              </Button>
            </div>
            <div className="px-1 mb-2">
              <Button variant="outline" className="w-full flex items-center" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Button>
            </div>
            <div className="px-1 mb-2">
              <Button variant="outline" className="w-full flex items-center" size="sm">
                <Phone className="mr-2 h-4 w-4" />
                Call
              </Button>
            </div>
            <div className="px-1 mb-2">
              <Button variant="outline" className="w-full flex items-center" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                Meeting
              </Button>
            </div>
            <div className="px-1 mb-2">
              <Button variant="outline" className="w-full flex items-center" size="sm">
                <MessageSquare className="mr-2 h-4 w-4" />
                Task
              </Button>
            </div>
            <div className="px-1 mb-2">
              <Button variant="outline" className="w-full flex items-center" size="sm">
                <Activity className="mr-2 h-4 w-4" />
                Activity
              </Button>
            </div>
          </div>
          
          <div className="space-y-4 mt-6">
            <h3 className="font-medium text-lg">About This Contact</h3>
            
            <div>
              <h4 className="text-sm text-gray-500">Email Address</h4>
              <p>{contact.email}</p>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-500">Phone Number</h4>
              <p>{contact.phoneNumber}</p>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-500">Company Name</h4>
              <p>{contact.companyName || "Not specified"}</p>
            </div>
            
            {contact.jobTitle && (
              <div>
                <h4 className="text-sm text-gray-500">Job Title</h4>
                <p>{contact.jobTitle}</p>
              </div>
            )}
            
            {contact.department && (
              <div>
                <h4 className="text-sm text-gray-500">Department</h4>
                <p>{contact.department}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm text-gray-500">Contact Owner</h4>
              <p>{contact.contactOwner || "Not yet assigned"}</p>
            </div>
            
            <div>
              <h4 className="text-sm text-gray-500">Task</h4>
              <p>Not yet assigned</p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-blue-50 rounded-lg p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white"
                onClick={() => setActiveTab("overview")}
              >
                Overview
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
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-medium mb-4">Orders</h3>
                <div className="text-center py-8 text-gray-500">
                  No orders to show yet.
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-medium mb-4">Artwork</h3>
                <div className="text-center py-8 text-gray-500">
                  No artworks to show yet.
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-6">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
                <div className="text-center py-8 text-gray-500">
                  No activities to show yet.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
