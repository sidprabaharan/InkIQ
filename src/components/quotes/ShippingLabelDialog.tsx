import React, { useState, useEffect } from "react";
import { X, Calendar, ChevronDown, Truck, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ShippingLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  customerInfo?: {
    name: string;
    companyName?: string;
    address1: string;
    address2?: string;
    city: string;
    stateProvince: string;
    zipCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
}

interface PackageDetails {
  length: string;
  width: string;
  height: string;
  weight: string;
  description: string;
  specialHandling: boolean;
}

interface FreightQuote {
  id: string;
  carrier: string;
  service: string;
  transitTime: string;
  price: number;
  logo?: string;
}

export function ShippingLabelDialog({
  open,
  onOpenChange,
  quoteId,
  customerInfo
}: ShippingLabelDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<"form" | "quotes">("form");
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [measurementSystem, setMeasurementSystem] = useState<"imperial" | "metric">("imperial");
  const [pickupOption, setPickupOption] = useState<"now" | "later" | "drop">("now");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [numberOfBoxes, setNumberOfBoxes] = useState<string>("1");
  const [saveAsDefault, setSaveAsDefault] = useState<boolean>(false);
  const [allSameBoxes, setAllSameBoxes] = useState<boolean>(false);
  
  // From (Pickup) address - could be pre-filled with company information
  const [fromCompany, setFromCompany] = useState<string>("Print Shop Name");
  const [fromStreet, setFromStreet] = useState<string>("123 Printer Lane");
  const [fromCity, setFromCity] = useState<string>("Philadelphia");
  const [fromState, setFromState] = useState<string>("PA");
  const [fromZip, setFromZip] = useState<string>("19019");
  const [fromCountry, setFromCountry] = useState<string>("US");
  
  // To (Shipping) address - pre-filled with customer information
  const [toName, setToName] = useState<string>(customerInfo?.name || "");
  const [toCompany, setToCompany] = useState<string>(customerInfo?.companyName || "");
  const [toStreet, setToStreet] = useState<string>(customerInfo?.address1 || "");
  const [toCity, setToCity] = useState<string>(customerInfo?.city || "");
  const [toState, setToState] = useState<string>(customerInfo?.stateProvince || "");
  const [toZip, setToZip] = useState<string>(customerInfo?.zipCode || "");
  const [toCountry, setToCountry] = useState<string>(customerInfo?.country || "US");
  
  // Package details
  const [packages, setPackages] = useState<PackageDetails[]>([{
    length: "12",
    width: "12",
    height: "12",
    weight: "2",
    description: "",
    specialHandling: false
  }]);
  
  // Same as above states for each package
  const [sameAsAbove, setSameAsAbove] = useState<boolean[]>([]);
  
  // Update packages array when number of boxes changes
  useEffect(() => {
    const boxCount = parseInt(numberOfBoxes) || 1;
    if (packages.length < boxCount) {
      // Add more packages
      const newPackages = [...packages];
      const newSameAsAbove = [...sameAsAbove];
      
      for (let i = packages.length; i < boxCount; i++) {
        if (allSameBoxes && packages.length > 0) {
          // If "All the Same" is checked, copy values from the first package
          newPackages.push({...packages[0]});
        } else if (i > 0 && newSameAsAbove[i-1]) {
          // If the previous package had "Same as Above" checked, copy its values
          newPackages.push({...newPackages[i-1]});
        } else {
          // Otherwise, use default values
          newPackages.push({
            length: "12",
            width: "12",
            height: "12",
            weight: "2",
            description: "",
            specialHandling: false
          });
        }
        newSameAsAbove.push(false);
      }
      setPackages(newPackages);
      setSameAsAbove(newSameAsAbove);
    } else if (packages.length > boxCount) {
      // Remove excess packages
      setPackages(packages.slice(0, boxCount));
      setSameAsAbove(sameAsAbove.slice(0, boxCount));
    }
  }, [numberOfBoxes, allSameBoxes]);
  
  // Handle "All the Same" checkbox change
  useEffect(() => {
    if (allSameBoxes && packages.length > 1) {
      const firstPackage = packages[0];
      const updatedPackages = packages.map(() => ({...firstPackage}));
      setPackages(updatedPackages);
    }
  }, [allSameBoxes]);
  
  // Pickup details
  const [contactName, setContactName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [pickupLocation, setPickupLocation] = useState<string>("");
  const [readyTimeHour, setReadyTimeHour] = useState<string>("HH");
  const [readyTimeMinute, setReadyTimeMinute] = useState<string>("MM");
  const [readyTimePeriod, setReadyTimePeriod] = useState<string>("--");
  const [closingTimeHour, setClosingTimeHour] = useState<string>("HH");
  const [closingTimeMinute, setClosingTimeMinute] = useState<string>("MM");
  const [closingTimePeriod, setClosingTimePeriod] = useState<string>("--");
  const [pickupInstructions, setPickupInstructions] = useState<string>("");
  
  const handleUpdatePackage = (index: number, field: keyof PackageDetails, value: string | boolean) => {
    const updatedPackages = [...packages];
    updatedPackages[index] = {
      ...updatedPackages[index],
      [field]: value
    };
    
    // If "All the Same" is checked, update all packages with the same value
    if (allSameBoxes && index === 0) {
      setPackages(updatedPackages.map(() => ({...updatedPackages[0]})));
    } else {
      setPackages(updatedPackages);
      
      // If "Same as Above" is checked for any subsequent packages, update them
      if (index > 0) {
        const newSameAsAbove = [...sameAsAbove];
        for (let i = index + 1; i < packages.length; i++) {
          if (newSameAsAbove[i]) {
            updatedPackages[i] = {...updatedPackages[i-1]};
          } else {
            break; // Stop propagation when we hit a package that's not "Same as Above"
          }
        }
        setPackages(updatedPackages);
      }
    }
  };
  
  const handleSameAsAboveChange = (index: number, checked: boolean) => {
    if (index <= 0) return; // First package can't be "Same as Above"
    
    const newSameAsAbove = [...sameAsAbove];
    newSameAsAbove[index] = checked;
    setSameAsAbove(newSameAsAbove);
    
    if (checked) {
      // Copy values from the package above
      const updatedPackages = [...packages];
      updatedPackages[index] = {...updatedPackages[index-1]};
      setPackages(updatedPackages);
    }
  };
  
  const mockFreightQuotes: FreightQuote[] = [
    { id: "ups-ground", carrier: "UPS", service: "Ground", transitTime: "3-5 business days", price: 24.99, logo: "/lovable-uploads/4b14e34b-748e-45d1-9671-629495df105d.png" },
    { id: "ups-2day", carrier: "UPS", service: "2-Day Air", transitTime: "2 business days", price: 45.99, logo: "/lovable-uploads/4b14e34b-748e-45d1-9671-629495df105d.png" },
    { id: "ups-overnight", carrier: "UPS", service: "Next Day Air", transitTime: "1 business day", price: 89.99, logo: "/lovable-uploads/4b14e34b-748e-45d1-9671-629495df105d.png" },
    { id: "fedex-ground", carrier: "FedEx", service: "Ground", transitTime: "3-5 business days", price: 26.99, logo: "/lovable-uploads/a3c6309c-2b25-460d-b162-012808bc9c81.png" },
    { id: "fedex-2day", carrier: "FedEx", service: "2-Day", transitTime: "2 business days", price: 48.99, logo: "/lovable-uploads/a3c6309c-2b25-460d-b162-012808bc9c81.png" },
    { id: "fedex-overnight", carrier: "FedEx", service: "Overnight", transitTime: "1 business day", price: 92.99, logo: "/lovable-uploads/a3c6309c-2b25-460d-b162-012808bc9c81.png" },
    { id: "usps-ground", carrier: "USPS", service: "Ground Advantage", transitTime: "3-5 business days", price: 18.99, logo: "/lovable-uploads/b49b4dff-1d60-4969-be07-24a6281e29c1.png" },
    { id: "dhl-express", carrier: "DHL", service: "Express", transitTime: "1-2 business days", price: 78.99, logo: "/lovable-uploads/9a2abfa2-77b1-4f22-b100-c9d9c1653a71.png" },
  ];

  const handleGetQuotes = () => {
    setStep("quotes");
    toast({
      title: "Freight Quotes Retrieved",
      description: "Found 8 shipping options from multiple carriers",
    });
  };
  
  const handleSelectQuote = (quoteId: string) => {
    setSelectedQuote(quoteId);
  };

  const handleCreateLabel = () => {
    const quote = mockFreightQuotes.find(q => q.id === selectedQuote);
    if (quote) {
      toast({
        title: "Shipping Label Created",
        description: `Created ${quote.carrier} ${quote.service} label for $${quote.price.toFixed(2)}`,
      });
      onOpenChange(false);
      setStep("form");
      setSelectedQuote(null);
    }
  };

  const handleBackToForm = () => {
    setStep("form");
    setSelectedQuote(null);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl flex items-center gap-2">
            {step === "quotes" && (
              <Button variant="ghost" size="sm" onClick={handleBackToForm} className="mr-2 p-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Truck className="h-5 w-5" />
            {step === "form" ? `Get Shipping Quotes - Order #${quoteId}` : `Select Shipping Option - Order #${quoteId}`}
          </DialogTitle>
        </DialogHeader>
        
        {step === "form" ? (
        <div className="p-6 pt-2 space-y-6">
          {/* Measurement System Selection */}
          <div className="flex items-center gap-6">
            <span className="font-medium">Measurement System:</span>
            <RadioGroup 
              value={measurementSystem} 
              onValueChange={(value) => setMeasurementSystem(value as "imperial" | "metric")}
              className="flex items-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="imperial" id="imperial" />
                <Label htmlFor="imperial">Imperial (in & lbs)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="metric" id="metric" />
                <Label htmlFor="metric">Metric (cm & kg)</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* From (Pickup Location) */}
          <div className="border rounded-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">From (Pickup Location)</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromCompany">Company/Name</Label>
                <Input 
                  id="fromCompany" 
                  value={fromCompany} 
                  onChange={(e) => setFromCompany(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fromStreet">Street Address</Label>
                <Input 
                  id="fromStreet" 
                  value={fromStreet} 
                  onChange={(e) => setFromStreet(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromCity">City</Label>
                <Input 
                  id="fromCity" 
                  value={fromCity} 
                  onChange={(e) => setFromCity(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fromState">State/Province</Label>
                <Input 
                  id="fromState" 
                  value={fromState} 
                  onChange={(e) => setFromState(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromZip">ZIP/Postal Code</Label>
                <Input 
                  id="fromZip" 
                  value={fromZip} 
                  onChange={(e) => setFromZip(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fromCountry">Country</Label>
                <Input 
                  id="fromCountry" 
                  value={fromCountry} 
                  onChange={(e) => setFromCountry(e.target.value)} 
                />
              </div>
            </div>
          </div>
          
          {/* To (Shipping Address) */}
          <div className="border rounded-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">To (Shipping Address)</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="toName">Customer Name</Label>
                <Input 
                  id="toName" 
                  value={toName || (customerInfo?.companyName || "")} 
                  onChange={(e) => setToName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toStreet">Street Address</Label>
                <Input 
                  id="toStreet" 
                  value={toStreet} 
                  onChange={(e) => setToStreet(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="toCity">City</Label>
                <Input 
                  id="toCity" 
                  value={toCity} 
                  onChange={(e) => setToCity(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toState">State/Province</Label>
                <Input 
                  id="toState" 
                  value={toState} 
                  onChange={(e) => setToState(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="toZip">ZIP/Postal Code</Label>
                <Input 
                  id="toZip" 
                  value={toZip} 
                  onChange={(e) => setToZip(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toCountry">Country</Label>
                <Input 
                  id="toCountry" 
                  value={toCountry} 
                  onChange={(e) => setToCountry(e.target.value)} 
                />
              </div>
            </div>
          </div>
          
          {/* Package Details */}
          <div className="border rounded-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Package Details</h2>
            
            <div className="space-y-2 max-w-[200px]">
              <Label htmlFor="numberOfBoxes">Number of Boxes</Label>
              <Input
                id="numberOfBoxes"
                type="number"
                value={numberOfBoxes}
                onChange={(e) => setNumberOfBoxes(e.target.value)}
                min="1"
                max="20"
              />
            </div>
            
            {parseInt(numberOfBoxes) > 1 && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="allSameBoxes" 
                  checked={allSameBoxes} 
                  onCheckedChange={(checked) => setAllSameBoxes(!!checked)} 
                />
                <Label htmlFor="allSameBoxes">All boxes are the same size and weight</Label>
              </div>
            )}
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="p-2">#</th>
                    <th className="p-2">LENGTH {measurementSystem === "imperial" ? "(IN)" : "(CM)"}</th>
                    <th className="p-2">WIDTH {measurementSystem === "imperial" ? "(IN)" : "(CM)"}</th>
                    <th className="p-2">HEIGHT {measurementSystem === "imperial" ? "(IN)" : "(CM)"}</th>
                    <th className="p-2">WEIGHT {measurementSystem === "imperial" ? "(LBS)" : "(KG)"}</th>
                    <th className="p-2">DESCRIPTION</th>
                    <th className="p-2">SPECIAL HANDLING</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        {index + 1}
                        {index > 0 && !allSameBoxes && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Checkbox 
                              id={`sameAsAbove-${index}`} 
                              checked={sameAsAbove[index]} 
                              onCheckedChange={(checked) => handleSameAsAboveChange(index, !!checked)} 
                              disabled={allSameBoxes}
                            />
                            <Label htmlFor={`sameAsAbove-${index}`} className="text-xs">Same as Above</Label>
                          </div>
                        )}
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={pkg.length} 
                          onChange={(e) => handleUpdatePackage(index, "length", e.target.value)} 
                          disabled={index > 0 && (allSameBoxes || sameAsAbove[index])}
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={pkg.width} 
                          onChange={(e) => handleUpdatePackage(index, "width", e.target.value)} 
                          disabled={index > 0 && (allSameBoxes || sameAsAbove[index])}
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={pkg.height} 
                          onChange={(e) => handleUpdatePackage(index, "height", e.target.value)} 
                          disabled={index > 0 && (allSameBoxes || sameAsAbove[index])}
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={pkg.weight} 
                          onChange={(e) => handleUpdatePackage(index, "weight", e.target.value)} 
                          disabled={index > 0 && (allSameBoxes || sameAsAbove[index])}
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          placeholder="Describe the item(s)" 
                          value={pkg.description} 
                          onChange={(e) => handleUpdatePackage(index, "description", e.target.value)} 
                          disabled={index > 0 && (allSameBoxes || sameAsAbove[index])}
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Checkbox 
                          id={`specialHandling-${index}`} 
                          checked={pkg.specialHandling} 
                          onCheckedChange={(checked) => handleUpdatePackage(index, "specialHandling", !!checked)} 
                          disabled={index > 0 && (allSameBoxes || sameAsAbove[index])}
                        />
                        <Label htmlFor={`specialHandling-${index}`} className="ml-2">Required</Label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Ready for Pickup */}
          <div className="border rounded-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Ready for Pickup</h2>
            
            <RadioGroup 
              value={pickupOption} 
              onValueChange={(value) => setPickupOption(value as "now" | "later" | "drop")}
              className="flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="pickup-now" />
                <Label htmlFor="pickup-now">Schedule pickup now</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="later" id="pickup-later" />
                <Label htmlFor="pickup-later">Schedule pickup later</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="drop" id="drop-off" />
                <Label htmlFor="drop-off">I will drop off the package</Label>
              </div>
            </RadioGroup>
            
            <p className="text-gray-500 italic text-sm">Please note that carrier pickups are not guaranteed.</p>
            
            {pickupOption !== "drop" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !pickupDate && "text-muted-foreground"
                          )}
                        >
                          {pickupDate ? format(pickupDate, "PP") : "Pick a date"}
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={pickupDate}
                          onSelect={setPickupDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input 
                      id="contactName" 
                      value={contactName} 
                      onChange={(e) => setContactName(e.target.value)} 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input 
                      id="phoneNumber" 
                      value={phoneNumber} 
                      onChange={(e) => setPhoneNumber(e.target.value)} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pickupLocation">Pickup Location</Label>
                    <Select value={pickupLocation} onValueChange={setPickupLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="front-door">Front Door</SelectItem>
                        <SelectItem value="back-door">Back Door</SelectItem>
                        <SelectItem value="reception">Reception</SelectItem>
                        <SelectItem value="shipping-dept">Shipping Department</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ready Time</Label>
                    <div className="flex items-center space-x-1">
                      <Input 
                        className="w-16" 
                        placeholder="HH" 
                        value={readyTimeHour}
                        onChange={(e) => setReadyTimeHour(e.target.value)}
                      />
                      <span>:</span>
                      <Input 
                        className="w-16" 
                        placeholder="MM" 
                        value={readyTimeMinute}
                        onChange={(e) => setReadyTimeMinute(e.target.value)}
                      />
                      <Select value={readyTimePeriod} onValueChange={setReadyTimePeriod}>
                        <SelectTrigger className="w-16">
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Closing Time</Label>
                    <div className="flex items-center space-x-1">
                      <Input 
                        className="w-16" 
                        placeholder="HH" 
                        value={closingTimeHour}
                        onChange={(e) => setClosingTimeHour(e.target.value)}
                      />
                      <span>:</span>
                      <Input 
                        className="w-16" 
                        placeholder="MM" 
                        value={closingTimeMinute}
                        onChange={(e) => setClosingTimeMinute(e.target.value)}
                      />
                      <Select value={closingTimePeriod} onValueChange={setClosingTimePeriod}>
                        <SelectTrigger className="w-16">
                          <SelectValue placeholder="--" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pickupInstructions">Pickup Instructions (optional)</Label>
                  <Textarea 
                    id="pickupInstructions" 
                    placeholder="Add special instructions for the driver" 
                    value={pickupInstructions}
                    onChange={(e) => setPickupInstructions(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="saveAsDefault" 
                    checked={saveAsDefault} 
                    onCheckedChange={(checked) => setSaveAsDefault(!!checked)} 
                  />
                  <Label htmlFor="saveAsDefault">Save as default</Label>
                </div>
              </>
            )}
          </div>
          
          <p className="text-gray-500 text-sm">This will create a shipping label using UPS shipping services.</p>
        </div>
        ) : (
        <div className="p-6 pt-2 space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Select your preferred shipping option from the quotes below:
          </div>
          
          <div className="space-y-3">
            {mockFreightQuotes.map((quote) => (
              <div 
                key={quote.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedQuote === quote.id 
                    ? "border-2 border-primary bg-primary/5" 
                    : "border border-border hover:shadow-md hover:border-muted-foreground/30"
                }`}
                onClick={() => handleSelectQuote(quote.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 flex items-center justify-center">
                      {quote.logo ? (
                        <img 
                          src={quote.logo} 
                          alt={quote.carrier} 
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded flex items-center justify-center text-xs font-medium">
                          {quote.carrier}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{quote.service}</div>
                      <div className="text-sm text-muted-foreground">{quote.transitTime}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${quote.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        )}
        
        <DialogFooter className="p-6 pt-0 flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === "form" ? (
            <Button onClick={handleGetQuotes} className="gap-2">
              <Truck className="h-4 w-4" />
              Get Shipping Prices
            </Button>
          ) : (
            <Button 
              onClick={handleCreateLabel} 
              disabled={!selectedQuote}
              className="gap-2"
            >
              <Truck className="h-4 w-4" />
              Create Shipping Label
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
