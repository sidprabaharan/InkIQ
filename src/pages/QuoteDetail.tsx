
import { useParams } from "react-router-dom";
import { QuoteHeader } from "@/components/quotes/QuoteHeader";
import { QuoteDetailHeader } from "@/components/quotes/QuoteDetailHeader";
import { CompanyInfoCard } from "@/components/quotes/CompanyInfoCard";
import { QuoteDetailsCard } from "@/components/quotes/QuoteDetailsCard";
import { CustomerInfoCard } from "@/components/quotes/CustomerInfoCard";
import { QuoteItemsTable } from "@/components/quotes/QuoteItemsTable";
import { NotesCard } from "@/components/quotes/NotesCard";
import { InvoiceSummaryCard } from "@/components/quotes/InvoiceSummaryCard";
import { quotationData } from "@/components/quotes/QuoteData";

export default function QuoteDetail() {
  const { id } = useParams();
  const quoteId = id || "3032";
  const quote = quotationData;
  
  return (
    <div className="p-0 bg-gray-50 min-h-full">
      <QuoteHeader
        quoteId={quoteId}
        isNewQuote={false}
      />
      
      <div className="p-6">
        <QuoteDetailHeader quoteId={quoteId} status={quote.status} />

        <div className="space-y-6">
          {/* Company and Quote Details - top row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Company Information - top left */}
            <CompanyInfoCard company={quote.company} />
            
            {/* Quote Details - top right */}
            <QuoteDetailsCard details={quote.details} />
          </div>
          
          {/* Billing and Shipping - second row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Billing Information */}
            <CustomerInfoCard 
              title="Customer Billing" 
              customerInfo={quote.customer.billing} 
            />
            
            {/* Shipping Information */}
            <CustomerInfoCard 
              title="Customer Shipping" 
              customerInfo={quote.customer.shipping} 
            />
          </div>
          
          {/* Quote Items - full width */}
          <QuoteItemsTable items={quote.items} />
          
          {/* Notes and Invoice Summary - bottom row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Customer Notes */}
            <NotesCard title="Customer Notes" content={quote.notes.customer} />
            
            {/* Production Notes */}
            <NotesCard title="Production Notes" content={quote.notes.production} />
            
            {/* Invoice Summary */}
            <InvoiceSummaryCard summary={quote.summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
