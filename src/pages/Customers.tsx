
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, Plus, ArrowLeft, Mail, Phone, FileText, Calendar, MessageSquare, 
  File, Image, Folder, Code, PenTool, ShoppingCart, FileCheck, UserPlus,
  Edit, MapPin, ClipboardList, Upload, Grid, List, FileImage, Download, 
  Eye, MoreVertical, User, Tag, Layers
} from "lucide-react";
import { CustomerDialog } from "@/components/quotes/CustomerDialog";
import { useCustomers } from "@/context/CustomersContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddContactDialog, ContactFormValues } from "@/components/customers/AddContactDialog";
import { ContactsList } from "@/components/customers/ContactsList";
import { Contact } from "@/types/customer";
import { EditContactDialog } from "@/components/customers/EditContactDialog";
import { EditCompanyDialog, CompanyFormValues } from "@/components/customers/EditCompanyDialog";
import { EditAddressDialog, AddressFormValues } from "@/components/customers/EditAddressDialog";
import { EditTaxInfoDialog, TaxInfoFormValues } from "@/components/customers/EditTaxInfoDialog";
import { mockArtworkLibrary, ArtworkFile } from "@/types/artwork";
import { IMPRINT_METHODS } from "@/types/imprint";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

// Unified imprint type for customer-specific artwork
interface UnifiedImprint {
  id: string;
  designName: string;
  imprintMethod: string;
  associatedCustomers: Array<{ id: string; name: string }>;
  customerArt: ArtworkFile[];
  productionFiles: ArtworkFile[];
  mockups: ArtworkFile[];
  fileCount: number;
  totalSizeBytes: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export default function Customers() {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const { customers, addContactToCustomer, updateCustomer, updateCustomerContact } = useCustomers();
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Edit dialog states
  const [editContactDialog, setEditContactDialog] = useState(false);
  const [editCompanyDialog, setEditCompanyDialog] = useState(false);
  const [editBillingAddressDialog, setEditBillingAddressDialog] = useState(false);
  const [editShippingAddressDialog, setEditShippingAddressDialog] = useState(false);
  const [editTaxInfoDialog, setEditTaxInfoDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  // Artwork & Files tab states
  const [artworkSearchTerm, setArtworkSearchTerm] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedArtwork, setSelectedArtwork] = useState<UnifiedImprint | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [folderViewOpen, setFolderViewOpen] = useState(false);

  const selectedCustomer = selectedCustomerId 
    ? customers.find(c => c.id === selectedCustomerId) 
    : null;

  // Get customer-specific artwork data
  const customerArtworkLibrary = useMemo(() => {
    if (!selectedCustomerId) return null;
    return mockArtworkLibrary.find(lib => lib.customerId === selectedCustomerId);
  }, [selectedCustomerId]);

  // Create unified imprints list for selected customer
  const customerImprints = useMemo(() => {
    if (!customerArtworkLibrary) return [];
    
    const imprints: UnifiedImprint[] = [];
    customerArtworkLibrary.folders.forEach(folder => {
      folder.artworks.forEach(artwork => {
        imprints.push({
          id: artwork.id,
          designName: artwork.designName,
          imprintMethod: artwork.method,
          associatedCustomers: [{ id: customerArtworkLibrary.customerId, name: customerArtworkLibrary.customerName }],
          customerArt: artwork.customerArt,
          productionFiles: artwork.productionFiles,
          mockups: artwork.mockups,
          fileCount: artwork.fileCount,
          totalSizeBytes: artwork.totalSizeBytes,
          createdAt: artwork.createdAt,
          updatedAt: artwork.updatedAt,
          notes: artwork.description
        });
      });
    });
    return imprints;
  }, [customerArtworkLibrary]);

  // Group customer imprints by method to create folders
  const customerImprintFolders = useMemo(() => {
    const folders = new Map<string, UnifiedImprint[]>();
    
    customerImprints.forEach(imprint => {
      // Apply method filter
      if (selectedMethod !== 'all' && imprint.imprintMethod !== selectedMethod) {
        return;
      }

      // Apply search filter
      if (artworkSearchTerm) {
        const searchLower = artworkSearchTerm.toLowerCase();
        const matchesSearch = (
          imprint.designName.toLowerCase().includes(searchLower) ||
          (imprint.notes && imprint.notes.toLowerCase().includes(searchLower))
        );
        if (!matchesSearch) return;
      }

      const method = imprint.imprintMethod;
      if (!folders.has(method)) {
        folders.set(method, []);
      }
      folders.get(method)!.push(imprint);
    });

    return Array.from(folders.entries()).map(([method, imprints]) => ({
      method,
      imprints,
      count: imprints.length,
      totalSize: imprints.reduce((sum, imprint) => sum + imprint.totalSizeBytes, 0)
    }));
  }, [customerImprints, artworkSearchTerm, selectedMethod]);

  // Get imprints for selected folder
  const folderImprints = useMemo(() => {
    if (!selectedFolder) return [];
    const folder = customerImprintFolders.find(f => f.method === selectedFolder);
    return folder ? folder.imprints : [];
  }, [selectedFolder, customerImprintFolders]);

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

  // Update these handler functions to ensure they pass non-optional values
  const handleEditBillingAddress = (data: AddressFormValues) => {
    if (selectedCustomerId) {
      // Ensure all required fields are present
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
      // Ensure all required fields are present
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
      // Ensure all required fields are present
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
      // Create a partial update for the primary contact fields
      const data = {
        firstName: selectedCustomer.firstName,
        lastName: selectedCustomer.lastName,
        email: selectedCustomer.email,
        phoneNumber: selectedCustomer.phoneNumber
      };
      
      // We'll reuse the company dialog since it contains these fields
      setEditCompanyDialog(true);
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

  // Utility functions for artwork tab
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const handlePreviewArtwork = (artwork: UnifiedImprint) => {
    setSelectedArtwork(artwork);
    setPreviewDialogOpen(true);
  };

  const handleFolderClick = (method: string) => {
    setSelectedFolder(method);
    setFolderViewOpen(true);
  };

  const getCustomerArtworkStats = () => {
    const totalImprints = customerImprints.length;
    const totalSize = customerImprints.reduce((sum, imprint) => sum + imprint.totalSizeBytes, 0);
    const totalFolders = customerImprintFolders.length;
    
    return { totalImprints, totalSize, totalFolders };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
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
                <div className="flex justify-end w-full">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => setEditCompanyDialog(true)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit company</span>
                  </Button>
                </div>
                
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
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Task
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
                      onEditContact={(contact) => {
                        setSelectedContact(contact);
                        setEditContactDialog(true);
                      }}
                      onEditPrimaryContact={handleEditPrimaryContact}
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
                        onClick={() => setEditBillingAddressDialog(true)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit billing address</span>
                      </Button>
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
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Shipping Address</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => setEditShippingAddressDialog(true)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit shipping address</span>
                      </Button>
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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Tax Information</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setEditTaxInfoDialog(true)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit tax information</span>
                    </Button>
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
                  {/* Customer Artwork Header and Stats */}
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">Customer Artwork Library</h3>
                      <p className="text-muted-foreground">
                        Manage artwork files and imprints for {selectedCustomer?.companyName}
                      </p>
                    </div>
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Artwork
                    </Button>
                  </div>

                  {/* Stats Cards */}
                  {(() => {
                    const stats = getCustomerArtworkStats();
                    return (
                      <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Imprints</CardTitle>
                            <FileImage className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.totalImprints}</div>
                            <p className="text-xs text-muted-foreground">
                              Across {stats.totalFolders} method folders
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                            <Layers className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
                            <p className="text-xs text-muted-foreground">
                              Production files & mockups
                            </p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Method Folders</CardTitle>
                            <Folder className="h-4 w-4 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">{stats.totalFolders}</div>
                            <p className="text-xs text-muted-foreground">
                              Imprint methods used
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })()}

                  {/* Filters */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            placeholder="Search customer imprints by name or notes..."
                            value={artworkSearchTerm}
                            onChange={(e) => setArtworkSearchTerm(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                        <select 
                          value={selectedMethod} 
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="w-[180px] h-10 px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          <option value="all">All Methods</option>
                          {IMPRINT_METHODS.map((method) => (
                            <option key={method.value} value={method.value}>
                              {method.label}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-1">
                          <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('grid')}
                          >
                            <Grid className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('list')}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Results Summary */}
                  {!folderViewOpen ? (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {customerImprintFolders.length} folder{customerImprintFolders.length !== 1 ? 's' : ''} found
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setFolderViewOpen(false);
                            setSelectedFolder(null);
                          }}
                          className="gap-2"
                        >
                          ← Back to Folders
                        </Button>
                        <span className="text-muted-foreground">/</span>
                        <span className="font-medium">
                          {IMPRINT_METHODS.find(m => m.value === selectedFolder)?.label || selectedFolder}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {folderImprints.length} imprint{folderImprints.length !== 1 ? 's' : ''} in folder
                      </p>
                    </div>
                  )}

                  {/* Main Content: Folder View vs Imprints View */}
                  {!folderViewOpen ? (
                    // Folders Grid
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {customerImprintFolders.map((folder) => (
                        <Card 
                          key={folder.method} 
                          className="group cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleFolderClick(folder.method)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="p-2 bg-muted rounded-lg">
                                  <Layers className="h-8 w-8 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <CardTitle className="text-lg truncate">
                                    {IMPRINT_METHODS.find(m => m.value === folder.method)?.label || folder.method}
                                  </CardTitle>
                                  <CardDescription className="truncate">
                                    {folder.count} imprint{folder.count !== 1 ? 's' : ''}
                                  </CardDescription>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Files
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download All
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div className="text-center">
                                <div className="font-medium">{folder.count}</div>
                                <div>Imprints</div>
                              </div>
                              <div className="text-center">
                                <div className="font-medium">{formatFileSize(folder.totalSize)}</div>
                                <div>Size</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {customerImprintFolders.length === 0 && (
                        <div className="col-span-full">
                          <Card>
                            <CardContent className="p-6 text-center">
                              <FileImage className="h-16 w-16 mx-auto mb-4 opacity-40" />
                              <p className="text-lg text-muted-foreground">No artwork files found</p>
                              <p className="text-sm text-muted-foreground">Upload some artwork to get started</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Imprints Grid/List within folder
                    viewMode === 'grid' ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {folderImprints.map((imprint) => (
                          <Card 
                            key={imprint.id} 
                            className="group cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => navigate(`/imprint/${imprint.id}`)}
                          >
                            <CardHeader className="pb-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-lg truncate">{imprint.designName}</CardTitle>
                                  <CardDescription className="truncate">
                                    {imprint.fileCount} files • {formatFileSize(imprint.totalSizeBytes)}
                                  </CardDescription>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      handlePreviewArtwork(imprint);
                                    }}>
                                      <Eye className="h-4 w-4 mr-2" />
                                      Preview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/imprint/${imprint.id}`);
                                    }}>
                                      <FileImage className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="text-xs space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Customer Art:</span>
                                  <span>{imprint.customerArt.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Production:</span>
                                  <span>{imprint.productionFiles.length}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Mockups:</span>
                                  <span>{imprint.mockups.length}</span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Last updated: {formatDate(imprint.updatedAt)}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      // List view
                      <Card>
                        <CardContent className="p-0">
                          <div className="divide-y">
                            {folderImprints.map((imprint) => (
                              <div 
                                key={imprint.id} 
                                className="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => navigate(`/imprint/${imprint.id}`)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="p-2 bg-muted rounded-lg">
                                      <FileImage className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <h4 className="font-medium truncate">{imprint.designName}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {imprint.fileCount} files • {formatFileSize(imprint.totalSizeBytes)} • 
                                        Updated {formatDate(imprint.updatedAt)}
                                      </p>
                                      <div className="flex gap-2 mt-1">
                                        <Badge variant="secondary" className="text-xs">
                                          {imprint.customerArt.length} Customer Art
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {imprint.productionFiles.length} Production
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {imprint.mockups.length} Mockups
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        handlePreviewArtwork(imprint);
                                      }}>
                                        <Eye className="h-4 w-4 mr-2" />
                                        Preview
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/imprint/${imprint.id}`);
                                      }}>
                                        <FileImage className="h-4 w-4 mr-2" />
                                        View Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>

                {/* Preview Dialog */}
                <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                  <DialogContent className="max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{selectedArtwork?.designName}</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]">
                      {selectedArtwork && (
                        <Tabs defaultValue="customerArt" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="customerArt">Customer Art ({selectedArtwork.customerArt.length})</TabsTrigger>
                            <TabsTrigger value="production">Production ({selectedArtwork.productionFiles.length})</TabsTrigger>
                            <TabsTrigger value="mockups">Mockups ({selectedArtwork.mockups.length})</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="customerArt" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {selectedArtwork.customerArt.map((file) => (
                                <Card key={file.id} className="p-4">
                                  <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
                                    <FileImage className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                  <h4 className="font-medium text-sm truncate">{file.name}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(file.sizeBytes)}
                                  </p>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="production" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {selectedArtwork.productionFiles.map((file) => (
                                <Card key={file.id} className="p-4">
                                  <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
                                    <File className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                  <h4 className="font-medium text-sm truncate">{file.name}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(file.sizeBytes)}
                                  </p>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="mockups" className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {selectedArtwork.mockups.map((file) => (
                                <Card key={file.id} className="p-4">
                                  <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
                                    <Image className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                  <h4 className="font-medium text-sm truncate">{file.name}</h4>
                                  <p className="text-xs text-muted-foreground">
                                    {formatFileSize(file.sizeBytes)}
                                  </p>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
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

const industries = [
  { id: "tech", name: "Technology" },
  { id: "retail", name: "Retail" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "ecommerce", name: "Ecommerce" },
];
