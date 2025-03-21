
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, ArrowLeft, Mail, Phone, FileText, Calendar, MessageSquare, File, Image, Folder, Code, PenTool, ShoppingCart, FileCheck, UserPlus } from "lucide-react";
import { CustomerDialog } from "@/components/quotes/CustomerDialog";
import { useCustomers } from "@/context/CustomersContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddContactDialog, ContactFormValues } from "@/components/customers/AddContactDialog";
import { ContactsList } from "@/components/customers/ContactsList";
import { Contact } from "@/types/customer";

export default function Customers() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const { customers, addContactToCustomer } = useCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedCustomer = selectedCustomerId 
    ? customers.find(c => c.id === selectedCustomerId) 
    : null;

  const filteredCustomers = customers.filter(customer => 
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (companyName: string) => {
    return companyName.charAt(0).toUpperCase();
  };

  const getIndustryName = (industryId: string) => {
    const industry = industries.find(i => i.id === industryId);
    return industry ? industry.name : industryId;
  };

  const handleAddContact = (data: ContactFormValues) => {
    if (selectedCustomerId) {
      // Ensure all required fields are present
      // The Contact type requires email, firstName, lastName, and phoneNumber to be required
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
    }
  };

  const customerOrders = [
    {
      id: "3032",
      date: "2023-08-15",
      total: "$1,245.00",
      status: "Completed",
      items: "T-shirts (50), Hoodies (25)"
    },
    {
      id: "2987",
      date: "2023-06-22",
      total: "$780.50",
      status: "Completed",
      items: "Polos (30), Caps (40)"
    },
    {
      id: "2756",
      date: "2023-04-10",
      total: "$2,100.00",
      status: "Completed",
      items: "Custom Jackets (20)"
    }
  ];

  const customerQuotes = [
    {
      id: "Q-5893",
      date: "2023-09-05",
      total: "$2,450.00",
      status: "Pending Approval",
      items: "Custom T-shirts (100), Embroidered Caps (50)"
    },
    {
      id: "Q-5742",
      date: "2023-08-28",
      total: "$980.00",
      status: "Draft",
      items: "Polo Shirts (45)"
    },
    {
      id: "Q-5621",
      date: "2023-08-10",
      total: "$3,200.00",
      status: "Approved",
      items: "Hoodies (80), Tote Bags (100)"
    }
  ];

  const artworkFiles = {
    mockups: [
      { name: "Tshirt-Front-Design.png", date: "2023-08-01", size: "2.4 MB" },
      { name: "Hoodie-Back-Logo.png", date: "2023-06-15", size: "1.8 MB" }
    ],
    logoFiles: [
      { name: "Company-Logo-Vector.ai", date: "2023-01-10", size: "4.2 MB" },
      { name: "Logo-White-Version.png", date: "2023-01-10", size: "1.1 MB" }
    ],
    colorSeparations: [
      { name: "Logo-4Color-Sep.pdf", date: "2023-02-20", size: "5.6 MB" }
    ],
    digitizedLogos: [
      { name: "Logo-Digitized-3Inches.dst", date: "2023-03-05", size: "156 KB" },
      { name: "Logo-Digitized-5Inches.dst", date: "2023-03-05", size: "220 KB" }
    ],
    dtfGangSheets: [
      { name: "Small-Logos-Gang-Sheet.pdf", date: "2023-07-12", size: "8.2 MB" }
    ]
  };

  return (
    <div className="p-6">
      {!selectedCustomer ? (
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
        <div className="flex gap-6">
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
              
              <TabsContent value="overview" className="space-y-6">
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
                      onClick={() => setOpenContactDialog(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ContactsList 
                      contacts={selectedCustomer.contacts || []}
                      primaryContact={{
                        firstName: selectedCustomer.firstName,
                        lastName: selectedCustomer.lastName,
                        email: selectedCustomer.email,
                        phoneNumber: selectedCustomer.phoneNumber
                      }}
                    />
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
              
              <TabsContent value="quotes">
                <Card>
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <CardTitle>Customer Quotes</CardTitle>
                      <Button variant="outline" size="sm" className="text-blue-600">
                        <Plus className="h-4 w-4 mr-2" />
                        New Quote
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Quote ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerQuotes.map((quote) => (
                          <TableRow key={quote.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="font-medium">#{quote.id}</TableCell>
                            <TableCell>{quote.date}</TableCell>
                            <TableCell>{quote.items}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                quote.status === 'Approved' 
                                  ? 'bg-green-100 text-green-800'
                                  : quote.status === 'Draft'
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {quote.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{quote.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="flex justify-center mt-6">
                      <Button variant="outline" className="text-blue-600">
                        <FileCheck className="h-4 w-4 mr-2" />
                        View All Quotes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center">
                      <CardTitle>Customer Orders</CardTitle>
                      <Button variant="outline" size="sm" className="text-blue-600">
                        <Plus className="h-4 w-4 mr-2" />
                        New Order
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customerOrders.map((order) => (
                          <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                            <TableCell className="font-medium">#{order.id}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.items}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {order.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{order.total}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="flex justify-center mt-6">
                      <Button variant="outline" className="text-blue-600">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View All Orders
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="artwork">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Image className="h-5 w-5 mr-2" />
                        Mockups
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {artworkFiles.mockups.map((file, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium flex items-center">
                                <Image className="h-4 w-4 mr-2 text-blue-500" />
                                {file.name}
                              </TableCell>
                              <TableCell>{file.date}</TableCell>
                              <TableCell>{file.size}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <File className="h-5 w-5 mr-2" />
                        Logo Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {artworkFiles.logoFiles.map((file, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium flex items-center">
                                <File className="h-4 w-4 mr-2 text-blue-500" />
                                {file.name}
                              </TableCell>
                              <TableCell>{file.date}</TableCell>
                              <TableCell>{file.size}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PenTool className="h-5 w-5 mr-2" />
                        Colour Separations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {artworkFiles.colorSeparations.map((file, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                {file.name}
                              </TableCell>
                              <TableCell>{file.date}</TableCell>
                              <TableCell>{file.size}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Code className="h-5 w-5 mr-2" />
                        Digitized Logos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {artworkFiles.digitizedLogos.map((file, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium flex items-center">
                                <Code className="h-4 w-4 mr-2 text-blue-500" />
                                {file.name}
                              </TableCell>
                              <TableCell>{file.date}</TableCell>
                              <TableCell>{file.size}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Folder className="h-5 w-5 mr-2" />
                        DTF Gang Sheets
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>File Name</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {artworkFiles.dtfGangSheets.map((file, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium flex items-center">
                                <Folder className="h-4 w-4 mr-2 text-blue-500" />
                                {file.name}
                              </TableCell>
                              <TableCell>{file.date}</TableCell>
                              <TableCell>{file.size}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Download
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="activities">
                <Card>
                  <CardContent className="p-6 min-h-[200px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-40" />
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

      {selectedCustomerId && (
        <AddContactDialog 
          open={openContactDialog}
          onOpenChange={setOpenContactDialog}
          onAddContact={handleAddContact}
          customerId={selectedCustomerId}
        />
      )}
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
