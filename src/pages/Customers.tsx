
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AddContactDialog } from "@/components/customers/AddContactDialog";
import { ContactsList } from "@/components/customers/ContactsList";
import { EditAddressDialog } from "@/components/customers/EditAddressDialog";
import { EditCompanyDialog } from "@/components/customers/EditCompanyDialog";
import { EditTaxInfoDialog } from "@/components/customers/EditTaxInfoDialog";
import { 
  Search, Plus, ArrowLeft, Mail, Phone, FileText, Calendar, MessageSquare, 
  File, Image, Folder, Code, PenTool, ShoppingCart, FileCheck, UserPlus,
  Edit, MapPin, ClipboardList
} from "lucide-react";
import { CustomerDialog } from "@/components/quotes/CustomerDialog";
import { useCustomers } from "@/context/CustomersContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";

export default function Customers() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeEditDialog, setActiveEditDialog] = useState<"company" | "address" | "tax" | null>(null);
  const [addContactDialogOpen, setAddContactDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { customers, selectCustomer, selectedCustomer, addCustomer, getCustomerById } = useCustomers();

  useEffect(() => {
    // This effect will run whenever the 'customers' array changes.
    // If there are customers available and no customer is currently selected,
    // it will select the first customer in the list.
    if (customers.length > 0 && !selectedCustomer) {
      selectCustomer(customers[0].id);
    }
  }, [customers, selectCustomer, selectedCustomer]);

  const handleOpenChange = () => {
    setOpen(!open);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredCustomers = customers.filter(customer => {
    const searchTerm = search.toLowerCase();
    return (
      customer.companyName.toLowerCase().includes(searchTerm) ||
      customer.firstName.toLowerCase().includes(searchTerm) ||
      customer.lastName.toLowerCase().includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm)
    );
  });

  const handleCustomerSelect = (customerId: string) => {
    selectCustomer(customerId);
  };

  const handleAddCustomer = (customerData: any) => {
    const newCustomer = addCustomer(customerData);
    selectCustomer(newCustomer.id); // Automatically select the new customer
  };

  const renderCustomerDetails = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="flex flex-col p-4 space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Company Information</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveEditDialog("company")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Company Name:</span> {selectedCustomer.companyName}</p>
              <p className="text-sm"><span className="font-medium">Industry:</span> {selectedCustomer.industry}</p>
              <p className="text-sm"><span className="font-medium">Invoice Owner:</span> {selectedCustomer.invoiceOwner}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Contact</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveEditDialog("company")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{selectedCustomer.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Button>
                <Link to={`/customers/${selectedCustomer.id}/tasks`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Task
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Billing Address</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveEditDialog("address")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Address 1:</span> {selectedCustomer.billingAddress.address1}</p>
              {selectedCustomer.billingAddress.address2 && <p className="text-sm"><span className="font-medium">Address 2:</span> {selectedCustomer.billingAddress.address2}</p>}
              <p className="text-sm"><span className="font-medium">City:</span> {selectedCustomer.billingAddress.city}</p>
              <p className="text-sm"><span className="font-medium">State/Province:</span> {selectedCustomer.billingAddress.stateProvince}</p>
              <p className="text-sm"><span className="font-medium">Zip Code:</span> {selectedCustomer.billingAddress.zipCode}</p>
              <p className="text-sm"><span className="font-medium">Country:</span> {selectedCustomer.billingAddress.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Shipping Address</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveEditDialog("address")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Address 1:</span> {selectedCustomer.shippingAddress.address1}</p>
              {selectedCustomer.shippingAddress.address2 && <p className="text-sm"><span className="font-medium">Address 2:</span> {selectedCustomer.shippingAddress.address2}</p>}
              <p className="text-sm"><span className="font-medium">City:</span> {selectedCustomer.shippingAddress.city}</p>
              <p className="text-sm"><span className="font-medium">State/Province:</span> {selectedCustomer.shippingAddress.stateProvince}</p>
              <p className="text-sm"><span className="font-medium">Zip Code:</span> {selectedCustomer.shippingAddress.zipCode}</p>
              <p className="text-sm"><span className="font-medium">Country:</span> {selectedCustomer.shippingAddress.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Tax Information</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveEditDialog("tax")}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Tax ID:</span> {selectedCustomer.taxInfo.taxId}</p>
              <p className="text-sm"><span className="font-medium">Tax Rate:</span> {selectedCustomer.taxInfo.taxRate}</p>
              <p className="text-sm"><span className="font-medium">Tax Exemption Number:</span> {selectedCustomer.taxInfo.taxExemptionNumber}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Contacts</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setAddContactDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </CardHeader>
          <CardContent>
            <ContactsList 
              contacts={selectedCustomer.contacts} 
              primaryContact={{
                firstName: selectedCustomer.firstName,
                lastName: selectedCustomer.lastName,
                email: selectedCustomer.email,
                phoneNumber: selectedCustomer.phoneNumber
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Customers</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search customers..."
            value={search}
            onChange={handleSearchChange}
          />
          <Button onClick={handleOpenChange}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow
                  key={customer.id}
                  onClick={() => handleCustomerSelect(customer.id)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <TableCell>{customer.companyName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="md:col-span-3">
          {renderCustomerDetails()}
        </div>
      </div>

      <CustomerDialog 
        open={open} 
        onOpenChange={handleOpenChange} 
      />
      
      {activeEditDialog === "company" && selectedCustomer && (
        <EditCompanyDialog 
          open={true} 
          onOpenChange={() => setActiveEditDialog(null)}
          customer={selectedCustomer}
        />
      )}
      
      {activeEditDialog === "address" && selectedCustomer && (
        <EditAddressDialog
          open={true}
          onOpenChange={() => setActiveEditDialog(null)}
          customer={selectedCustomer}
        />
      )}

      {activeEditDialog === "tax" && selectedCustomer && (
        <EditTaxInfoDialog
          open={true}
          onOpenChange={() => setActiveEditDialog(null)}
          customer={selectedCustomer}
        />
      )}

      {selectedCustomer && (
        <AddContactDialog
          open={addContactDialogOpen}
          onOpenChange={setAddContactDialogOpen}
          customerId={selectedCustomer.id}
        />
      )}
    </div>
  );
}
