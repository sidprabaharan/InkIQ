
import React from 'react';

interface QuoteDetails {
  owner: string;
  deliveryMethod: string;
  productionDueDate: string;
  paymentDueDate: string;
  invoiceDate: string;
}

interface QuoteDetailsCardProps {
  details: QuoteDetails;
  totalAmount?: string;
  amountOutstanding?: string;
}

export function QuoteDetailsCard({ details, totalAmount, amountOutstanding }: QuoteDetailsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="font-medium mb-4">Quotation Details</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Owner</span>
          <span>{details.owner}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Method</span>
          <span>{details.deliveryMethod}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Production Due Date</span>
          <span>{details.productionDueDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Due Date</span>
          <span>{details.paymentDueDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Invoice Date</span>
          <span>{details.invoiceDate}</span>
        </div>
        
        {totalAmount && (
          <div className="flex justify-between font-medium">
            <span className="text-gray-600">Total Amount</span>
            <span>{totalAmount}</span>
          </div>
        )}
        
        {amountOutstanding && (
          <div className="flex justify-between font-medium">
            <span className="text-gray-600">Amount Outstanding</span>
            <span className="text-amber-600">{amountOutstanding}</span>
          </div>
        )}
      </div>
    </div>
  );
}
