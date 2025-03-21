
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { quotationData } from "@/components/quotes/QuoteData";

export default function EditQuote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // In a real app, we would fetch the quote data from the server
  // For now, we'll use the sample data
  const quoteData = quotationData;
  
  const [quoteId] = useState(id || "3032");
  const [nickname, setNickname] = useState(quoteData.nickname);
  const [customerNotes, setCustomerNotes] = useState(quoteData.notes.customer);
  const [productionNotes, setProductionNotes] = useState(quoteData.notes.production);
  
  const handleCancel = () => {
    navigate(`/quotes/${quoteId}`);
  };

  const handlePreview = () => {
    console.log("Preview quote");
    toast({
      title: "Preview mode",
      description: "This would show a preview of the quote in a real application",
    });
  };

  const handleSave = () => {
    console.log("Save updated quote with ID:", quoteId);
    
    // In a real app, this would save the updated quote data to a database
    toast({
      title: "Quote updated",
      description: `Quote #${quoteId} has been updated successfully`,
    });
    
    navigate(`/quotes/${quoteId}`);
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const handleCustomerNotesChange = (value: string) => {
    setCustomerNotes(value);
  };

  const handleProductionNotesChange = (value: string) => {
    setProductionNotes(value);
  };

  return (
    <CustomersProvider>
      <div className="p-0 bg-gray-50 min-h-full">
        <QuoteHeader 
          onCancel={handleCancel}
          onPreview={handlePreview}
          onSave={handleSave}
          quoteId={quoteId}
          isNewQuote={false}
          title="Edit Quote"
        />

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Content - 8 columns (2/3 of grid) */}
            <div className="md:col-span-2 space-y-6">
              <CustomerSection initialCustomerId={quoteData.customer?.billing?.contact} />
              <BillingSection initialBillingData={quoteData.customer.billing} />
              <ShippingSection initialShippingData={quoteData.customer.shipping} />
            </div>

            {/* Right Content - 4 columns (1/3 of grid) */}
            <div className="md:col-span-1 space-y-4">
              <QuotationHeader />
              <QuotationDetailsSection initialDetails={quoteData.details} />
              <NickNameSection value={nickname} onChange={handleNicknameChange} />
              <div className="space-y-4">
                <NotesSection 
                  title="Customer Notes" 
                  placeholder="Write customer notes here..." 
                  value={customerNotes}
                  onChange={handleCustomerNotesChange}
                />
                <NotesSection 
                  title="Production Note" 
                  placeholder="Write production notes here..." 
                  value={productionNotes}
                  onChange={handleProductionNotesChange}
                />
              </div>
            </div>
          </div>
          
          {/* Quote Items Section - Full Width */}
          <div className="mt-6">
            <QuoteItemsSection initialItems={quoteData.items} />
          </div>
          
          {/* Invoice Summary Section - Full Width but with right alignment */}
          <div className="mt-6 md:w-1/3 md:ml-auto">
            <InvoiceSummarySection initialSummary={quoteData.summary} />
          </div>
        </div>
      </div>
    </CustomersProvider>
  );
}
