import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { QuoteHeader } from "@/components/quotes/QuoteHeader";
import { QuoteDetailHeader } from "@/components/quotes/QuoteDetailHeader";
import { CompanyInfoCard } from "@/components/quotes/CompanyInfoCard";
import { QuoteDetailsCard } from "@/components/quotes/QuoteDetailsCard";
import { CustomerInfoCard } from "@/components/quotes/CustomerInfoCard";
import { QuoteItemsTable } from "@/components/quotes/QuoteItemsTable";
import { NotesCard } from "@/components/quotes/NotesCard";
import { InvoiceSummaryCard } from "@/components/quotes/InvoiceSummaryCard";
import { useQuotes } from "@/context/QuotesContext";
import { useCustomers } from "@/context/CustomersContext";
import { useAuth } from "@/context/AuthContext";

export default function QuoteDetail() {
  const { id } = useParams();
  const { getQuote } = useQuotes();
  const { customers, fetchCustomers } = useCustomers();
  const { user } = useAuth();
  
  const [quote, setQuote] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add ref to track if component is mounted
  const isMountedRef = useRef(true);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const loadQuoteData = async () => {
      console.log('🔍 [DEBUG] QuoteDetail - loadQuoteData called for ID:', id);
      console.log('🔍 [DEBUG] QuoteDetail - isMounted:', isMountedRef.current);
      console.log('🔍 [DEBUG] QuoteDetail - URL path:', window.location.pathname);
      
      if (!id) {
        setError("Quote ID is required");
        setLoading(false);
        return;
      }

      // Don't fetch if component is unmounting
      if (!isMountedRef.current) {
        console.log('🔍 [DEBUG] QuoteDetail - Component unmounted, skipping fetch');
        return;
      }

      // Don't fetch if we're not on the quote detail page anymore
      if (!window.location.pathname.includes(`/quotes/${id}`)) {
        console.log('🔍 [DEBUG] QuoteDetail - Not on quote detail page, skipping fetch');
        return;
      }

      try {
        setLoading(true);
        
        // Fetch the quote
        const quoteData = await getQuote(id);
        
        // Check again after async operation
        if (!isMountedRef.current) {
          return;
        }
        
        if (!quoteData) {
          setError("Quote not found");
          setLoading(false);
          return;
        }
        setQuote(quoteData);

        // Ensure customers are loaded
        if (customers.length === 0) {
          await fetchCustomers();
        }

        // Check again after potential async operation
        if (!isMountedRef.current) {
          return;
        }

        // Find the customer for this quote
        const quoteCustomer = customers.find(c => c.id === quoteData.customer_id);
        setCustomer(quoteCustomer);

      } catch (err) {
        // Only set error if component is still mounted
        if (isMountedRef.current) {
          console.error('Error loading quote:', err);
          setError(err.message || 'Failed to load quote');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadQuoteData();
  }, [id, getQuote, customers, fetchCustomers]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quote details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Quote</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="p-6 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Quote Not Found</h2>
          <p className="text-gray-600">The requested quote could not be found.</p>
        </div>
      </div>
    );
  }
  
  // Format the quote data for display
  const status = quote.status;
  
  // Format financial amounts
  const totalAmount = `$${quote.final_amount.toFixed(2)}`;
  const taxAmount = `$${quote.tax_amount.toFixed(2)}`;
  const subtotalAmount = `$${(quote.final_amount - quote.tax_amount).toFixed(2)}`;
  
  // For now, assume no payments made (all amount is outstanding)
  const amountOutstanding = totalAmount;
  const amountPaid = "$0.00";
  
  // Format customer billing info for display (matching CustomerInfoCard interface)
  const customerBilling = customer ? {
    name: `${customer.firstName} ${customer.lastName}`,
    company: customer.companyName || "",
    contact: `${customer.firstName} ${customer.lastName}`,
    address: customer.billingAddress?.address1 || "",
    unit: customer.billingAddress?.address2 || undefined,
    city: customer.billingAddress?.city || "",
    region: customer.billingAddress?.stateProvince || "",
    postalCode: customer.billingAddress?.zipCode || "",
    phone: customer.phoneNumber || "",
    email: customer.email || ""
  } : null;

  // Format customer shipping info for display (matching CustomerInfoCard interface)
  const customerShipping = customer ? {
    name: `${customer.firstName} ${customer.lastName}`,
    company: customer.companyName || "",
    contact: `${customer.firstName} ${customer.lastName}`,
    address: customer.shippingAddress?.address1 || "",
    unit: customer.shippingAddress?.address2 || undefined,
    city: customer.shippingAddress?.city || "",
    region: customer.shippingAddress?.stateProvince || "",
    postalCode: customer.shippingAddress?.zipCode || "",
    phone: customer.phoneNumber || "",
    email: customer.email || ""
  } : null;

  // Format customer info for PackingSlip component (uses old interface)
  const customerInfoForPacking = customer ? {
    name: `${customer.firstName} ${customer.lastName}`,
    companyName: customer.companyName || "",
    address1: customer.shippingAddress?.address1 || "",
    address2: customer.shippingAddress?.address2 || "",
    city: customer.shippingAddress?.city || "",
    stateProvince: customer.shippingAddress?.stateProvince || "",
    zipCode: customer.shippingAddress?.zipCode || "",
    country: customer.shippingAddress?.country || "Canada",
    phone: customer.phoneNumber || "",
    email: customer.email || ""
  } : null;
  
  // Format quote details for the details card
  const formattedDetails = {
    number: quote.quote_number,
    date: new Date(quote.created_at).toLocaleDateString(),
    expiryDate: quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : "N/A",
    productionDueDate: quote.production_due_date ? new Date(quote.production_due_date).toLocaleDateString() : "N/A",
    customerDueDate: quote.customer_due_date ? new Date(quote.customer_due_date).toLocaleDateString() : "N/A",
    salesRep: "N/A", // Column doesn't exist in database yet
    terms: quote.terms_conditions || "Net 30"
  };
  
  // Transform quote items for display (keeping existing format)
  const itemGroups = quote.items ? [{
    id: "quote-items",
    name: "Quote Items",
    items: quote.items.map(item => ({
      id: item.id,
      category: "Product",
      itemNumber: item.product_sku || "N/A",
      color: "N/A",
      description: item.product_name,
      sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, qty: item.quantity },
      qty: item.quantity,
      price: item.unit_price,
      taxed: true,
      total: item.total_price,
      status: "active",
      mockups: []
    })),
    imprints: []
  }] : [];
  
  // Create mock company info (keeping existing format)
  const companyInfo = {
    name: "InkIQ Print Solutions",
    address: "123 Business St",
    city: "Toronto", 
    province: "ON",
    postalCode: "M1A 1A1",
    phone: "(555) 123-4567",
    email: "info@inkiq.com"
  };

  // Format summary (keeping existing format)
  const quoteSummary = {
    subtotal: subtotalAmount,
    taxRate: `${(quote.tax_rate * 100).toFixed(1)}%`,
    taxAmount: taxAmount,
    totalDue: totalAmount
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-full">
        <QuoteDetailHeader 
          quoteId={quote.id} 
          quoteNumber={quote.quote_number}
          status={status} 
          customerInfo={customerInfoForPacking}
          items={quote.items || []}
        />

        <div className="space-y-6">
          {/* Company and Quote Details - top row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Company Information - top left */}
            <CompanyInfoCard company={companyInfo} />
            
            {/* Quote Details - top right */}
            <QuoteDetailsCard 
              details={formattedDetails} 
              totalAmount={totalAmount}
              amountPaid={amountPaid}
              amountOutstanding={amountOutstanding}
            />
          </div>
          
                    {/* Customer Information - second row */}
          {customer && (
          <div className="grid grid-cols-2 gap-6">
            {/* Billing Information */}
            <CustomerInfoCard 
              title="Customer Billing" 
                customerInfo={customerBilling} 
            />
            
            {/* Shipping Information */}
            <CustomerInfoCard 
              title="Customer Shipping" 
                customerInfo={customerShipping} 
            />
          </div>
          )}
          
          {/* Quote Items - full width */}
          {quote.items && quote.items.length > 0 && (
          <QuoteItemsTable itemGroups={itemGroups} quoteId={id} />
          )}
          
          {/* Notes and Invoice Summary - bottom row */}
          <div className="grid grid-cols-3 gap-6">
            {/* Customer Notes */}
            <NotesCard title="Customer Notes" content={quote.notes || "No customer notes"} />
            
            {/* Production Notes */}
            <NotesCard title="Production Notes" content={quote.description || "No production notes"} />
            
            {/* Invoice Summary */}
            <InvoiceSummaryCard summary={quoteSummary} />
          </div>
        </div>
    </div>
  );
}