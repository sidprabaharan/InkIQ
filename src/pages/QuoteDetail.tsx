
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
  
  // Simplify the artwork status if needed
  const status = quote.status.toLowerCase().includes('artwork') ? 'Artwork' : quote.status;
  
  // For demonstration purposes, we'll use the totalDue from the summary
  // and create a mock amount outstanding (75% of total)
  const totalAmount = quote.summary.totalDue;
  const amountOutstanding = `$${(parseFloat(quote.summary.totalDue.replace(/[$,]/g, '')) * 0.75).toFixed(2)}`;
  
  // Create properly formatted customer shipping info for the packing slip
  const customerShipping = {
    name: quote.customer.billing.contact || "Customer",
    companyName: quote.customer.shipping.company,
    address1: quote.customer.shipping.address,
    address2: quote.customer.shipping.unit,
    city: quote.customer.shipping.city,
    stateProvince: quote.customer.shipping.region,
    zipCode: quote.customer.billing.postalCode || "", // Use billing postal code since shipping doesn't have one
    country: "Canada", // Default to Canada if not specified
    phone: quote.customer.billing.phone,
    email: quote.customer.billing.email
  };
  
  // Format details properly for QuoteDetailsCard component
  const formattedDetails = {
    number: quoteId,
    date: quote.details.invoiceDate,
    expiryDate: quote.details.paymentDueDate,
    salesRep: quote.details.owner,
    terms: quote.details.deliveryMethod
  };
  
  return (
    <div className="p-0 bg-gray-50 min-h-full">
      <QuoteHeader
        quoteId={quoteId}
        isNewQuote={false}
        status={status}
      />
      
      <div className="p-6">
        <QuoteDetailHeader 
          quoteId={quoteId} 
          status={status} 
          customerInfo={customerShipping}
          items={quote.items}
        />

        <div className="space-y-6">
          {/* Company and Quote Details - top row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Company Information - top left */}
            <CompanyInfoCard company={quote.company} />
            
            {/* Quote Details - top right */}
            <QuoteDetailsCard 
              details={formattedDetails} 
              totalAmount={totalAmount}
              amountOutstanding={amountOutstanding}
            />
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
