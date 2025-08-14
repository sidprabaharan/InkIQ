
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { QuoteHeader } from "@/components/quotes/QuoteHeader";
import { CustomerSection } from "@/components/quotes/CustomerSection";
import { BillingSection } from "@/components/quotes/BillingSection";
import { ShippingSection } from "@/components/quotes/ShippingSection";
import { QuoteItemsSection, QuoteItemsSectionRef } from "@/components/quotes/QuoteItemsSection";
import { QuotationHeader } from "@/components/quotes/QuotationHeader";
import { QuotationDetailsSection } from "@/components/quotes/QuotationDetailsSection";
import { NickNameSection } from "@/components/quotes/NickNameSection";
import { NotesSection } from "@/components/quotes/NotesSection";
import { InvoiceSummarySection } from "@/components/quotes/InvoiceSummarySection";
import { CustomersProvider, useCustomers } from "@/context/CustomersContext";
import { useQuotes } from "@/context/QuotesContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { getQuoteById, QuotationData } from "@/components/quotes/QuoteData";
import { quoteStorage } from "@/lib/quoteStorage";

// Sample data for demonstration purposes
const generateNewQuoteId = () => {
  // In a real app, this would be generated on the server
  return Math.floor(3000 + Math.random() * 1000).toString();
};

// Inner component that has access to CustomersContext
function NewQuoteContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createQuote } = useQuotes();
  const { selectedCustomer } = useCustomers();
  const [searchParams] = useSearchParams();
  const { id: editQuoteId } = useParams();
  
  // Determine if we're in edit mode
  const isEditMode = !!editQuoteId;
  
  // Generate a new quote ID for this quote (only if creating new)
  const [quoteId] = useState(isEditMode ? editQuoteId : generateNewQuoteId());
  const [nickname, setNickname] = useState(isEditMode ? `Edit Quote #${editQuoteId}` : "New Quotation");
  const [leadData, setLeadData] = useState<any>(null);
  const [quoteData, setQuoteData] = useState<QuotationData | null>(null);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const quoteItemsRef = useRef<QuoteItemsSectionRef>(null);
  
  // State for quote dates
  const [quoteDates, setQuoteDates] = useState<{
    productionDueDate?: Date;
    customerDueDate?: Date;
    paymentDueDate?: Date;
    invoiceDate?: Date;
  }>({});

  // Check if this quote is being created from a lead or if we're editing
  useEffect(() => {
    if (isEditMode) {
      // In edit mode, load existing quote data
      // For demo purposes, we'll use the sample quotationData
      setIsLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        const loadedQuoteData = getQuoteById(editQuoteId);
        if (loadedQuoteData) {
          setQuoteData(loadedQuoteData);
          setNickname(loadedQuoteData.nickname || `Edit Quote #${editQuoteId}`);
          setIsLoading(false);
          
          toast({
            title: "Quote loaded for editing",
            description: `Editing quote #${editQuoteId}`,
          });
        } else {
          setIsLoading(false);
          toast({
            title: "Quote not found",
            description: `Quote #${editQuoteId} could not be found`,
            variant: "destructive"
          });
        }
      }, 500);
    } else {
      // Check if creating from a lead
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
    }
  }, [searchParams, toast, isEditMode, editQuoteId]);
  
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

  const handleSave = async () => {
    console.log("🔍 [DEBUG] handleSave - Starting save process");
    
    // Get current item groups data from QuoteItemsSection if available
    const currentItemGroups = quoteItemsRef.current?.getCurrentItemGroups();
    console.log("🔍 [DEBUG] handleSave - currentItemGroups:", currentItemGroups);
    console.log("🔍 [DEBUG] handleSave - quoteItemsRef.current:", quoteItemsRef.current);
    console.log("🔍 [DEBUG] handleSave - selectedCustomer:", selectedCustomer);
    console.log("🔍 [DEBUG] handleSave - isEditMode:", isEditMode);
    
    if (isEditMode && quoteData && quoteId) {
      console.log("Update quote with ID:", quoteId);
      console.log("Saving item groups with imprints:", currentItemGroups);
      
      // Convert item groups to the format expected by QuotationData
      const convertedItems = currentItemGroups ? 
        currentItemGroups.flatMap(group => group.items.map(item => ({
          category: item.category,
          itemNumber: item.itemNumber,
          color: item.color,
          description: item.description,
          xs: item.sizes.xs.toString(),
          s: item.sizes.s.toString(),
          m: item.sizes.m.toString(),
          l: item.sizes.l.toString(),
          xl: item.sizes.xl.toString(),
          xxl: item.sizes.xxl.toString(),
          qty: item.quantity.toString(),
          quantity: item.quantity.toString(),
          price: item.price.toString(),
          taxed: item.taxed,
          total: item.total.toString(),
          status: "active",
          mockups: item.mockups?.map(mockup => ({
            id: mockup.id,
            name: mockup.name,
            url: mockup.url,
            type: mockup.type
          }))
        }))) : 
        quoteData.items;

      // Extract and flatten imprints from all item groups
      const convertedImprints = currentItemGroups ? 
        currentItemGroups.flatMap(group => 
          group.imprints?.map(imprint => ({
            id: imprint.id,
            type: imprint.method,
            placement: imprint.location,
            size: `${imprint.width}" x ${imprint.height}"`,
            colours: imprint.colorsOrThreads,
            notes: imprint.notes,
            customerArt: imprint.customerArt || [],
            productionFiles: imprint.productionFiles || [],
            proofMockup: imprint.proofMockup || []
          })) || []
        ) : 
        quoteData.imprints || [];

      // Update the quote data with the new items and imprints
      const updatedQuoteData: QuotationData = {
        ...quoteData,
        items: convertedItems,
        imprints: convertedImprints,
        nickname: nickname
      };
      
      // Save to localStorage
      quoteStorage.saveQuote(quoteId, updatedQuoteData);
      console.log("Updated quote data saved:", updatedQuoteData);
      
      // For now, just show a toast since update functionality isn't implemented yet
      toast({
        title: "Update not implemented",
        description: "Quote updates will be implemented in the next phase",
        variant: "destructive"
      });
      return;
    } else {
      try {
        // Check if a customer is selected
        if (!selectedCustomer) {
          toast({
            title: "Please select a customer",
            description: "You must select a customer before creating a quote",
            variant: "destructive"
          });
          return;
        }
                 
        // Get the current items and imprints from QuoteItemsSection
        const currentItemGroups = quoteItemsRef.current?.getCurrentItemGroups() || [];
        console.log("🔍 [DEBUG] handleSave - Creating new quote, currentItemGroups:", currentItemGroups);
        console.log("🔍 [DEBUG] handleSave - currentItemGroups length:", currentItemGroups.length);
        
        // Convert items to the format expected by the backend
        const quoteItems = currentItemGroups.flatMap(group => 
          group.items.map(item => ({
            product_name: item.description || "Unknown Product",
            product_sku: item.itemNumber || "",
            product_description: item.description || "",
            category: item.category || "",
            item_number: item.itemNumber || "",
            color: item.color || "",
            quantity: item.quantity || 0,
            unit_price: item.price || 0,
            total_price: item.total || 0,
            xs: item.sizes?.xs || 0,
            s: item.sizes?.s || 0,
            m: item.sizes?.m || 0,
            l: item.sizes?.l || 0,
            xl: item.sizes?.xl || 0,
            xxl: item.sizes?.xxl || 0,
            xxxl: item.sizes?.xxxl || 0,
            taxed: item.taxed || false,
            garment_status: 'pending',
            imprint_type: group.imprints?.[0]?.method || null,
            setup_fee: 0,
            imprint_cost: 0,
            notes: group.imprints?.[0]?.notes || ""
          }))
        );

        const quoteData = {
          customer_id: selectedCustomer.id,
          subject: nickname || "New Quote",
          description: "Quote created from frontend",
          tax_rate: 0.08,
          discount_percentage: 0,
          valid_until_days: 30,
          notes: "Quote created via NewQuote component",
          terms_conditions: "Standard terms apply",
          production_due_date: quoteDates.productionDueDate,
          customer_due_date: quoteDates.customerDueDate,
          payment_due_date: quoteDates.paymentDueDate,
          invoice_date: quoteDates.invoiceDate,
          items: quoteItems
        };
        
        console.log("🔍 [DEBUG] handleSave - quoteItems:", quoteItems);
        console.log("🔍 [DEBUG] handleSave - Final quoteData:", quoteData);
        console.log("🔍 [DEBUG] handleSave - About to call createQuote");
        
        const result = await createQuote(quoteData);
        console.log("🔍 [DEBUG] handleSave - createQuote result:", result);
        
        if (result.success && result.quote_id) {
          toast({
            title: "Quote created successfully!",
            description: `Quote for ${selectedCustomer.companyName} has been saved`,
          });
          
          // Navigate to the new quote
          navigate(`/quotes/${result.quote_id}`);
        } else {
          toast({
            title: "Failed to create quote",
            description: result.error || "Unknown error occurred",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error creating quote:", error);
        toast({
          title: "Error creating quote",
          description: "An unexpected error occurred",
          variant: "destructive"
        });
      }
    }
  };

  const handleNicknameChange = (value: string) => {
    setNickname(value);
  };

  const handleDatesChange = (dates: {
    productionDueDate?: Date;
    customerDueDate?: Date;
    paymentDueDate?: Date;
    invoiceDate?: Date;
  }) => {
    setQuoteDates(dates);
  };

  return (
    <div className="p-0 bg-gray-50 min-h-full">
      <QuoteHeader 
        onCancel={handleCancel}
        onPreview={handlePreview}
        onSave={handleSave}
        quoteId={quoteId}
        isNewQuote={!isEditMode}
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading quote data...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Content - 8 columns (2/3 of grid) */}
              <div className="md:col-span-2 space-y-6">
                <CustomerSection leadData={leadData} quoteData={quoteData} />
                <BillingSection quoteData={quoteData} />
                <ShippingSection quoteData={quoteData} />
              </div>

              {/* Right Content - 4 columns (1/3 of grid) */}
              <div className="md:col-span-1 space-y-4">
                <QuotationHeader quoteData={quoteData} />
                <QuotationDetailsSection quoteData={quoteData} onDatesChange={handleDatesChange} />
                <NickNameSection value={nickname} onChange={handleNicknameChange} />
                <div className="space-y-4">
                  <NotesSection title="Customer Notes" initialValue={quoteData?.notes.customer} />
                  <NotesSection title="Production Note" initialValue={quoteData?.notes.production} />
                </div>
              </div>
            </div>
            
            {/* Quote Items Section - Full Width */}
            <div className="mt-6">
              <QuoteItemsSection 
                quoteData={quoteData} 
                ref={quoteItemsRef}
              />
            </div>
            
            {/* Invoice Summary Section - Full Width but with right alignment */}
            <div className="mt-6 md:w-1/3 md:ml-auto">
              <InvoiceSummarySection quoteData={quoteData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Main component that provides the CustomersContext
export default function NewQuote() {
  return (
    <CustomersProvider>
      <NewQuoteContent />
    </CustomersProvider>
  );
}
