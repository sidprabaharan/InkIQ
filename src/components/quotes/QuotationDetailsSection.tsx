
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuoteDetails } from "@/components/quotes/QuoteData";

interface QuotationDetailsSectionProps {
  initialDetails?: QuoteDetails;
}

export function QuotationDetailsSection({ initialDetails }: QuotationDetailsSectionProps) {
  const [owner, setOwner] = useState<string>(initialDetails?.owner || "");
  const [deliveryMethod, setDeliveryMethod] = useState<string>(initialDetails?.deliveryMethod || "");
  const [poNumber, setPoNumber] = useState<string>("");
  const [created, setCreated] = useState<Date | undefined>(undefined);
  const [productionDueDate, setProductionDueDate] = useState<Date | undefined>(undefined);
  const [customerDueDate, setCustomerDueDate] = useState<Date | undefined>(undefined);
  const [paymentDueDate, setPaymentDueDate] = useState<Date | undefined>(undefined);
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(undefined);

  // Set initial values when component mounts
  useEffect(() => {
    if (initialDetails) {
      setOwner(initialDetails.owner);
      setDeliveryMethod(initialDetails.deliveryMethod);
      
      if (initialDetails.productionDueDate) {
        const prodDate = new Date(initialDetails.productionDueDate);
        if (!isNaN(prodDate.getTime())) {
          setProductionDueDate(prodDate);
        }
      }
      
      if (initialDetails.paymentDueDate) {
        const payDate = new Date(initialDetails.paymentDueDate);
        if (!isNaN(payDate.getTime())) {
          setPaymentDueDate(payDate);
        }
      }
      
      if (initialDetails.invoiceDate) {
        const invDate = new Date(initialDetails.invoiceDate);
        if (!isNaN(invDate.getTime())) {
          setInvoiceDate(invDate);
        }
      }
    }
  }, [initialDetails]);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Quotation Details</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select value={owner} onValueChange={setOwner}>
            <SelectTrigger>
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner1">Owner 1</SelectItem>
              <SelectItem value="owner2">Owner 2</SelectItem>
            </SelectContent>
          </Select>
          <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Delivery Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="method1">Method 1</SelectItem>
              <SelectItem value="method2">Method 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input 
          placeholder="PO Number" 
          value={poNumber}
          onChange={(e) => setPoNumber(e.target.value)}
        />
        
        {/* Created Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !created && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {created ? format(created, "PPP") : <span>Created</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={created}
              onSelect={setCreated}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        {/* Production Due Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !productionDueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {productionDueDate ? format(productionDueDate, "PPP") : <span>Production Due Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={productionDueDate}
              onSelect={setProductionDueDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        {/* Customer Due Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !customerDueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {customerDueDate ? format(customerDueDate, "PPP") : <span>Customer Due Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={customerDueDate}
              onSelect={setCustomerDueDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        {/* Payment Due Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !paymentDueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {paymentDueDate ? format(paymentDueDate, "PPP") : <span>Payment Due Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={paymentDueDate}
              onSelect={setPaymentDueDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        
        {/* Invoice Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !invoiceDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {invoiceDate ? format(invoiceDate, "PPP") : <span>Invoice Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={invoiceDate}
              onSelect={setInvoiceDate}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
