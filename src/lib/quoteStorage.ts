import { QuotationData } from "@/components/quotes/QuoteData";

const STORAGE_KEY = "saved_quotes";

export interface SavedQuote extends QuotationData {
  lastModified: string;
}

export const quoteStorage = {
  // Save a quote to localStorage
  saveQuote: (quoteId: string, quoteData: QuotationData): void => {
    try {
      const savedQuotes = quoteStorage.getAllSavedQuotes();
      const savedQuote: SavedQuote = {
        ...quoteData,
        lastModified: new Date().toISOString()
      };
      
      savedQuotes[quoteId] = savedQuote;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedQuotes));
      
      console.log(`Quote ${quoteId} saved to localStorage`, savedQuote);
    } catch (error) {
      console.error("Failed to save quote to localStorage:", error);
    }
  },

  // Load a specific quote from localStorage
  loadQuote: (quoteId: string): SavedQuote | null => {
    try {
      const savedQuotes = quoteStorage.getAllSavedQuotes();
      return savedQuotes[quoteId] || null;
    } catch (error) {
      console.error("Failed to load quote from localStorage:", error);
      return null;
    }
  },

  // Get all saved quotes
  getAllSavedQuotes: (): Record<string, SavedQuote> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Failed to parse saved quotes from localStorage:", error);
      return {};
    }
  },

  // Update quote with new item groups (for imprints)
  updateQuoteItemGroups: (quoteId: string, itemGroups: any[]): void => {
    try {
      const savedQuote = quoteStorage.loadQuote(quoteId);
      if (savedQuote) {
        savedQuote.items = itemGroups;
        savedQuote.lastModified = new Date().toISOString();
        quoteStorage.saveQuote(quoteId, savedQuote);
      }
    } catch (error) {
      console.error("Failed to update quote item groups:", error);
    }
  },

  // Check if a quote has been saved/modified
  hasBeenModified: (quoteId: string): boolean => {
    return quoteStorage.loadQuote(quoteId) !== null;
  },

  // Clear all saved quotes (for debugging)
  clearAll: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("All saved quotes cleared from localStorage");
    } catch (error) {
      console.error("Failed to clear saved quotes:", error);
    }
  }
};