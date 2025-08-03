
import React, { useState } from "react";
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

interface QuotationDetailsSectionProps {
  quoteData?: any;
}

export function QuotationDetailsSection({ quoteData }: QuotationDetailsSectionProps) {
  const [created, setCreated] = useState<Date | undefined>(
    quoteData?.details?.created ? new Date(quoteData.details.created) : undefined
  );
  const [productionDueDate, setProductionDueDate] = useState<Date | undefined>(
    quoteData?.details?.productionDueDate ? new Date(quoteData.details.productionDueDate) : undefined
  );
  const [customerDueDate, setCustomerDueDate] = useState<Date | undefined>(
    quoteData?.details?.customerDueDate ? new Date(quoteData.details.customerDueDate) : undefined
  );
  const [paymentDueDate, setPaymentDueDate] = useState<Date | undefined>(
    quoteData?.details?.paymentDueDate ? new Date(quoteData.details.paymentDueDate) : undefined
  );
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(
    quoteData?.details?.invoiceDate ? new Date(quoteData.details.invoiceDate) : undefined
  );

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Quotation Details</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Select value={quoteData?.details?.owner || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Noraiz shahid">Noraiz shahid</SelectItem>
              <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
              <SelectItem value="Michael Chen">Michael Chen</SelectItem>
            </SelectContent>
          </Select>
          <Select value={quoteData?.details?.deliveryMethod || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Delivery Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Home Delivery">Home Delivery</SelectItem>
              <SelectItem value="Pickup">Pickup</SelectItem>
              <SelectItem value="Courier">Courier</SelectItem>
              <SelectItem value="Standard Shipping">Standard Shipping</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input placeholder="PO Number" value={quoteData?.details?.poNumber || ""} />
        
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
