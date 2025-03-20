
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
    // Navigate back to quotes page after saving
    // navigate("/quotes");
  };

  return (
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
            <QuoteItemsSection />
          </div>

          {/* Right Content - 4 columns (1/3 of grid) */}
          <div className="md:col-span-1 space-y-6">
            <QuotationHeader />
            <QuotationDetailsSection />
            <NickNameSection />
            <NotesSection title="Customer Notes" />
            <NotesSection title="Production Note" />
            <InvoiceSummarySection />
          </div>
        </div>
      </div>
    </div>
  );
}
