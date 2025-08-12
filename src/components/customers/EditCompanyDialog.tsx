
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer } from "@/context/CustomersContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the schema for the company form
const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  faxNumber: z.string().optional(),
  invoiceOwner: z.string().optional(),
  // Billing address fields
  billingAddress1: z.string().min(1, "Billing address is required"),
  billingAddress2: z.string().optional(),
  billingCity: z.string().min(1, "Billing city is required"),
  billingStateProvince: z.string().min(1, "Billing state/province is required"),
  billingZipCode: z.string().min(1, "Billing ZIP code is required"),
  billingCountry: z.string().min(1, "Billing country is required"),
  // Shipping address fields
  shippingAddress1: z.string().min(1, "Shipping address is required"),
  shippingAddress2: z.string().optional(),
  shippingCity: z.string().min(1, "Shipping city is required"),
  shippingStateProvince: z.string().min(1, "Shipping state/province is required"),
  shippingZipCode: z.string().min(1, "Shipping ZIP code is required"),
  shippingCountry: z.string().min(1, "Shipping country is required"),
  // Tax info fields
  taxId: z.string().optional(),
  taxRate: z.string().optional(),
  taxExemptionNumber: z.string().optional(),
});

export type CompanyFormValues = z.infer<typeof companySchema>;

interface EditCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCompany: (data: CompanyFormValues) => void;
  customer: Customer;
}

// Mock data for industries
const industries = [
  { id: "tech", name: "Technology" },
  { id: "retail", name: "Retail" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "ecommerce", name: "Ecommerce" },
];

// Mock data for sales representatives (invoice owners)
const salesReps = [
  { id: "rep1", name: "John Doe" },
  { id: "rep2", name: "Jane Smith" },
  { id: "rep3", name: "Mike Johnson" },
  { id: "rep4", name: "Sarah Williams" },
];

export function EditCompanyDialog({ 
  open, 
  onOpenChange,
  onUpdateCompany,
  customer
}: EditCompanyDialogProps) {
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      companyName: customer.companyName,
      industry: customer.industry,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      faxNumber: customer.faxNumber,
      invoiceOwner: customer.invoiceOwner,
      // Billing address
      billingAddress1: customer.billingAddress.address1,
      billingAddress2: customer.billingAddress.address2,
      billingCity: customer.billingAddress.city,
      billingStateProvince: customer.billingAddress.stateProvince,
      billingZipCode: customer.billingAddress.zipCode,
      billingCountry: customer.billingAddress.country,
      // Shipping address
      shippingAddress1: customer.shippingAddress.address1,
      shippingAddress2: customer.shippingAddress.address2,
      shippingCity: customer.shippingAddress.city,
      shippingStateProvince: customer.shippingAddress.stateProvince,
      shippingZipCode: customer.shippingAddress.zipCode,
      shippingCountry: customer.shippingAddress.country,
      // Tax info
      taxId: customer.taxInfo.taxId,
      taxRate: customer.taxInfo.taxRate,
      taxExemptionNumber: customer.taxInfo.taxExemptionNumber,
    },
  });

  const handleSubmit = (data: CompanyFormValues) => {
    onUpdateCompany(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company Information</DialogTitle>
          <DialogDescription>
            Update company details, addresses, and tax information.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="tax">Tax Info</TabsTrigger>
              </TabsList>
              
              <TabsContent value="company" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry.id} value={industry.id}>
                                {industry.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="faxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fax Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter fax number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="invoiceOwner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Owner</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sales representative" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {salesReps.map((rep) => (
                            <SelectItem key={rep.id} value={rep.id}>
                              {rep.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="billingAddress1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingAddress2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 2 (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingStateProvince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state/province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billingZipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ZIP code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="billingCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="shippingAddress1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="shippingAddress2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address line 2 (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingStateProvince"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state/province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="shippingZipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ZIP code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shippingCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="tax" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tax ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Rate (%)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tax rate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxExemptionNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax Exemption Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter tax exemption number (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
