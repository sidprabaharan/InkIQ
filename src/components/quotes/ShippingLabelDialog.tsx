
import React, { useState, useEffect } from "react";
import { X, Calendar, ChevronDown, Truck } from "lucide-react";
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

export function ShippingLabelDialog({
  open,
  onOpenChange,
  quoteId,
  customerInfo
}: ShippingLabelDialogProps) {
  const { toast } = useToast();
  const [measurementSystem, setMeasurementSystem] = useState<"imperial" | "metric">("imperial");
  const [pickupOption, setPickupOption] = useState<"now" | "later" | "drop">("now");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [numberOfBoxes, setNumberOfBoxes] = useState<string>("1");
  const [saveAsDefault, setSaveAsDefault] = useState<boolean>(false);
  
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
  
  // Update packages array when number of boxes changes
  useEffect(() => {
    const boxCount = parseInt(numberOfBoxes) || 1;
    if (packages.length < boxCount) {
      // Add more packages
      const newPackages = [...packages];
      for (let i = packages.length; i < boxCount; i++) {
        newPackages.push({
          length: "12",
          width: "12",
          height: "12",
          weight: "2",
          description: "",
          specialHandling: false
        });
      }
      setPackages(newPackages);
    } else if (packages.length > boxCount) {
      // Remove excess packages
      setPackages(packages.slice(0, boxCount));
    }
  }, [numberOfBoxes]);
  
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
    setPackages(updatedPackages);
  };
  
  const handleCreateLabel = () => {
    toast({
      title: "Shipping Label Created",
      description: `A shipping label has been created for Quote #${quoteId}`,
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Create Shipping Label - Order #{quoteId}
          </DialogTitle>
        </DialogHeader>
        
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
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={pkg.length} 
                          onChange={(e) => handleUpdatePackage(index, "length", e.target.value)} 
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={pkg.width} 
                          onChange={(e) => handleUpdatePackage(index, "width", e.target.value)} 
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={pkg.height} 
                          onChange={(e) => handleUpdatePackage(index, "height", e.target.value)} 
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={pkg.weight} 
                          onChange={(e) => handleUpdatePackage(index, "weight", e.target.value)} 
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          placeholder="Describe the item(s)" 
                          value={pkg.description} 
                          onChange={(e) => handleUpdatePackage(index, "description", e.target.value)} 
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Checkbox 
                          id={`specialHandling-${index}`} 
                          checked={pkg.specialHandling} 
                          onCheckedChange={(checked) => handleUpdatePackage(index, "specialHandling", checked as boolean)} 
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
                    onCheckedChange={(checked) => setSaveAsDefault(checked as boolean)} 
                  />
                  <Label htmlFor="saveAsDefault">Save as default</Label>
                </div>
              </>
            )}
          </div>
          
          <p className="text-gray-500 text-sm">This will create a shipping label using UPS shipping services.</p>
        </div>
        
        <DialogFooter className="p-6 pt-0 flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateLabel} className="gap-2">
            <Truck className="h-4 w-4" />
            Create Shipping Label
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
