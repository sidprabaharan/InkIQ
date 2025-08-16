// Utility for managing quote data and images in localStorage during quote creation

export interface StoredQuoteImage {
  id: string;
  name: string;
  type: string;
  dataUrl: string; // Base64 data URL
  uploadedAt: string;
  itemId?: string;
  imprintId?: string;
  fileType: 'customer_art' | 'production_file' | 'proof_mockup';
}

export interface StoredQuoteData {
  id: string;
  images: StoredQuoteImage[];
  itemGroups: any[]; // Will store the full itemGroups data
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'inkiq_quote_draft';

// Clean up old localStorage data to free space
export const cleanupOldStorageData = (): void => {
  try {
    // Remove any old draft data that might be taking up space
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('old_') || key.includes('temp_') || key.includes('cache_'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log(`🧹 Cleaned up ${keysToRemove.length} old storage items`);
  } catch (error) {
    console.error('Error cleaning up storage:', error);
  }
};

// Convert File to base64 data URL with compression
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // For images, compress them to reduce storage size
    if (file.type.startsWith('image/')) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Limit maximum dimensions to reduce file size
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality to reduce size
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      
      img.onerror = reject;
      
      const reader = new FileReader();
      reader.onload = () => img.src = reader.result as string;
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      // For non-images, use normal base64 encoding
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }
  });
};

// Convert data URL back to File
export const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

// Save quote draft to localStorage
export const saveQuoteDraft = (quoteData: Partial<StoredQuoteData>): void => {
  try {
    const existing = getQuoteDraft();
    const updated: StoredQuoteData = {
      id: existing?.id || `draft_${Date.now()}`,
      images: quoteData.images || existing?.images || [],
      itemGroups: quoteData.itemGroups || existing?.itemGroups || [],
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...quoteData
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving quote draft:', error);
  }
};

// Get quote draft from localStorage
export const getQuoteDraft = (): StoredQuoteData | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return parsed;
  } catch (error) {
    console.error('Error retrieving quote draft:', error);
    return null;
  }
};

// Add image to quote draft
export const addImageToQuoteDraft = async (
  file: File,
  fileType: StoredQuoteImage['fileType'],
  itemId?: string,
  imprintId?: string
): Promise<StoredQuoteImage> => {
  try {
    // Clean up old data first to free space
    cleanupOldStorageData();
    
    const dataUrl = await fileToDataUrl(file);
    const imageData: StoredQuoteImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      dataUrl,
      uploadedAt: new Date().toISOString(),
      itemId,
      imprintId,
      fileType
    };
    
    const existing = getQuoteDraft();
    
    // Limit total images to prevent quota issues
    const existingImages = existing?.images || [];
    const maxImages = 5; // Limit to 5 images total
    
    let updatedImages = [...existingImages, imageData];
    if (updatedImages.length > maxImages) {
      // Remove oldest images first
      updatedImages = updatedImages
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
        .slice(0, maxImages);
    }
    
    saveQuoteDraft({ images: updatedImages });
    
    console.log(`📷 Image stored: ${file.name} (${Math.round(dataUrl.length / 1024)}KB)`);
    return imageData;
  } catch (error) {
    console.error('Error adding image to quote draft:', error);
    // If quota exceeded, try clearing old draft and retry once
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      try {
        console.log('🧹 Quota exceeded, clearing old draft and retrying...');
        clearQuoteDraft();
        cleanupOldStorageData();
        
        const dataUrl = await fileToDataUrl(file);
        const imageData: StoredQuoteImage = {
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          dataUrl,
          uploadedAt: new Date().toISOString(),
          itemId,
          imprintId,
          fileType
        };
        
        saveQuoteDraft({ images: [imageData] });
        return imageData;
      } catch (retryError) {
        console.error('Failed to save even after cleanup:', retryError);
        throw new Error('Storage quota exceeded. Please try with a smaller image.');
      }
    }
    throw error;
  }
};

// Get images for a specific item
export const getImagesForItem = (itemId: string): StoredQuoteImage[] => {
  const draft = getQuoteDraft();
  if (!draft) return [];
  
  return draft.images.filter(img => img.itemId === itemId);
};

// Get images by type
export const getImagesByType = (fileType: StoredQuoteImage['fileType']): StoredQuoteImage[] => {
  const draft = getQuoteDraft();
  if (!draft) return [];
  
  return draft.images.filter(img => img.fileType === fileType);
};

// Clear quote draft
export const clearQuoteDraft = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing quote draft:', error);
  }
};

// Update item groups in draft
export const updateItemGroupsInDraft = (itemGroups: any[]): void => {
  try {
    saveQuoteDraft({ itemGroups });
  } catch (error) {
    console.error('Error updating item groups in draft:', error);
  }
};
