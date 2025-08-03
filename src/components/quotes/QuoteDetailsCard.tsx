
import React from 'react';

interface DetailItem {
  label: string;
  value: string;
}

interface QuoteDetailsCardProps {
  details: {
    number: string;
    date: string;
    expiryDate: string;
    productionDueDate?: string;
    customerDueDate?: string;
    salesRep: string;
    terms: string;
  };
  totalAmount?: string;
  amountPaid?: string;
  amountOutstanding?: string;
  hideFinancials?: boolean;
}

export function QuoteDetailsCard({ 
  details, 
  totalAmount, 
  amountPaid,
  amountOutstanding,
  hideFinancials = false
}: QuoteDetailsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="font-medium mb-4">Quote Details</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Quote Number:</span>
          <span className="font-medium">{details.number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Date Created:</span>
          <span>{details.date}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment Due Date:</span>
          <span>{details.expiryDate}</span>
        </div>
        {details.productionDueDate && (
          <div className="flex justify-between">
            <span className="text-gray-500">Production Due Date:</span>
            <span>{details.productionDueDate}</span>
          </div>
        )}
        {details.customerDueDate && (
          <div className="flex justify-between">
            <span className="text-gray-500">Customer Due Date:</span>
            <span>{details.customerDueDate}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">Sales Rep:</span>
          <span>{details.salesRep}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Terms:</span>
          <span>{details.terms}</span>
        </div>
        
        {!hideFinancials && totalAmount && (
          <div className="flex justify-between pt-2 border-t mt-2">
            <span className="text-gray-500">Total Amount:</span>
            <span className="font-bold">{totalAmount}</span>
          </div>
        )}
        
        {!hideFinancials && amountPaid && (
          <div className="flex justify-between">
            <span className="text-gray-500">Amount Paid:</span>
            <span className="font-medium">{amountPaid}</span>
          </div>
        )}
        
        {!hideFinancials && amountOutstanding && (
          <div className="flex justify-between">
            <span className="text-gray-500">Amount Outstanding:</span>
            <span className="font-medium">{amountOutstanding}</span>
          </div>
        )}
      </div>
    </div>
  );
}
