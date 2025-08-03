
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { QuoteHeader } from "@/components/quotes/QuoteHeader";
import { CustomerSection } from "@/components/quotes/CustomerSection";
import { BillingSection } from "@/components/quotes/BillingSection";
import { ShippingSection } from "@/components/quotes/ShippingSection";
import { QuoteItemsSection } from "@/components/quotes/QuoteItemsSection";
import { QuotationHeader } from "@/components/quotes/QuotationHeader";
import { QuotationDetailsSection } from "@/components/quotes/QuotationDetailsSection";
import { NickNameSection } from "@/components/quotes/NickNameSection";
import { NotesSection } from "@/components/quotes/NotesSection";
import { InvoiceSummarySection } from "@/components/quotes/InvoiceSummarySection";
import { CustomersProvider } from "@/context/CustomersContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// Sample data for demonstration purposes
const generateNewQuoteId = () => {
  // In a real app, this would be generated on the server
  return Math.floor(3000 + Math.random() * 1000).toString();
};

export default function NewQuote() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  // Generate a new quote ID for this quote
  const [quoteId] = useState(generateNewQuoteId());
  const [nickname, setNickname] = useState("New Quotation");
  const [leadData, setLeadData] = useState<any>(null);

  // Check if this quote is being created from a lead
  useEffect(() => {
    const leadParam = searchParams.get('lead');
    if (leadParam) {
      try {
        const data = JSON.parse(decodeURIComponent(leadParam));
        setLeadData(data);
        setNickname(`Quote for ${data.company || data.customerName}`);
        
        toast({
          title: "Lead data loaded",
          description: `Creating quote for ${data.customerName} at ${data.company}`,
        });
      } catch (error) {
        console.error('Error parsing lead data:', error);
      }
    }
  }, [searchParams, toast]);
  
  const handleCancel = () => {
    navigate("/quotes");
  };

  const handlePreview = () => {
    console.log("Preview quote");
    toast({
      title: "Preview mode",
      description: "This would show a preview of the quote in a real application",
    });
  };

  const handleSave = () => {
    console.log("Save quote with ID:", quoteId);
    
    // In a real app, this would save the quote data to a database
    // For demo purposes, we'll just navigate to the quote detail page
    navigate(`/quotes/${quoteId}`);
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  return (
    <CustomersProvider>
      <div className="p-0 bg-gray-50 min-h-full">
        <QuoteHeader 
          onCancel={handleCancel}
          onPreview={handlePreview}
          onSave={handleSave}
          quoteId={quoteId}
          isNewQuote={true}
        />

        {/* Lead Context Banner */}
        {leadData && (
          <div className="bg-primary/10 border-b px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium">
                  Creating quote from lead: {leadData.customerName} ({leadData.company})
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/leads`)}
                className="text-xs"
              >
                ← Back to Leads
              </Button>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Content - 8 columns (2/3 of grid) */}
            <div className="md:col-span-2 space-y-6">
              <CustomerSection leadData={leadData} />
              <BillingSection />
              <ShippingSection />
            </div>

            {/* Right Content - 4 columns (1/3 of grid) */}
            <div className="md:col-span-1 space-y-4">
              <QuotationHeader />
              <QuotationDetailsSection />
              <NickNameSection value={nickname} onChange={handleNicknameChange} />
              <div className="space-y-4">
                <NotesSection title="Customer Notes" />
                <NotesSection title="Production Note" />
              </div>
            </div>
          </div>
          
          {/* Quote Items Section - Full Width */}
          <div className="mt-6">
            <QuoteItemsSection />
          </div>
          
          {/* Invoice Summary Section - Full Width but with right alignment */}
          <div className="mt-6 md:w-1/3 md:ml-auto">
            <InvoiceSummarySection />
          </div>
        </div>
      </div>
    </CustomersProvider>
  );
}
