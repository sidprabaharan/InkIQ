
import { useParams } from "react-router-dom";
import { useState } from "react";
import { QuoteHeader } from "@/components/quotes/QuoteHeader";
import { QuoteDetailHeader } from "@/components/quotes/QuoteDetailHeader";
import { StatusDashboard } from "@/components/quotes/StatusDashboard";
import { CompanyInfoCard } from "@/components/quotes/CompanyInfoCard";
import { QuoteDetailsCard } from "@/components/quotes/QuoteDetailsCard";
import { CustomerInfoCard } from "@/components/quotes/CustomerInfoCard";
import { RedesignedOrderBreakdown } from "@/components/quotes/RedesignedOrderBreakdown";
import { QuickActions } from "@/components/quotes/QuickActions";
import { mockOrderBreakdownData } from "@/data/mockOrderBreakdown";
import { NotesCard } from "@/components/quotes/NotesCard";
import { InvoiceSummaryCard } from "@/components/quotes/InvoiceSummaryCard";
import { quotationData } from "@/components/quotes/QuoteData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function QuoteDetail() {
  const { id } = useParams();
  const quoteId = id || "3032";
  const quote = quotationData;
  const [currentStatus, setCurrentStatus] = useState(quote.status.toLowerCase().includes('artwork') ? 'Artwork Pending' : quote.status);
  
  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus);
  };
  
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
  
  return (
    <div className="p-0 bg-background min-h-full">
      <QuoteHeader
        quoteId={quoteId}
        isNewQuote={false}
        status={currentStatus}
      />
      
      <div className="p-6 max-w-7xl mx-auto">
        {/* Status Dashboard - Critical info at top */}
        <StatusDashboard
          status={currentStatus}
          quoteId={quoteId}
          totalAmount={totalAmount}
          amountPaid={amountPaid}
          amountOutstanding={amountOutstanding}
          dueDate={formattedDetails.customerDueDate}
          onStatusChange={handleStatusChange}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products & Imprints</TabsTrigger>
                <TabsTrigger value="details">Details & Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Company and Quote Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CompanyInfoCard company={quote.company} />
                  <QuoteDetailsCard 
                    details={formattedDetails} 
                    hideFinancials={true}
                  />
                </div>
                
                {/* Customer Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomerInfoCard 
                    title="Billing Information" 
                    customerInfo={quote.customer.billing} 
                  />
                  <CustomerInfoCard 
                    title="Shipping Information" 
                    customerInfo={quote.customer.shipping} 
                  />
                </div>
              </TabsContent>

              <TabsContent value="products" className="mt-6">
                <RedesignedOrderBreakdown 
                  groups={mockOrderBreakdownData} 
                  quoteId={quoteId} 
                />
              </TabsContent>

              <TabsContent value="details" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <NotesCard title="Customer Notes" content={quote.notes.customer} />
                  <NotesCard title="Production Notes" content={quote.notes.production} />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            <QuickActions
              onSendEmail={() => console.log('Send email')}
              onPrint={() => window.print()}
              onDownload={() => console.log('Download PDF')}
              onDuplicate={() => console.log('Duplicate quote')}
              onPackingSlip={() => console.log('Generate packing slip')}
              onShippingLabel={() => console.log('Generate shipping label')}
              onGenerateInvoice={() => console.log('Generate invoice')}
              onEdit={() => console.log('Edit quote')}
              onAddNote={() => console.log('Add note')}
            />
            
            <InvoiceSummaryCard summary={quote.summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
