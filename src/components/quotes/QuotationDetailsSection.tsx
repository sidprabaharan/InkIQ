
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { QuoteDetails } from "./QuoteData";

interface QuotationDetailsSectionProps {
  initialDetails?: QuoteDetails;
}

export function QuotationDetailsSection({ initialDetails }: QuotationDetailsSectionProps) {
  const [details, setDetails] = useState({
    owner: initialDetails?.owner || "",
    deliveryMethod: initialDetails?.deliveryMethod || "",
    productionDueDate: initialDetails?.productionDueDate || "",
    paymentDueDate: initialDetails?.paymentDueDate || "",
    invoiceDate: initialDetails?.invoiceDate || ""
  });

  // Update state when initialDetails changes
  useEffect(() => {
    if (initialDetails) {
      setDetails({
        owner: initialDetails.owner || "",
        deliveryMethod: initialDetails.deliveryMethod || "",
        productionDueDate: initialDetails.productionDueDate || "",
        paymentDueDate: initialDetails.paymentDueDate || "",
        invoiceDate: initialDetails.invoiceDate || ""
      });
    }
  }, [initialDetails]);

  const handleChange = (field: string, value: string) => {
    setDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <h3 className="text-base font-medium">Quotation Details</h3>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="owner">Owner</Label>
          <Input 
            id="owner"
            placeholder="Owner" 
            value={details.owner}
            onChange={(e) => handleChange('owner', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="deliveryMethod">Delivery Method</Label>
          <Select 
            value={details.deliveryMethod} 
            onValueChange={(value) => handleChange('deliveryMethod', value)}
          >
            <SelectTrigger id="deliveryMethod">
              <SelectValue placeholder="Select delivery method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pickup">Pickup</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
              <SelectItem value="shipping">Shipping</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="productionDueDate">Production Due Date</Label>
          <div className="relative">
            <Input 
              id="productionDueDate"
              placeholder="MM-DD-YYYY" 
              value={details.productionDueDate}
              onChange={(e) => handleChange('productionDueDate', e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0"
              type="button"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="paymentDueDate">Payment Due Date</Label>
          <div className="relative">
            <Input 
              id="paymentDueDate"
              placeholder="MM-DD-YYYY" 
              value={details.paymentDueDate}
              onChange={(e) => handleChange('paymentDueDate', e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0"
              type="button"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="invoiceDate">Invoice Date</Label>
          <div className="relative">
            <Input 
              id="invoiceDate"
              placeholder="MM-DD-YYYY" 
              value={details.invoiceDate}
              onChange={(e) => handleChange('invoiceDate', e.target.value)}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0"
              type="button"
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
