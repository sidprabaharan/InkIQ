
import { useParams, useSearchParams } from "react-router-dom";
import { QuoteDetailHeader } from "@/components/quotes/QuoteDetailHeader";
import { CompanyInfoCard } from "@/components/quotes/CompanyInfoCard";
import { QuoteDetailsCard } from "@/components/quotes/QuoteDetailsCard";
import { CustomerInfoCard } from "@/components/quotes/CustomerInfoCard";
import { WorkOrderItemsTable } from "@/components/quotes/WorkOrderItemsTable";
import { NotesCard } from "@/components/quotes/NotesCard";
import { quotationData } from "@/components/quotes/QuoteData";

export default function WorkOrder() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const hideCustomer = searchParams.get('hideCustomer') === 'true';
  const quoteId = id || "3032";
  const quote = quotationData;
  
  // Set status to "Work Order"
  const status = "Work Order";
  
  // Create properly formatted customer shipping info for the work order
  const customerShipping = {
    name: quote.customer.billing.contact || "Customer",
    companyName: quote.customer.shipping.company,
    address1: quote.customer.shipping.address,
    address2: quote.customer.shipping.unit,
    city: quote.customer.shipping.city,
    stateProvince: quote.customer.shipping.region,
    zipCode: quote.customer.billing.postalCode || "",
    country: "Canada",
    phone: quote.customer.billing.phone,
    email: quote.customer.billing.email
  };
  
  return (
    <div className="p-0 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center p-4 border-b bg-white">
        <div className="text-xl font-bold">Work Order #{quoteId}</div>
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
              details={quote.details} 
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
          <WorkOrderItemsTable items={quote.items} />
          
          {/* Notes and Production Notes - bottom row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Customer Notes */}
            <NotesCard title="Customer Notes" content={quote.notes.customer} />
            
            {/* Production Notes */}
            <NotesCard title="Production Notes" content={quote.notes.production} />
          </div>
        </div>
      </div>
    </div>
  );
}
