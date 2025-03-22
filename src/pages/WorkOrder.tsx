
import { useParams, useSearchParams } from "react-router-dom";
import { CompanyInfoCard } from "@/components/quotes/CompanyInfoCard";
import { QuoteDetailsCard } from "@/components/quotes/QuoteDetailsCard";
import { CustomerInfoCard } from "@/components/quotes/CustomerInfoCard";
import { WorkOrderItemsTable } from "@/components/quotes/WorkOrderItemsTable";
import { NotesCard } from "@/components/quotes/NotesCard";
import { quotationData } from "@/components/quotes/QuoteData";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { PrintStyles } from "@/components/layout/PrintStyles";

export default function WorkOrder() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const hideCustomer = searchParams.get('hideCustomer') === 'true';
  const quoteId = id || "3032";
  const quote = quotationData;
  
  // Format the quote details in the structure expected by QuoteDetailsCard
  const formattedDetails = {
    number: quoteId,
    date: quote.details.invoiceDate,
    expiryDate: quote.details.paymentDueDate,
    salesRep: quote.details.owner,
    terms: quote.details.deliveryMethod
  };
  
  // Map quote items to the structure expected by WorkOrderItemsTable
  const formattedItems = quote.items.map((item, index) => ({
    id: index.toString(),
    name: item.category,
    description: item.description,
    quantity: parseInt(item.quantity) || 0,
    price: parseFloat(item.price.replace('$', '')) || 0,
    total: parseFloat(item.total.replace('$', '')) || 0,
    sku: item.itemNumber,
    imprintDetails: {
      locations: ['Front', 'Back'],
      colors: [item.color],
    }
  }));
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="p-0 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <div className="text-xl font-bold">Work Order #{quoteId}</div>
        <Button onClick={handlePrint} size="sm" className="print:hidden">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </div>
      
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Work Order #{quoteId}</h1>
        </div>

        <div className="space-y-6">
          {/* Company and Work Order Details - top row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Company Information - top left */}
            <CompanyInfoCard company={quote.company} />
            
            {/* Work Order Details - top right */}
            <QuoteDetailsCard 
              details={formattedDetails} 
              hideFinancials={true}
            />
          </div>
          
          {/* Customer Information - second row */}
          {!hideCustomer && (
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
          )}
          
          {/* Work Order Items - full width */}
          <WorkOrderItemsTable items={formattedItems} />
          
          {/* Notes and Production Notes - bottom row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Customer Notes */}
            <NotesCard title="Customer Notes" content={quote.notes.customer} />
            
            {/* Production Notes */}
            <NotesCard title="Production Notes" content={quote.notes.production} />
          </div>
        </div>
      </div>
      
      {/* Use the PrintStyles component instead of inline styles */}
      <PrintStyles />
    </div>
  );
}
