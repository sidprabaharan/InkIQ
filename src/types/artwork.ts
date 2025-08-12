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
  colors?: string; // For mockups with color variants
  notes?: string; // For mockup notes
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

// Shared imprints that can be reused across multiple customers
export interface SharedImprint {
  id: string;
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
  
  // Files for this imprint design
  customerArt: ArtworkFile[];
  productionFiles: ArtworkFile[];
  mockups: ArtworkFile[];
  
  // Usage tracking
  usageCount: number;
  lastUsedAt?: Date;
  
  // Customers who have used this imprint
  associatedCustomers: CustomerImprintUsage[];
}

export interface CustomerImprintUsage {
  customerId: string;
  customerName: string;
  usageCount: number;
  lastUsedAt: Date;
  orders?: string[]; // Order IDs where this imprint was used
}

// Mock shared imprints data
export const mockSharedImprints: SharedImprint[] = [
  {
    id: "shared-flag-1",
    designName: "American Flag",
    description: "Classic American flag design for sleeve embroidery",
    method: "embroidery",
    size: { width: 3.5, height: 2.25, unit: 'in' },
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-25"),
    tags: ["flag", "patriotic", "america", "sleeve"],
    customerArt: [
      {
        id: "flag-art-1",
        name: "american-flag.png",
        originalName: "AMERICAN_FLAG.png",
        url: "/lovable-uploads/1389bca3-3c1f-4978-b35f-a425ebd5abec.png",
        type: "image/png",
        sizeBytes: 1800000,
        category: "customerArt",
        uploadedAt: new Date("2024-01-01"),
        uploadedBy: "system",
        version: 1,
        isLatest: true
      }
    ],
    productionFiles: [
      {
        id: "flag-prod-1",
        name: "american-flag-3.5x2.25.dst",
        originalName: "flag-production.dst",
        url: "/lovable-uploads/american-flag.dst",
        type: "application/dst",
        sizeBytes: 324288,
        category: "productionFiles",
        uploadedAt: new Date("2024-01-02"),
        uploadedBy: "production@company.com",
        version: 1,
        isLatest: true
      },
      {
        id: "flag-prod-2",
        name: "american-flag-color-map.pdf",
        originalName: "flag-color-guide.pdf",
        url: "/lovable-uploads/flag-color-map.pdf",
        type: "application/pdf",
        sizeBytes: 512000,
        category: "productionFiles",
        uploadedAt: new Date("2024-01-02"),
        uploadedBy: "production@company.com",
        version: 1,
        isLatest: true
      }
    ],
    mockups: [
      {
        id: "flag-mockup-1",
        name: "polo-sleeve-flag-mockup.jpg",
        originalName: "polo-flag-mockup.jpg",
        url: "/lovable-uploads/polo-flag-mockup.jpg",
        type: "image/jpeg",
        sizeBytes: 1200000,
        category: "mockups",
        uploadedAt: new Date("2024-01-03"),
        uploadedBy: "design@company.com",
        version: 1,
        isLatest: true,
        colors: "1147, 1000, 1076",
        notes: "Standard polo sleeve placement on navy fabric"
      },
      {
        id: "flag-mockup-2",
        name: "jacket-sleeve-flag-mockup.jpg",
        originalName: "jacket-flag-mockup.jpg",
        url: "/lovable-uploads/jacket-flag-mockup.jpg",
        type: "image/jpeg",
        sizeBytes: 1400000,
        category: "mockups",
        uploadedAt: new Date("2024-01-04"),
        uploadedBy: "design@company.com",
        version: 1,
        isLatest: true,
        colors: "5012, 5005, 1000",
        notes: "Windbreaker jacket with sleeve embroidery"
      },
      {
        id: "flag-mockup-3",
        name: "polo-sleeve-flag-alt-mockup.jpg",
        originalName: "polo-flag-alt-mockup.jpg",
        url: "/lovable-uploads/polo-flag-alt-mockup.jpg",
        type: "image/jpeg",
        sizeBytes: 1300000,
        category: "mockups",
        uploadedAt: new Date("2024-01-05"),
        uploadedBy: "design@company.com",
        version: 1,
        isLatest: true,
        colors: "1134, 1142, 1082",
        notes: "Vintage color palette on cream polo shirt"
      }
    ],
    usageCount: 15,
    lastUsedAt: new Date("2024-01-25"),
    associatedCustomers: [
      {
        customerId: "cust-1",
        customerName: "Tech Solutions Inc",
        usageCount: 3,
        lastUsedAt: new Date("2024-01-15"),
        orders: ["order-1", "order-2", "order-3"]
      },
      {
        customerId: "cust-2",
        customerName: "Outdoor Adventures LLC",
        usageCount: 5,
        lastUsedAt: new Date("2024-01-20"),
        orders: ["order-4", "order-5", "order-6", "order-7", "order-8"]
      },
      {
        customerId: "cust-3",
        customerName: "Local Fire Department",
        usageCount: 4,
        lastUsedAt: new Date("2024-01-25"),
        orders: ["order-9", "order-10", "order-11", "order-12"]
      },
      {
        customerId: "cust-4",
        customerName: "Veterans Association",
        usageCount: 3,
        lastUsedAt: new Date("2024-01-22"),
        orders: ["order-13", "order-14", "order-15"]
      }
    ]
  }
];

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
        artworkCount: 5,
        totalSizeBytes: 15728640,
        lastUpdatedAt: new Date("2024-01-15"),
        artworks: [
          {
            id: "art-1",
            customerId: "cust-1",
            customerName: "Tech Solutions Inc",
            designName: "New Balance Logo",
            description: "Athletic brand logo for sportswear",
            method: "screenPrinting",
            size: { width: 8.0, height: 4.5, unit: 'in' },
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-15"),
            tags: ["logo", "brand", "sports", "athletic"],
            customerArt: [
              {
                id: "file-1",
                name: "new-balance-logo.png",
                originalName: "NEW_BALANCE_LOGO.png",
                url: "/lovable-uploads/e9713f4e-7367-4115-8087-c64e8f7e5f97.png",
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
            designName: "Meta Logo",
            description: "Social media platform logo",
            method: "screenPrinting",
            size: { width: 6.0, height: 3.0, unit: 'in' },
            createdAt: new Date("2024-01-05"),
            updatedAt: new Date("2024-01-10"),
            tags: ["logo", "tech", "social"],
            customerArt: [
              {
                id: "file-4",
                name: "meta-logo.png",
                originalName: "META_LOGO.png",
                url: "/lovable-uploads/c12ad370-28d5-42a2-838c-8d3388b49c33.png",
                type: "image/png",
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
            designName: "Google Logo",
            description: "Search engine company logo",
            method: "screenPrinting",
            size: { width: 5.0, height: 5.0, unit: 'in' },
            createdAt: new Date("2024-01-08"),
            updatedAt: new Date("2024-01-12"),
            tags: ["logo", "tech", "search"],
            customerArt: [
              {
                id: "file-6",
                name: "google-logo.png",
                originalName: "GOOGLE_LOGO.png",
                url: "/lovable-uploads/17292a67-be65-4f9f-82c3-2d20627338c4.png",
                type: "image/png",
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
          },
          {
            id: "art-4",
            customerId: "cust-1",
            customerName: "Tech Solutions Inc",
            designName: "Roblox Logo",
            description: "Gaming platform logo",
            method: "screenPrinting",
            size: { width: 7.0, height: 2.5, unit: 'in' },
            createdAt: new Date("2024-01-09"),
            updatedAt: new Date("2024-01-13"),
            tags: ["logo", "gaming", "entertainment"],
            customerArt: [
              {
                id: "file-9",
                name: "roblox-logo.png",
                originalName: "ROBLOX_LOGO.png",
                url: "/lovable-uploads/b6957015-b6e7-4007-a541-18eb1ca308df.png",
                type: "image/png",
                sizeBytes: 1800000,
                category: "customerArt",
                uploadedAt: new Date("2024-01-09"),
                uploadedBy: "system",
                version: 1,
                isLatest: true
              }
            ],
            productionFiles: [],
            mockups: [],
            fileCount: 1,
            totalSizeBytes: 1800000,
            usageCount: 3,
            lastUsedAt: new Date("2024-01-13")
          },
          {
            id: "art-5",
            customerId: "cust-1",
            customerName: "Tech Solutions Inc",
            designName: "Montreal Canadiens Logo",
            description: "Hockey team logo",
            method: "screenPrinting",
            size: { width: 4.0, height: 4.0, unit: 'in' },
            createdAt: new Date("2024-01-11"),
            updatedAt: new Date("2024-01-14"),
            tags: ["logo", "sports", "hockey", "team"],
            customerArt: [
              {
                id: "file-10",
                name: "canadiens-logo.png",
                originalName: "CANADIENS_LOGO.png",
                url: "/lovable-uploads/502332de-5922-4ffd-aaa5-a5a0f852cdbf.png",
                type: "image/png",
                sizeBytes: 2200000,
                category: "customerArt",
                uploadedAt: new Date("2024-01-11"),
                uploadedBy: "system",
                version: 1,
                isLatest: true
              }
            ],
            productionFiles: [],
            mockups: [],
            fileCount: 1,
            totalSizeBytes: 2200000,
            usageCount: 7,
            lastUsedAt: new Date("2024-01-14")
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
            designName: "Selwyn House Logo",
            method: "embroidery",
            size: { width: 4, height: 2.5, unit: 'in' },
            description: "School crest embroidered design",
            tags: ["logo", "school", "education", "crest"],
            customerArt: [
              {
                id: "file-emb-1",
                name: "selwyn-house-logo.png",
                originalName: "SELWYN_HOUSE_LOGO.png",
                type: "image/png",
                url: "/lovable-uploads/656aa569-348f-4e5a-8b8a-877b9a08c9b2.png",
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
          },
          {
            id: "art-emb-2",
            customerId: "cust-1",
            customerName: "Tech Solutions Inc",
            designName: "Rocket Logo",
            description: "Embroidered rocket design for uniforms",
            method: "embroidery",
            size: { width: 3, height: 4, unit: 'in' },
            tags: ["logo", "sports", "team"],
            customerArt: [
              {
                id: "file-emb-2",
                name: "rocket-logo.png",
                originalName: "ROCKET_LOGO.png",
                type: "image/png",
                url: "/lovable-uploads/0d4a8056-1772-4be5-92f4-0f40dacc6db2.png",
                sizeBytes: 1800000,
                category: "customerArt",
                uploadedAt: new Date("2024-01-12"),
                uploadedBy: "design@company.com",
                version: 1,
                isLatest: true
              }
            ],
            productionFiles: [],
            mockups: [],
            fileCount: 1,
            totalSizeBytes: 1800000,
            createdAt: new Date("2024-01-12"),
            updatedAt: new Date("2024-01-16"),
            usageCount: 4,
            lastUsedAt: new Date("2024-01-16")
          }
        ]
      },
      {
        id: "folder-dtf-1",
        name: "DTF",
        method: "dtf",
        artworkCount: 1,
        totalSizeBytes: 2500000,
        lastUpdatedAt: new Date("2024-01-20"),
        artworks: [
          {
            id: "art-dtf-1",
            customerId: "cust-1",
            customerName: "Tech Solutions Inc",
            designName: "Delta Logo",
            description: "Eagle design for DTF transfer",
            method: "dtf",
            size: { width: 6, height: 5, unit: 'in' },
            tags: ["logo", "aviation", "wings"],
            customerArt: [
              {
                id: "file-dtf-1",
                name: "delta-logo.png",
                originalName: "DELTA_LOGO.png",
                type: "image/png",
                url: "/lovable-uploads/5bcd406d-69fb-43a9-ba39-edec9bab0f1d.png",
                sizeBytes: 2500000,
                category: "customerArt",
                uploadedAt: new Date("2024-01-20"),
                uploadedBy: "system",
                version: 1,
                isLatest: true
              }
            ],
            productionFiles: [],
            mockups: [],
            fileCount: 1,
            totalSizeBytes: 2500000,
            createdAt: new Date("2024-01-20"),
            updatedAt: new Date("2024-01-20"),
            usageCount: 1,
            lastUsedAt: new Date("2024-01-20")
          }
        ]
      }
    ],
    masterArtworks: [], // Keep for backward compatibility
    artworkCount: 8,
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