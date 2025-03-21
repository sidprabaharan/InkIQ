
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, ArrowLeft, Mail, Phone, FileText, Calendar, BarChart2, MessageSquare, MapPin } from "lucide-react";
import { CustomerDialog } from "@/components/quotes/CustomerDialog";
import { useCustomers } from "@/context/CustomersContext";

export default function Customers() {
  const [openDialog, setOpenDialog] = useState(false);
  const { customers } = useCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get the selected customer details if a customer is selected
  const selectedCustomer = selectedCustomerId 
    ? customers.find(c => c.id === selectedCustomerId) 
    : null;

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get initials for avatar
  const getInitials = (companyName: string) => {
    return companyName.charAt(0).toUpperCase();
  };

  // Function to get industry name
  const getIndustryName = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId);
    return industry ? industry.name : industryId;
  };

  return (
    <div className="p-6">
      {!selectedCustomer ? (
        // Customers List View
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Customers</h1>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search" 
                  className="pl-9 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Delete</Button>
              <Button variant="outline">Export</Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setOpenDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-md border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input type="checkbox" className="h-4 w-4 rounded" />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No. of Orders Placed
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sales volume
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Industry
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedCustomerId(customer.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" className="h-4 w-4 rounded" onClick={(e) => e.stopPropagation()} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.companyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.billingAddress.city}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {customer.billingAddress.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        $0
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getIndustryName(customer.industry)}
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                        No customers found. Add a new customer to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredCustomers.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <div>
                  Showing {filteredCustomers.length} of {customers.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={true}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-50">
                    1
                  </Button>
                  <Button variant="outline" size="sm" disabled={true}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        // Customer Detail View
        <div className="flex gap-6">
          {/* Left Column - Customer Info */}
          <div className="w-1/3">
            <Button 
              variant="ghost" 
              className="mb-4 text-gray-500"
              onClick={() => setSelectedCustomerId(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 my-4 bg-blue-100 text-blue-600">
                  <AvatarFallback className="text-2xl">
                    {getInitials(selectedCustomer.companyName)}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-bold mt-2">{selectedCustomer.companyName}</h2>
                <p className="text-gray-500 mb-6">{getIndustryName(selectedCustomer.industry)}</p>
                
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
                
                <h3 className="text-lg font-semibold self-start mb-2">About This Customer</h3>
                
                <div className="w-full space-y-3 text-left">
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p>{selectedCustomer.billingAddress.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p>{selectedCustomer.billingAddress.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">No. of Orders Placed</p>
                    <p>0</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sales volume</p>
                    <p>$0</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p>{getIndustryName(selectedCustomer.industry)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{selectedCustomer.billingAddress.address1}</p>
                    {selectedCustomer.billingAddress.address2 && (
                      <p>{selectedCustomer.billingAddress.address2}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Details */}
          <div className="w-2/3">
            <h1 className="text-2xl font-semibold mb-6">Customer Detail</h1>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activities">Activities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-gray-500 mb-1">Number of Orders</p>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-gray-500 mb-1">Total Sales Volume</p>
                        <p className="text-2xl font-bold">$0</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-gray-500 mb-1">Current Quotes Volume</p>
                        <p className="text-2xl font-bold">$0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Full Name</p>
                        <p>{selectedCustomer.firstName} {selectedCustomer.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email Address</p>
                        <p>{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                        <p>{selectedCustomer.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Fax Number</p>
                        <p>{selectedCustomer.faxNumber || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Invoice Owner</p>
                        <p>{selectedCustomer.invoiceOwner || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <p>{selectedCustomer.billingAddress.address1}</p>
                        {selectedCustomer.billingAddress.address2 && (
                          <p>{selectedCustomer.billingAddress.address2}</p>
                        )}
                        <p>
                          {selectedCustomer.billingAddress.city}, 
                          {selectedCustomer.billingAddress.stateProvince && ` ${selectedCustomer.billingAddress.stateProvince},`} 
                          {selectedCustomer.billingAddress.zipCode}
                        </p>
                        <p>{selectedCustomer.billingAddress.country}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Address</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-2">
                        <p>{selectedCustomer.shippingAddress.address1}</p>
                        {selectedCustomer.shippingAddress.address2 && (
                          <p>{selectedCustomer.shippingAddress.address2}</p>
                        )}
                        <p>
                          {selectedCustomer.shippingAddress.city}, 
                          {selectedCustomer.shippingAddress.stateProvince && ` ${selectedCustomer.shippingAddress.stateProvince},`} 
                          {selectedCustomer.shippingAddress.zipCode}
                        </p>
                        <p>{selectedCustomer.shippingAddress.country}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Information</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Tax ID</p>
                        <p>{selectedCustomer.taxInfo.taxId || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Tax Rate</p>
                        <p>{selectedCustomer.taxInfo.taxRate ? `${selectedCustomer.taxInfo.taxRate}%` : "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Tax Exemption Number</p>
                        <p>{selectedCustomer.taxInfo.taxExemptionNumber || "N/A"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities">
                <Card>
                  <CardContent className="p-6 min-h-[200px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart2 className="h-16 w-16 mx-auto mb-4 opacity-40" />
                      <p className="text-lg">No activity data to show yet.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      <CustomerDialog 
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </div>
  );
}

const industries = [
  { id: "tech", name: "Technology" },
  { id: "retail", name: "Retail" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "ecommerce", name: "Ecommerce" },
];
