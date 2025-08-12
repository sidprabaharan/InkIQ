
import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useCustomers } from "@/context/CustomersContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDialog({ open, onOpenChange }: CustomerDialogProps) {
  const { customers, addCustomer, selectCustomer } = useCustomers();
  const [step, setStep] = useState<number>(1);
  const [duplicateOpen, setDuplicateOpen] = useState(false);
  const [existingCustomerId, setExistingCustomerId] = useState<string | null>(null);
  
  // Form state
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [faxNumber, setFaxNumber] = useState("");
  const [industry, setIndustry] = useState("");
  const [invoiceOwner, setInvoiceOwner] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  
  // Billing address
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingStateProvince, setBillingStateProvince] = useState("");
  const [billingZipCode, setBillingZipCode] = useState("");
  const [billingCountry, setBillingCountry] = useState("");
  
  // Shipping address
  const [shippingAddress1, setShippingAddress1] = useState("");
  const [shippingAddress2, setShippingAddress2] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingStateProvince, setShippingStateProvince] = useState("");
  const [shippingZipCode, setShippingZipCode] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");
  
  // Tax information
  const [taxId, setTaxId] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [taxExemptionNumber, setTaxExemptionNumber] = useState("");
  
  const industries = [
    { id: "tech", name: "Technology" },
    { id: "retail", name: "Retail" },
    { id: "healthcare", name: "Healthcare" },
    { id: "education", name: "Education" },
    { id: "manufacturing", name: "Manufacturing" },
    { id: "ecommerce", name: "Ecommerce" },
  ];
  
  const salesReps = [
    { id: "rep1", name: "John Doe" },
    { id: "rep2", name: "Jane Smith" },
    { id: "rep3", name: "Mike Johnson" },
    { id: "rep4", name: "Sarah Williams" },
  ];
  
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Submit the form
      submitCustomerForm();
    }
  };
  
  const submitCustomerForm = () => {
    const normalized = companyName.trim().toLowerCase();
    const existing = customers.find(c => c.companyName.trim().toLowerCase() === normalized);
    if (existing) {
      setExistingCustomerId(existing.id);
      setDuplicateOpen(true);
      return;
    }

    const newCustomer = addCustomer({
      companyName,
      email,
      firstName,
      lastName,
      phoneNumber,
      faxNumber,
      industry,
      invoiceOwner,
      jobTitle,
      department,
      billingAddress: {
        address1: billingAddress1,
        address2: billingAddress2,
        city: billingCity,
        stateProvince: billingStateProvince,
        zipCode: billingZipCode,
        country: billingCountry,
      },
      shippingAddress: {
        address1: shippingAddress1,
        address2: shippingAddress2,
        city: shippingCity,
        stateProvince: shippingStateProvince,
        zipCode: shippingZipCode,
        country: shippingCountry,
      },
      taxInfo: {
        taxId,
        taxRate,
        taxExemptionNumber,
      }
    });

    selectCustomer(newCustomer.id);
    resetForm();
    onOpenChange(false);
    toast.success("Customer added successfully");
  };
  
  const resetForm = () => {
    setStep(1);
    setCompanyName("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setFaxNumber("");
    setIndustry("");
    setInvoiceOwner("");
    setJobTitle("");
    setDepartment("");
    setBillingAddress1("");
    setBillingAddress2("");
    setBillingCity("");
    setBillingStateProvince("");
    setBillingZipCode("");
    setBillingCountry("");
    setShippingAddress1("");
    setShippingAddress2("");
    setShippingCity("");
    setShippingStateProvince("");
    setShippingZipCode("");
    setShippingCountry("");
    setTaxId("");
    setTaxRate("");
    setTaxExemptionNumber("");
  };
  
  const handleDiscard = () => {
    resetForm();
    onOpenChange(false);
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mt-6 mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div 
              className={`rounded-full flex items-center justify-center h-8 w-8 ${
                stepNumber === step 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {stepNumber}
            </div>
            
            {stepNumber < 4 && (
              <div className="w-20 h-[1px] bg-gray-200"></div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-medium mb-4 text-blue-600">
                General Information
                <span className="text-gray-500 ml-4 font-normal">Step 1</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Company Name</label>
                  <Input 
                    placeholder="Enter Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <Input 
                    placeholder="Enter Active Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">First name</label>
                  <Input 
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Last Name</label>
                  <Input 
                    placeholder="Enter Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Phone Number</label>
                  <Input 
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Fax Number</label>
                  <Input 
                    placeholder="Enter Fax Number"
                    value={faxNumber}
                    onChange={(e) => setFaxNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Job Title</label>
                  <Input 
                    placeholder="Enter Job Title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Department</label>
                  <Input 
                    placeholder="Enter Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1">Industry</label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry.id} value={industry.id}>
                        {industry.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1">Invoice Owner</label>
                <Select value={invoiceOwner} onValueChange={setInvoiceOwner}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Sales Representative" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesReps.map((rep) => (
                      <SelectItem key={rep.id} value={rep.id}>
                        {rep.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-base font-medium mb-4 text-blue-600">
              Billing Information
              <span className="text-gray-500 ml-4 font-normal">Step 2</span>
            </h3>
            <div className="space-y-4">
              <Input 
                placeholder="Address Line 1"
                value={billingAddress1}
                onChange={(e) => setBillingAddress1(e.target.value)}
              />
              <Input 
                placeholder="Address Line 2"
                value={billingAddress2}
                onChange={(e) => setBillingAddress2(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="City"
                  value={billingCity}
                  onChange={(e) => setBillingCity(e.target.value)}
                />
                <Input 
                  placeholder="State/Province"
                  value={billingStateProvince}
                  onChange={(e) => setBillingStateProvince(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="ZIP Code"
                  value={billingZipCode}
                  onChange={(e) => setBillingZipCode(e.target.value)}
                />
                <Input 
                  placeholder="Country"
                  value={billingCountry}
                  onChange={(e) => setBillingCountry(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h3 className="text-base font-medium mb-4 text-blue-600">
              Shipping Details
              <span className="text-gray-500 ml-4 font-normal">Step 3</span>
            </h3>
            <div className="space-y-4">
              <Input 
                placeholder="Address Line 1"
                value={shippingAddress1}
                onChange={(e) => setShippingAddress1(e.target.value)}
              />
              <Input 
                placeholder="Address Line 2"
                value={shippingAddress2}
                onChange={(e) => setShippingAddress2(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="City"
                  value={shippingCity}
                  onChange={(e) => setShippingCity(e.target.value)}
                />
                <Input 
                  placeholder="State/Province"
                  value={shippingStateProvince}
                  onChange={(e) => setShippingStateProvince(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="ZIP Code"
                  value={shippingZipCode}
                  onChange={(e) => setShippingZipCode(e.target.value)}
                />
                <Input 
                  placeholder="Country"
                  value={shippingCountry}
                  onChange={(e) => setShippingCountry(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h3 className="text-base font-medium mb-4 text-blue-600">
              Tax Information
              <span className="text-gray-500 ml-4 font-normal">Step 4</span>
            </h3>
            <div className="space-y-4">
              <Input 
                placeholder="Tax ID"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
              />
              <Input 
                placeholder="Tax Rate (%)"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
              <Input 
                placeholder="Tax Exemption Number (if applicable)"
                value={taxExemptionNumber}
                onChange={(e) => setTaxExemptionNumber(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Add New Customer</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        {renderStepIndicator()}
        
        {renderStepContent()}
        
        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={handleDiscard}
          >
            Discard
          </Button>
          <Button
            onClick={handleNextStep}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {step === 4 ? "Submit" : "Next Step"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={duplicateOpen} onOpenChange={setDuplicateOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Duplicate company name</AlertDialogTitle>
          <AlertDialogDescription>
            A customer with the same company name already exists. Do you want to use the existing record instead, or create a separate customer with the same name?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDuplicateOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (existingCustomerId) {
                selectCustomer(existingCustomerId);
              }
              setDuplicateOpen(false);
              onOpenChange(false);
              toast.message("Using existing customer");
            }}
          >
            Use existing
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => {
              setDuplicateOpen(false);
              // Proceed with creation ignoring duplicate
              const newCustomer = addCustomer({
                companyName,
                email,
                firstName,
                lastName,
                phoneNumber,
                faxNumber,
                industry,
                invoiceOwner,
                jobTitle,
                department,
                billingAddress: {
                  address1: billingAddress1,
                  address2: billingAddress2,
                  city: billingCity,
                  stateProvince: billingStateProvince,
                  zipCode: billingZipCode,
                  country: billingCountry,
                },
                shippingAddress: {
                  address1: shippingAddress1,
                  address2: shippingAddress2,
                  city: shippingCity,
                  stateProvince: shippingStateProvince,
                  zipCode: shippingZipCode,
                  country: shippingCountry,
                },
                taxInfo: { taxId, taxRate, taxExemptionNumber },
              });
              selectCustomer(newCustomer.id);
              resetForm();
              onOpenChange(false);
              toast.success("Customer added successfully");
            }}
          >
            Create separate
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
