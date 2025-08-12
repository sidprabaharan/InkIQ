import { SavedImprint } from '../types/saved-imprint';

export const mockSavedImprints: SavedImprint[] = [
  {
    id: "si-001",
    name: "TechCorp Logo - Main",
    customerId: "cust-001",
    customerName: "TechCorp Solutions",
    decorationMethod: "screenPrinting",
    location: "Front Left Chest",
    description: "Primary company logo for corporate apparel",
    tags: ["logo", "corporate", "main"],
    files: {
      customerArt: [
        {
          id: "ca-001",
          name: "TechCorp_Logo_Vector.ai",
          url: "/public/lovable-uploads/tech-logo-4.jpg",
          type: "ai",
          category: "customerArt"
        }
      ],
      productionFiles: [
        {
          id: "pf-001",
          name: "TechCorp_Screen_Ready.eps",
          url: "/public/lovable-uploads/tech-logo-4.jpg",
          type: "eps",
          category: "productionFiles"
        }
      ],
      proofMockup: [
        {
          id: "pm-001",
          name: "TechCorp_Polo_Mockup.jpg",
          url: "/lovable-uploads/a3c6309c-2b25-460d-b162-012808bc9c81.png",
          type: "jpg",
          category: "proofMockup"
        },
        {
          id: "pm-002",
          name: "TechCorp_Tshirt_Mockup.jpg",
          url: "/lovable-uploads/4b14e34b-748e-45d1-9671-629495df105d.png",
          type: "jpg",
          category: "proofMockup"
        }
      ]
    },
    dimensions: { width: 3.5, height: 2.0 },
    colors: "PMS 286 Blue, White",
    notes: "Use white underbase on dark garments",
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-20'),
    usageCount: 12
  },
  {
    id: "si-002",
    name: "TechCorp Logo - Back",
    customerId: "cust-001",
    customerName: "TechCorp Solutions",
    decorationMethod: "screenPrinting",
    location: "Back Center",
    description: "Large back logo for event shirts",
    tags: ["logo", "corporate", "large"],
    files: {
      customerArt: [
        {
          id: "ca-002",
          name: "TechCorp_Logo_Large.ai",
          url: "/lovable-uploads/77e97aa8-3c5c-4ff6-8bcd-c7423ad1ba9c.png",
          type: "ai",
          category: "customerArt"
        }
      ],
      productionFiles: [
        {
          id: "pf-002",
          name: "TechCorp_Large_Screen.eps",
          url: "/lovable-uploads/77e97aa8-3c5c-4ff6-8bcd-c7423ad1ba9c.png",
          type: "eps",
          category: "productionFiles"
        }
      ],
      proofMockup: [
        {
          id: "pm-003",
          name: "TechCorp_Back_Mockup.jpg",
          url: "/lovable-uploads/4916f36f-5c0f-4f85-b192-02a45d68a412.png",
          type: "jpg",
          category: "proofMockup"
        }
      ]
    },
    dimensions: { width: 10.0, height: 8.0 },
    colors: "PMS 286 Blue, White",
    notes: "Large format for event merchandise",
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    usageCount: 5
  },
  {
    id: "si-003",
    name: "Mountain Restaurant Logo",
    customerId: "cust-002",
    customerName: "Mountain View Restaurant",
    decorationMethod: "embroidery",
    location: "Front Left Chest",
    description: "Restaurant logo embroidered on chef coats and polos",
    tags: ["logo", "restaurant", "embroidered"],
    files: {
      customerArt: [
        {
          id: "ca-003",
          name: "Mountain_Logo.png",
          url: "/public/lovable-uploads/restaurant-logo-3.jpg",
          type: "png",
          category: "customerArt"
        }
      ],
      productionFiles: [
        {
          id: "pf-003",
          name: "Mountain_Embroidery.dst",
          url: "/public/lovable-uploads/restaurant-logo-3.jpg",
          type: "dst",
          category: "productionFiles"
        }
      ],
      proofMockup: [
        {
          id: "pm-004",
          name: "Mountain_Polo_Embroidered.jpg",
          url: "/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png",
          type: "jpg",
          category: "proofMockup"
        }
      ]
    },
    dimensions: { width: 3.0, height: 2.5 },
    colors: "Forest Green, Tan, White",
    notes: "8,500 stitch count, use rayon thread",
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
    usageCount: 8
  },
  {
    id: "si-004",
    name: "Adventure Outfitters Logo",
    customerId: "cust-003",
    customerName: "Adventure Outfitters Co.",
    decorationMethod: "dtg",
    location: "Front Center",
    description: "Full-color outdoor company logo for retail shirts",
    tags: ["logo", "outdoor", "full-color"],
    files: {
      customerArt: [
        {
          id: "ca-004",
          name: "Adventure_Logo_RGB.png",
          url: "/public/lovable-uploads/outdoor-logo-2.jpg",
          type: "png",
          category: "customerArt"
        }
      ],
      productionFiles: [
        {
          id: "pf-004",
          name: "Adventure_DTG_Ready.png",
          url: "/public/lovable-uploads/outdoor-logo-2.jpg",
          type: "png",
          category: "productionFiles"
        }
      ],
      proofMockup: [
        {
          id: "pm-005",
          name: "Adventure_Tshirt_DTG.jpg",
          url: "/lovable-uploads/9a2abfa2-77b1-4f22-b100-c9d9c1653a71.png",
          type: "jpg",
          category: "proofMockup"
        },
        {
          id: "pm-006",
          name: "Adventure_Hoodie_DTG.jpg",
          url: "/lovable-uploads/2436aa64-1e48-430d-a686-cc02950cceb4.png",
          type: "jpg",
          category: "proofMockup"
        }
      ]
    },
    dimensions: { width: 8.0, height: 6.0 },
    colors: "Full Color CMYK",
    notes: "300 DPI, PNG with transparency",
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-03-01'),
    usageCount: 15
  },
  {
    id: "si-005",
    name: "TechCorp Embroidered Logo",
    customerId: "cust-001",
    customerName: "TechCorp Solutions",
    decorationMethod: "embroidery",
    location: "Front Left Chest",
    description: "Embroidered version for executive polo shirts",
    tags: ["logo", "corporate", "executive"],
    files: {
      customerArt: [
        {
          id: "ca-005",
          name: "TechCorp_Logo_Embroidery.ai",
          url: "/public/lovable-uploads/tech-logo-4.jpg",
          type: "ai",
          category: "customerArt"
        }
      ],
      productionFiles: [
        {
          id: "pf-005",
          name: "TechCorp_Embroidery.dst",
          url: "/public/lovable-uploads/tech-logo-4.jpg",
          type: "dst",
          category: "productionFiles"
        }
      ],
      proofMockup: [
        {
          id: "pm-007",
          name: "TechCorp_Executive_Polo.jpg",
          url: "/lovable-uploads/c67f3c35-f254-4d8a-8de3-9e877d37d2d6.png",
          type: "jpg",
          category: "proofMockup"
        }
      ]
    },
    dimensions: { width: 3.0, height: 1.8 },
    colors: "Navy Blue, Silver Grey",
    notes: "6,200 stitch count, premium thread",
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-02-25'),
    usageCount: 3
  }
];

export function getSavedImprintsByMethod(): Record<string, SavedImprint[]> {
  const grouped: Record<string, SavedImprint[]> = {};
  
  mockSavedImprints.forEach(imprint => {
    if (!grouped[imprint.decorationMethod]) {
      grouped[imprint.decorationMethod] = [];
    }
    grouped[imprint.decorationMethod].push(imprint);
  });
  
  return grouped;
}

export function getSavedImprintsByCustomer(): Record<string, SavedImprint[]> {
  const grouped: Record<string, SavedImprint[]> = {};
  
  mockSavedImprints.forEach(imprint => {
    if (!grouped[imprint.customerName]) {
      grouped[imprint.customerName] = [];
    }
    grouped[imprint.customerName].push(imprint);
  });
  
  return grouped;
}

export function searchSavedImprints(query: string): SavedImprint[] {
  const lowercaseQuery = query.toLowerCase();
  return mockSavedImprints.filter(imprint => 
    imprint.name.toLowerCase().includes(lowercaseQuery) ||
    imprint.customerName.toLowerCase().includes(lowercaseQuery) ||
    imprint.description?.toLowerCase().includes(lowercaseQuery) ||
    imprint.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}