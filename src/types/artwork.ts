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

export interface ArtworkFolder {
  id: string;
  name: string;
  method: string;
  artworks: MasterArtwork[];
  artworkCount: number;
  totalSizeBytes: number;
  lastUpdatedAt: Date;
}

export interface CustomerArtworkLibrary {
  customerId: string;
  customerName: string;
  folders: ArtworkFolder[];
  masterArtworks: MasterArtwork[]; // Keep for backward compatibility
  artworkCount: number;
  totalSizeBytes: number;
  lastUpdatedAt: Date;
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
    customerName: "Tech Solutions Inc",
    folders: [
      {
        id: "folder-sp-1",
        name: "Screen Printing",
        method: "screenPrinting",
        artworkCount: 3,
        totalSizeBytes: 15728640,
        lastUpdatedAt: new Date("2024-01-15"),
        artworks: [
          {
            id: "art-1",
            customerId: "cust-1",
            customerName: "Tech Solutions Inc",
            designName: "Company Logo - Large",
            description: "Main brand logo for back placement",
            method: "screenPrinting",
            size: { width: 8.0, height: 4.5, unit: 'in' },
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-15"),
            tags: ["logo", "brand", "corporate", "large"],
            customerArt: [
              {
                id: "file-1",
                name: "tech-logo-large.ai",
                originalName: "TECH_LOGO_LARGE.ai",
                url: "/lovable-uploads/sample-logo-large.png",
                type: "application/illustrator",
                sizeBytes: 3200000,
                category: "customerArt",
                uploadedAt: new Date("2024-01-01"),
                uploadedBy: "system",
                version: 1,
                isLatest: true
              }
            ],
            productionFiles: [
              {
                id: "file-2",
                name: "tech-logo-8x4-5-separations.zip",
                originalName: "tech-large-separations.zip",
                url: "/lovable-uploads/sample-separations.zip",
                type: "application/zip",
                sizeBytes: 12400000,
                category: "productionFiles",
                uploadedAt: new Date("2024-01-02"),
                uploadedBy: "production-team",
                version: 1,
                isLatest: true
              }
            ],
            mockups: [
              {
                id: "file-3",
                name: "tech-tshirt-back-mockup.jpg",
                originalName: "tshirt-back-mockup.jpg",
                url: "/lovable-uploads/sample-tshirt-back.jpg",
                type: "image/jpeg",
                sizeBytes: 950000,
                category: "mockups",
                uploadedAt: new Date("2024-01-03"),
                uploadedBy: "design-team",
                version: 1,
                isLatest: true
              }
            ],
            fileCount: 3,
            totalSizeBytes: 16550000,
            usageCount: 15,
            lastUsedAt: new Date("2024-01-15")
          },
          {
            id: "art-2",
            customerId: "cust-1",
            customerName: "Tech Solutions Inc",
            designName: "Tagline Design",
            description: "Corporate tagline for sleeve printing",
            method: "screenPrinting",
            size: { width: 6.0, height: 1.5, unit: 'in' },
            createdAt: new Date("2024-01-05"),
            updatedAt: new Date("2024-01-10"),
            tags: ["tagline", "text", "sleeve"],
            customerArt: [
              {
                id: "file-4",
                name: "tech-tagline.ai",
                originalName: "TECH_TAGLINE.ai",
                url: "/lovable-uploads/sample-tagline.png",
                type: "application/illustrator",
                sizeBytes: 1200000,
                category: "customerArt",
                uploadedAt: new Date("2024-01-05"),
                uploadedBy: "system",
                version: 1,
                isLatest: true
              }
            ],
            productionFiles: [
              {
                id: "file-5",
                name: "tech-tagline-6x1-5.eps",
                originalName: "tagline-production.eps",
                url: "/lovable-uploads/sample-tagline-prod.eps",
                type: "application/postscript",
                sizeBytes: 800000,
                category: "productionFiles",
                uploadedAt: new Date("2024-01-06"),
                uploadedBy: "production-team",
                version: 1,
                isLatest: true
              }
            ],
            mockups: [],
            fileCount: 2,
            totalSizeBytes: 2000000,
            usageCount: 8,
            lastUsedAt: new Date("2024-01-10")
          },
          {
            id: "art-3",
            customerId: "cust-1",
            customerName: "Tech Solutions Inc",
            designName: "Department Badge",
            description: "IT department identification badge",
            method: "screenPrinting",
            size: { width: 3.0, height: 3.0, unit: 'in' },
            createdAt: new Date("2024-01-08"),
            updatedAt: new Date("2024-01-12"),
            tags: ["badge", "department", "IT"],
            customerArt: [
              {
                id: "file-6",
                name: "it-badge.ai",
                originalName: "IT_BADGE.ai",
                url: "/lovable-uploads/sample-badge.png",
                type: "application/illustrator",
                sizeBytes: 1500000,
                category: "customerArt",
                uploadedAt: new Date("2024-01-08"),
                uploadedBy: "system",
                version: 1,
                isLatest: true
              }
            ],
            productionFiles: [
              {
                id: "file-7",
                name: "it-badge-3x3.pdf",
                originalName: "badge-production.pdf",
                url: "/lovable-uploads/sample-badge-prod.pdf",
                type: "application/pdf",
                sizeBytes: 900000,
                category: "productionFiles",
                uploadedAt: new Date("2024-01-09"),
                uploadedBy: "production-team",
                version: 1,
                isLatest: true
              }
            ],
            mockups: [
              {
                id: "file-8",
                name: "badge-polo-mockup.jpg",
                originalName: "polo-badge-mockup.jpg",
                url: "/lovable-uploads/sample-polo-badge.jpg",
                type: "image/jpeg",
                sizeBytes: 750000,
                category: "mockups",
                uploadedAt: new Date("2024-01-10"),
                uploadedBy: "design-team",
                version: 1,
                isLatest: true
              }
            ],
            fileCount: 3,
            totalSizeBytes: 3150000,
            usageCount: 12,
            lastUsedAt: new Date("2024-01-12")
          }
        ]
      },
      {
        id: "folder-emb-1",
        name: "Embroidery",
        method: "embroidery",
        artworkCount: 2,
        totalSizeBytes: 8388608,
        lastUpdatedAt: new Date("2024-01-10"),
        artworks: [
          {
            id: "art-emb-1",
            customerId: "cust-1",
            customerName: "Tech Solutions Inc",
            designName: "Company Logo - Embroidered",
            method: "embroidery",
            size: { width: 4, height: 2.5, unit: 'in' },
            description: "Company logo optimized for embroidery",
            tags: ["logo", "corporate", "brand"],
            customerArt: [
              {
                id: "file-emb-1",
                name: "tech-logo-vector.ai",
                originalName: "TECH_LOGO_EMB.ai",
                type: "application/illustrator",
                url: "/lovable-uploads/tech-logo-vector.ai",
                sizeBytes: 2097152,
                category: "customerArt",
                uploadedAt: new Date("2024-01-05"),
                uploadedBy: "john@techsolutions.com",
                version: 1,
                isLatest: true
              }
            ],
            productionFiles: [
              {
                id: "file-emb-prod-1",
                name: "tech-logo.dst",
                originalName: "tech-logo-production.dst",
                type: "application/dst",
                url: "/lovable-uploads/tech-logo.dst",
                sizeBytes: 524288,
                category: "productionFiles",
                uploadedAt: new Date("2024-01-06"),
                uploadedBy: "production@company.com",
                version: 1,
                isLatest: true
              }
            ],
            mockups: [
              {
                id: "mockup-emb-1",
                name: "tech-polo-embroidery.jpg",
                originalName: "polo-embroidery-mockup.jpg",
                type: "image/jpeg",
                url: "/lovable-uploads/tech-polo-embroidery.jpg",
                sizeBytes: 1048576,
                category: "mockups",
                uploadedAt: new Date("2024-01-07"),
                uploadedBy: "design@company.com",
                version: 1,
                isLatest: true
              }
            ],
            fileCount: 3,
            totalSizeBytes: 3669016,
            createdAt: new Date("2024-01-05"),
            updatedAt: new Date("2024-01-08"),
            usageCount: 6,
            lastUsedAt: new Date("2024-01-08")
          }
        ]
      }
    ],
    masterArtworks: [], // Keep for backward compatibility
    artworkCount: 5,
    totalSizeBytes: 24117248,
    lastUpdatedAt: new Date("2024-01-15")
  },
  {
    customerId: "cust-2",
    customerName: "Outdoor Adventures LLC",
    folders: [
      {
        id: "folder-dtg-1",
        name: "DTG",
        method: "dtg",
        artworkCount: 2,
        totalSizeBytes: 12582912,
        lastUpdatedAt: new Date("2024-01-18"),
        artworks: [
          {
            id: "art-dtg-1",
            customerId: "cust-2",
            customerName: "Outdoor Adventures LLC",
            designName: "Mountain Logo",
            description: "Outdoor adventure company logo",
            method: "dtg",
            size: { width: 5.0, height: 4.0, unit: 'in' },
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-18"),
            tags: ["logo", "outdoor", "mountain"],
            customerArt: [
              {
                id: "file-dtg-1",
                name: "mountain-logo.png",
                originalName: "MOUNTAIN_LOGO.png",
                url: "/lovable-uploads/mountain-logo.png",
                type: "image/png",
                sizeBytes: 4194304,
                category: "customerArt",
                uploadedAt: new Date("2024-01-15"),
                uploadedBy: "system",
                version: 1,
                isLatest: true
              }
            ],
            productionFiles: [
              {
                id: "file-dtg-prod-1",
                name: "mountain-logo-5x4-dtg.png",
                originalName: "mountain-production.png",
                url: "/lovable-uploads/mountain-dtg.png",
                type: "image/png",
                sizeBytes: 6291456,
                category: "productionFiles",
                uploadedAt: new Date("2024-01-16"),
                uploadedBy: "production-team",
                version: 1,
                isLatest: true
              }
            ],
            mockups: [
              {
                id: "file-dtg-mockup-1",
                name: "mountain-tshirt-green.jpg",
                originalName: "tshirt-green-mockup.jpg",
                url: "/lovable-uploads/mountain-tshirt.jpg",
                type: "image/jpeg",
                sizeBytes: 2097152,
                category: "mockups",
                uploadedAt: new Date("2024-01-17"),
                uploadedBy: "design-team",
                version: 1,
                isLatest: true
              }
            ],
            fileCount: 3,
            totalSizeBytes: 12582912,
            lastUsedAt: new Date("2024-01-18"),
            usageCount: 4
          }
        ]
      }
    ],
    masterArtworks: [], // Keep for backward compatibility
    artworkCount: 2,
    totalSizeBytes: 12582912,
    lastUpdatedAt: new Date("2024-01-18")
  }
];