
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { InvoiceSummary } from "./QuoteData";

interface InvoiceSummarySectionProps {
  initialSummary?: InvoiceSummary;
}

export function InvoiceSummarySection({ initialSummary }: InvoiceSummarySectionProps) {
  const [itemTotal, setItemTotal] = useState<string>("0.00");
  const [feesTotal, setFeesTotal] = useState<string>("0.00");
  const [subTotal, setSubTotal] = useState<string>("0.00");
  const [discount, setDiscount] = useState<string>("0.00");
  const [salesTax, setSalesTax] = useState<string>("0.00");
  const [totalDue, setTotalDue] = useState<string>("0.00");

  // Set initial values when component mounts
  useEffect(() => {
    if (initialSummary) {
      setItemTotal(initialSummary.itemTotal.replace('$', '').replace(',', ''));
      setFeesTotal(initialSummary.feesTotal.replace('$', '').replace(',', ''));
      setSubTotal(initialSummary.subTotal.replace('$', '').replace(',', ''));
      setDiscount(initialSummary.discount.replace('$', '').replace(',', ''));
      setSalesTax(initialSummary.salesTax.replace('$', '').replace(',', ''));
      setTotalDue(initialSummary.totalDue.replace('$', '').replace(',', ''));
    }
  }, [initialSummary]);

  // Calculate totals when inputs change
  useEffect(() => {
    const itemTotalValue = parseFloat(itemTotal) || 0;
    const feesTotalValue = parseFloat(feesTotal) || 0;
    const subTotalValue = itemTotalValue + feesTotalValue;
    const discountValue = parseFloat(discount) || 0;
    const salesTaxValue = parseFloat(salesTax) || 0;
    const totalDueValue = subTotalValue - discountValue + salesTaxValue;
    
    setSubTotal(subTotalValue.toFixed(2));
    setTotalDue(totalDueValue.toFixed(2));
  }, [itemTotal, feesTotal, discount, salesTax]);

  return (
    <div className="bg-white border rounded-md p-4 space-y-4">
      <h3 className="text-base font-medium">Invoice Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Item Total</span>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-1">$</span>
            <Input 
              className="w-32 text-right" 
              value={itemTotal}
              onChange={(e) => setItemTotal(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Fees Total</span>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-1">$</span>
            <Input 
              className="w-32 text-right" 
              value={feesTotal}
              onChange={(e) => setFeesTotal(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center font-medium">
          <span className="text-sm">Subtotal</span>
          <span className="text-sm">${subTotal}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Discount</span>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-1">$</span>
            <Input 
              className="w-32 text-right" 
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Sales Tax</span>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-1">$</span>
            <Input 
              className="w-32 text-right" 
              value={salesTax}
              onChange={(e) => setSalesTax(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t font-medium">
          <span>Total Due</span>
          <span>${totalDue}</span>
        </div>
      </div>
    </div>
  );
}
