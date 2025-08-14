import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface QuoteItem {
  id: string;
  product_name: string;
  product_sku?: string;
  product_description?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  imprint_type?: string;
  setup_fee: number;
  imprint_cost: number;
  notes?: string;
  created_at: string;
}

interface Quote {
  id: string;
  quote_number: string;
  customer_id: string;
  customer_name?: string;
  customer_company?: string;
  status: 'draft' | 'sent' | 'pending_approval' | 'approved' | 'rejected' | 'expired' | 'converted';
  subject?: string;
  description?: string;
  total_amount: number;
  tax_rate: number;
  tax_amount: number;
  discount_percentage: number;
  discount_amount: number;
  final_amount: number;
  valid_until: string;
  sent_date?: string;
  approved_date?: string;
  notes?: string;
  terms_conditions?: string;
  created_at: string;
  updated_at: string;
  items?: QuoteItem[];
}

interface QuotesContextType {
  quotes: Quote[];
  loading: boolean;
  error: string | null;
  createQuote: (quoteData: CreateQuoteData) => Promise<{ success: boolean; quote_id?: string; error?: string }>;
  getQuotes: (filters?: QuoteFilters) => Promise<void>;
  getQuote: (quoteId: string) => Promise<Quote | null>;
  updateQuoteStatus: (quoteId: string, status: Quote['status']) => Promise<{ success: boolean; error?: string }>;
  addQuoteItem: (quoteId: string, itemData: CreateQuoteItemData) => Promise<{ success: boolean; error?: string }>;
  removeQuoteItem: (quoteId: string, itemId: string) => Promise<{ success: boolean; error?: string }>;
  deleteQuote: (quoteId: string) => Promise<{ success: boolean; error?: string }>;
}

interface CreateQuoteData {
  customer_id: string;
  subject?: string;
  description?: string;
  tax_rate?: number;
  discount_percentage?: number;
  valid_until_days?: number;
  notes?: string;
  terms_conditions?: string;
  production_due_date?: Date;
  customer_due_date?: Date;
  payment_due_date?: Date;
  invoice_date?: Date;
  items?: CreateQuoteItemData[];
}

interface CreateQuoteItemData {
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_sku?: string;
  product_description?: string;
  category?: string;
  item_number?: string;
  color?: string;
  xs?: number;
  s?: number;
  m?: number;
  l?: number;
  xl?: number;
  xxl?: number;
  xxxl?: number;
  taxed?: boolean;
  garment_status?: string;
  imprint_type?: string;
  setup_fee?: number;
  imprint_cost?: number;
  notes?: string;
}

interface QuoteFilters {
  page_number?: number;
  page_size?: number;
  search_term?: string;
  status_filter?: string;
  customer_filter?: string;
  date_from?: string;
  date_to?: string;
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined);

export const useQuotes = () => {
  const context = useContext(QuotesContext);
  if (context === undefined) {
    throw new Error('useQuotes must be used within a QuotesProvider');
  }
  return context;
};

interface QuotesProviderProps {
  children: React.ReactNode;
}

export const QuotesProvider: React.FC<QuotesProviderProps> = ({ children }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get all quotes with optional filtering
  const getQuotes = async (filters: QuoteFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.rpc('get_quotes', {
        page_number: filters.page_number || 1,
        page_size: filters.page_size || 25,
        search_term: filters.search_term || null,
        status_filter: filters.status_filter || null,
        customer_filter: filters.customer_filter || null,
        date_from: filters.date_from || null,
        date_to: filters.date_to || null
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const quotesData = data[0].quotes;
        // Handle both array and null cases
        if (quotesData && Array.isArray(quotesData)) {
          setQuotes(quotesData);
        } else {
          setQuotes([]);
        }
      } else {
        setQuotes([]);
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
      // Log more details about the error
      if (err && typeof err === 'object' && 'message' in err) {
        setError(err.message as string);
      } else if (err && typeof err === 'object' && 'details' in err) {
        setError(err.details as string);
      } else {
        setError('Failed to fetch quotes');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get a single quote with items
  const getQuote = async (quoteId: string): Promise<Quote | null> => {
    try {
      const { data, error } = await supabase.rpc('get_quote', {
        p_quote_id: quoteId
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch quote');
      return null;
    }
  };

  // Create a new quote
  const createQuote = async (quoteData: CreateQuoteData) => {
    console.log("🔍 [DEBUG] QuotesContext - createQuote called with:", quoteData);
    try {
      // Pass items as array, not stringified JSON
      const itemsArray = quoteData.items || [];
      console.log("🔍 [DEBUG] QuotesContext - itemsArray:", itemsArray);

      const { data, error } = await supabase.rpc('create_quote_with_items', {
        customer_id: quoteData.customer_id,
        quote_subject: quoteData.subject,
        quote_description: quoteData.description,
        tax_rate: quoteData.tax_rate || 0,
        discount_percentage: quoteData.discount_percentage || 0,
        valid_until_days: quoteData.valid_until_days || 30,
        notes: quoteData.notes,
        terms_conditions: quoteData.terms_conditions,
        production_due_date: quoteData.production_due_date,
        customer_due_date: quoteData.customer_due_date,
        payment_due_date: quoteData.payment_due_date,
        invoice_date: quoteData.invoice_date,
        items: itemsArray
      });

      console.log("🔍 [DEBUG] QuotesContext - RPC response data:", data);
      console.log("🔍 [DEBUG] QuotesContext - RPC response error:", error);

      if (error) {
        console.error("🔍 [DEBUG] QuotesContext - RPC error details:", error);
        throw error;
      }

      console.log("🔍 [DEBUG] QuotesContext - Quote created successfully, refreshing quotes list");
      // Refresh quotes list
      await getQuotes();

      return { success: true, quote_id: data.quote_id, quote_number: data.quote_number };
    } catch (err) {
      console.error('Error creating quote:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create quote' 
      };
    }
  };

  // Add item to quote
  const addQuoteItem = async (quoteId: string, itemData: CreateQuoteItemData) => {
    try {
      const { data, error } = await supabase.rpc('add_quote_item', {
        quote_id: quoteId,
        product_name: itemData.product_name,
        quantity: itemData.quantity,
        unit_price: itemData.unit_price,
        product_sku: itemData.product_sku,
        product_description: itemData.product_description,
        imprint_type: itemData.imprint_type,
        setup_fee: itemData.setup_fee || 0,
        imprint_cost: itemData.imprint_cost || 0,
        notes: itemData.notes
      });

      if (error) throw error;

      // Refresh quotes list
      await getQuotes();

      return { success: true };
    } catch (err) {
      console.error('Error adding quote item:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to add quote item' 
      };
    }
  };

  // Remove item from quote
  const removeQuoteItem = async (quoteId: string, itemId: string) => {
    try {
      const { data, error } = await supabase.rpc('remove_quote_item', {
        quote_id: quoteId,
        item_id: itemId
      });

      if (error) throw error;

      // Refresh quotes list
      await getQuotes();

      return { success: true };
    } catch (err) {
      console.error('Error removing quote item:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to remove quote item' 
      };
    }
  };

  // Update quote status
  const updateQuoteStatus = async (quoteId: string, status: Quote['status']) => {
    try {
      const { data, error } = await supabase.rpc('update_quote_status', {
        quote_id: quoteId,
        new_status: status
      });

      if (error) throw error;

      // Refresh quotes list
      await getQuotes();

      return { success: true };
    } catch (err) {
      console.error('Error updating quote status:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update quote status' 
      };
    }
  };

  // Delete quote
  const deleteQuote = async (quoteId: string) => {
    console.log('🔍 [DEBUG] QuotesContext - deleteQuote called with ID:', quoteId);
    
    try {
      
      const { data, error } = await supabase.rpc('delete_quote', {
        p_quote_id: quoteId
      });

      if (error) {
        throw error;
      }

      console.log('🔍 [DEBUG] QuotesContext - Quote deletion successful');
      return { success: true };
    } catch (err) {
      console.error('🔍 [DEBUG] QuotesContext - Error deleting quote:', err);
      console.error('🔍 [DEBUG] QuotesContext - Error details:', {
        message: err instanceof Error ? err.message : 'Unknown error',
        details: err.details || 'No details',
        hint: err.hint || 'No hint',
        code: err.code || 'No code'
      });
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete quote' 
      };
    }
  };

  // Load quotes on mount
  useEffect(() => {
    getQuotes();
  }, []);

  const value: QuotesContextType = {
    quotes,
    loading,
    error,
    createQuote,
    getQuotes,
    getQuote,
    updateQuoteStatus,
    addQuoteItem,
    removeQuoteItem,
    deleteQuote
  };

  return (
    <QuotesContext.Provider value={value}>
      {children}
    </QuotesContext.Provider>
  );
};
