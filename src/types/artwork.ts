export interface MasterArtwork {
  id: string;
  customerId: string;
  customerName: string;
  designName: string;
  description?: string;
  method: string;
  size: {
    width: number;
    height: number;
    unit: 'in' | 'mm' | 'cm';
  };
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  
  // Files - each size has its own complete set of files
  customerArt: ArtworkFile[];
  productionFiles: ArtworkFile[];
  mockups: ArtworkFile[];
  
  // Metadata
  fileCount: number;
  totalSizeBytes: number;
  lastUsedAt?: Date;
  usageCount: number;
}

export interface ArtworkVariation {
  id: string;
  masterArtworkId: string;
  orderId?: string;
  quoteId?: string;
  
  // Variation-specific settings (NOT size - size creates new MasterArtwork)
  location: string;
  colors?: string;
  placement?: string;
  specialInstructions?: string;
  
  createdAt: Date;
  createdBy: string;
}

export interface ArtworkFile {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: string;
  sizeBytes: number;
  category: 'customerArt' | 'productionFiles' | 'mockups';
  uploadedAt: Date;
  uploadedBy: string;
  version: number;
  isLatest: boolean;
}

export interface CustomerArtworkLibrary {
  customerId: string;
  customerName: string;
  artworkCount: number;
  totalSizeBytes: number;
  lastActivity: Date;
  masterArtworks: MasterArtwork[];
}

export interface ArtworkSearchFilters {
  customerId?: string;
  method?: string[];
  designName?: string;
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  sizeRange?: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  };
  hasProductionFiles?: boolean;
  hasMockups?: boolean;
}

// Mock data for development
export const mockArtworkLibrary: CustomerArtworkLibrary[] = [
  {
    customerId: "cust-1",
    customerName: "Acme Corporation",
    artworkCount: 12,
    totalSizeBytes: 45000000,
    lastActivity: new Date('2024-01-15'),
    masterArtworks: [
      {
        id: "art-1",
        customerId: "cust-1",
        customerName: "Acme Corporation",
        designName: "Company Logo",
        description: "Main brand logo for apparel",
        method: "embroidery",
        size: { width: 3.5, height: 2.0, unit: 'in' },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        tags: ["logo", "brand", "corporate"],
        customerArt: [
          {
            id: "file-1",
            name: "acme-logo-vector.ai",
            originalName: "ACME_LOGO_FINAL.ai",
            url: "/lovable-uploads/sample-logo.png",
            type: "application/illustrator",
            sizeBytes: 2400000,
            category: "customerArt",
            uploadedAt: new Date('2024-01-01'),
            uploadedBy: "system",
            version: 1,
            isLatest: true
          }
        ],
        productionFiles: [
          {
            id: "file-2",
            name: "acme-logo-3-5x2-0.dst",
            originalName: "acme-logo-production.dst",
            url: "/lovable-uploads/sample-dst.dst",
            type: "application/dst",
            sizeBytes: 48000,
            category: "productionFiles",
            uploadedAt: new Date('2024-01-02'),
            uploadedBy: "production-team",
            version: 1,
            isLatest: true
          }
        ],
        mockups: [
          {
            id: "file-3",
            name: "acme-polo-navy-mockup.jpg",
            originalName: "polo-mockup.jpg",
            url: "/lovable-uploads/sample-mockup.jpg",
            type: "image/jpeg",
            sizeBytes: 890000,
            category: "mockups",
            uploadedAt: new Date('2024-01-03'),
            uploadedBy: "design-team",
            version: 1,
            isLatest: true
          }
        ],
        fileCount: 3,
        totalSizeBytes: 3338000,
        lastUsedAt: new Date('2024-01-15'),
        usageCount: 8
      },
      {
        id: "art-2",
        customerId: "cust-1",
        customerName: "Acme Corporation",
        designName: "Company Logo",
        description: "Large back placement version",
        method: "screenPrinting",
        size: { width: 8.0, height: 4.5, unit: 'in' },
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12'),
        tags: ["logo", "brand", "corporate", "large"],
        customerArt: [
          {
            id: "file-4",
            name: "acme-logo-large.ai",
            originalName: "ACME_LOGO_LARGE.ai",
            url: "/lovable-uploads/sample-logo-large.png",
            type: "application/illustrator",
            sizeBytes: 3200000,
            category: "customerArt",
            uploadedAt: new Date('2024-01-10'),
            uploadedBy: "system",
            version: 1,
            isLatest: true
          }
        ],
        productionFiles: [
          {
            id: "file-5",
            name: "acme-logo-8x4-5-separations.zip",
            originalName: "acme-large-separations.zip",
            url: "/lovable-uploads/sample-separations.zip",
            type: "application/zip",
            sizeBytes: 12400000,
            category: "productionFiles",
            uploadedAt: new Date('2024-01-11'),
            uploadedBy: "production-team",
            version: 1,
            isLatest: true
          }
        ],
        mockups: [],
        fileCount: 2,
        totalSizeBytes: 15600000,
        lastUsedAt: new Date('2024-01-12'),
        usageCount: 3
      }
    ]
  },
  {
    customerId: "cust-2",
    customerName: "TechStart Inc",
    artworkCount: 5,
    totalSizeBytes: 18500000,
    lastActivity: new Date('2024-01-18'),
    masterArtworks: [
      {
        id: "art-3",
        customerId: "cust-2",
        customerName: "TechStart Inc",
        designName: "Tech Logo",
        description: "Minimalist tech company logo",
        method: "dtg",
        size: { width: 4.0, height: 3.0, unit: 'in' },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18'),
        tags: ["logo", "tech", "minimalist"],
        customerArt: [
          {
            id: "file-6",
            name: "techstart-logo.png",
            originalName: "TechStart_Logo.png",
            url: "/lovable-uploads/sample-tech-logo.png",
            type: "image/png",
            sizeBytes: 1800000,
            category: "customerArt",
            uploadedAt: new Date('2024-01-15'),
            uploadedBy: "system",
            version: 1,
            isLatest: true
          }
        ],
        productionFiles: [
          {
            id: "file-7",
            name: "techstart-logo-4x3-dtg.png",
            originalName: "techstart-production.png",
            url: "/lovable-uploads/sample-dtg.png",
            type: "image/png",
            sizeBytes: 2400000,
            category: "productionFiles",
            uploadedAt: new Date('2024-01-16'),
            uploadedBy: "production-team",
            version: 1,
            isLatest: true
          }
        ],
        mockups: [
          {
            id: "file-8",
            name: "techstart-tshirt-black.jpg",
            originalName: "tshirt-mockup.jpg",
            url: "/lovable-uploads/sample-tshirt-mockup.jpg",
            type: "image/jpeg",
            sizeBytes: 950000,
            category: "mockups",
            uploadedAt: new Date('2024-01-17'),
            uploadedBy: "design-team",
            version: 1,
            isLatest: true
          }
        ],
        fileCount: 3,
        totalSizeBytes: 5150000,
        lastUsedAt: new Date('2024-01-18'),
        usageCount: 2
      }
    ]
  }
];