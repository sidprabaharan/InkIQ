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

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDialog({ open, onOpenChange }: CustomerDialogProps) {
  const [step, setStep] = useState<number>(1);
  
  const industries = [
    { id: "tech", name: "Technology" },
    { id: "retail", name: "Retail" },
    { id: "healthcare", name: "Healthcare" },
    { id: "education", name: "Education" },
    { id: "manufacturing", name: "Manufacturing" },
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
      onOpenChange(false);
    }
  };
  
  const handleDiscard = () => {
    setStep(1);
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
                  <Input placeholder="Enter Company Name" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <Input placeholder="Enter Active Email" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">First name</label>
                  <Input placeholder="Enter First Name" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Last Name</label>
                  <Input placeholder="Enter Last Name" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm mb-1">Phone Number</label>
                  <Input placeholder="Phone Number" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Fax Number</label>
                  <Input placeholder="Enter Fax Number" />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm mb-1">Industry</label>
                <Select>
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
                <Select>
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
              <Input placeholder="Address Line 1" />
              <Input placeholder="Address Line 2" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="City" />
                <Input placeholder="State/Province" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="ZIP Code" />
                <Input placeholder="Country" />
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
              <Input placeholder="Address Line 1" />
              <Input placeholder="Address Line 2" />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="City" />
                <Input placeholder="State/Province" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="ZIP Code" />
                <Input placeholder="Country" />
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
              <Input placeholder="Tax ID" />
              <Input placeholder="Tax Rate (%)" />
              <Input placeholder="Tax Exemption Number (if applicable)" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
  );
}
