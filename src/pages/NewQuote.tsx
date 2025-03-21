
import React from "react";
import { useNavigate } from "react-router-dom";
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

export default function NewQuote() {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/quotes");
  };

  const handlePreview = () => {
    console.log("Preview quote");
  };

  const handleSave = () => {
    console.log("Save quote");
    // Navigate to the sample quote detail page
    navigate("/quotes/3032");
  };

  return (
    <CustomersProvider>
      <div className="p-0 bg-gray-50 min-h-full">
        <QuoteHeader 
          onCancel={handleCancel}
          onPreview={handlePreview}
          onSave={handleSave}
        />

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Content - 8 columns (2/3 of grid) */}
            <div className="md:col-span-2 space-y-6">
              <CustomerSection />
              <BillingSection />
              <ShippingSection />
            </div>

            {/* Right Content - 4 columns (1/3 of grid) */}
            <div className="md:col-span-1 space-y-4">
              <QuotationHeader />
              <QuotationDetailsSection />
              <NickNameSection />
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
