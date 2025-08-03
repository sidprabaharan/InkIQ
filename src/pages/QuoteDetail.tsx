
import { useParams } from "react-router-dom";
import { QuoteHeader } from "@/components/quotes/QuoteHeader";
import { QuoteDetailHeader } from "@/components/quotes/QuoteDetailHeader";
import { CompanyInfoCard } from "@/components/quotes/CompanyInfoCard";
import { QuoteDetailsCard } from "@/components/quotes/QuoteDetailsCard";
import { CustomerInfoCard } from "@/components/quotes/CustomerInfoCard";
import { QuoteItemsTable } from "@/components/quotes/QuoteItemsTable";
import { getQuoteById } from "@/components/quotes/QuoteData";
import { NotesCard } from "@/components/quotes/NotesCard";
import { InvoiceSummaryCard } from "@/components/quotes/InvoiceSummaryCard";
import { quotationData } from "@/components/quotes/QuoteData";

export default function QuoteDetail() {
  const { id } = useParams();
  const quoteId = id || "3032";
  const quote = getQuoteById(quoteId) || quotationData;
  
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
  
  // Format quote details to match the expected type in QuoteDetailsCard
  const formattedDetails = {
    number: quoteId,
    date: quote.details.invoiceDate,
    expiryDate: quote.details.paymentDueDate,
    productionDueDate: quote.details.productionDueDate,
    customerDueDate: "2024-10-10", // Using fallback date since field doesn't exist in data structure
    salesRep: quote.details.owner,
    terms: quote.details.deliveryMethod
  };

  // Calculate amount paid (total - outstanding)
  const totalValue = parseFloat(quote.summary.totalDue.replace(/[$,]/g, ''));
  const outstandingValue = parseFloat(amountOutstanding.replace(/[$,]/g, ''));
  const amountPaid = `$${(totalValue - outstandingValue).toFixed(2)}`;
  
  // Transform quote items to match QuoteItemsTable expectations
  const itemGroups = [{
    id: "1",
    name: "Product Group",
    items: quote.items.map((item, index) => ({
      id: `item-${index}`,
      category: item.category,
      itemNumber: item.itemNumber,
      color: item.color,
      description: item.description,
      sizes: {
        xs: 0,
        s: 0,
        m: parseInt(item.quantity) || 0,
        l: 0,
        xl: 0,
        xxl: 0,
        xxxl: 0,
      },
      quantity: parseInt(item.quantity) || 0,
      price: parseFloat(item.price.replace(/[$,]/g, '')) || 0,
      taxed: false,
      total: parseFloat(item.total.replace(/[$,]/g, '')) || 0,
      status: "Pending",
      mockups: [
        {
          id: "mockup-1",
          name: "Front Design Mockup",
          url: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop",
          type: "image"
        },
        {
          id: "mockup-2", 
          name: "Back Design Mockup",
          url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop",
          type: "image"
        }
      ]
    })),
    imprints: [{
      id: "1",
      type: "Screen Print",
      placement: "Front",
      size: "4\" x 4\"",
      colours: ["Black", "White"],
      notes: "High quality screen print",
      mockups: [],
      imprintItems: []
    }]
  }];
  
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
              amountPaid={amountPaid}
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
          <QuoteItemsTable itemGroups={itemGroups} />
          
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
