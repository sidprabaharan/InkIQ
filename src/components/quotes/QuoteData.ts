export interface CompanyInfo {
  name: string;
  logo?: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
  website: string;
  email: string;
  taxNumbers?: {
    gst?: string;
    qst?: string;
  };
}

export interface CustomerBilling {
  name: string;
  company: string;
  contact: string;
  address: string;
  city: string;
  region: string;
  postalCode: string;
  phone: string;
  email: string;
}

export interface CustomerShipping {
  company: string;
  contact: string;
  address: string;
  unit?: string;
  city: string;
  region: string;
}

export interface Customer {
  billing: CustomerBilling;
  shipping: CustomerShipping;
}

export interface QuoteDetails {
  owner: string;
  deliveryMethod: string;
  poNumber?: string;
  created?: string;
  productionDueDate: string;
  paymentDueDate: string;
  invoiceDate: string;
}

export interface Notes {
  customer: string;
  production: string;
}

export interface QuoteItem {
  category: string;
  itemNumber: string;
  color: string;
  description: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
  xxxl?: string;
  qty: string;
  quantity: string;
  
  price: string;
  taxed: boolean;
  total: string;
  status: string;
  mockups?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
}

export interface InvoiceSummary {
  itemTotal: string;
  feesTotal: string;
  subTotal: string;
  discount: string;
  salesTax: string;
  totalDue: string;
}

export interface QuotationData {
  id: string;
  nickname: string;
  company: CompanyInfo;
  customer: Customer;
  details: QuoteDetails;
  notes: Notes;
  items: QuoteItem[];
  summary: InvoiceSummary;
  status: string;
  imprints?: Array<{
    id: string;
    type: string;
    placement: string;
    size: string;
    colours: string;
    notes?: string;
    files?: Array<{
      id: string;
      name: string;
      type: string;
      url: string;
    }>;
    customerArt?: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
      category: string;
    }>;
    productionFiles?: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
      category: string;
    }>;
    proofMockup?: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
      category: string;
    }>;
  }>;
}

// Sample quote data for different quotes
export const quotationData: QuotationData = {
  id: "3032",
  nickname: "Project Care Quote",
  company: {
    name: "15493315 Canada Inc",
    logo: "/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png",
    address: "226 Rue du Domaine",
    city: "Laval",
    region: "Quebec",
    postalCode: "H7X 3R9",
    phone: "5148346659",
    website: "https://www.stitchandink.ca",
    email: "a.thompson@stitchandink.com",
    taxNumbers: {
      gst: "123456789 RT0001",
      qst: "1234567890 TQ0001"
    }
  },
  customer: {
    billing: {
      name: "Noraiz shahid",
      company: "Project Care",
      contact: "Erolyn Thong",
      address: "8426 165 Street",
      city: "Surrey",
      region: "British Columbia",
      postalCode: "V4N 3H3",
      phone: "6044017380",
      email: "erolyn.thong@mail.mcgill.ca"
    },
    shipping: {
      company: "Project Care",
      contact: "Jasmine Ma",
      address: "1288 Avenue des Canadiens-de-Montréal",
      unit: "Unit 2501",
      city: "Montréal",
      region: "H3B 3B3"
    }
  },
  details: {
    owner: "Noraiz shahid",
    deliveryMethod: "Home Delivery",
    poNumber: "PO-2024-3032",
    created: "2024-03-15",
    productionDueDate: "10-07-2024",
    paymentDueDate: "09-09-2024",
    invoiceDate: "03-22-2024"
  },
  notes: {
    customer: "Customer has requested rush delivery for this order. Please prioritize production.",
    production: "Use the new SP/DTF printing technique for the logos as discussed."
  },
  items: [
    {
      category: "T-Shirts",
      itemNumber: "TS-101",
      color: "Red",
      description: "Cotton T-Shirt with logo print",
      xs: "50",
      s: "75",
      m: "100",
      l: "75",
      xl: "50",
        xxl: "25",
        qty: "375",
        quantity: "375",
      price: "$12.99",
      taxed: true,
      total: "$4,871.25",
      status: "Artwork",
      mockups: [
        {
          id: "mockup-tshirt-1",
          name: "tshirt-red-mockup.png",
          url: "/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png",
          type: "image/png"
        }
      ]
    },
    {
      category: "Hoodies",
      itemNumber: "HD-202",
      color: "Black",
      description: "Pullover Hoodie with embroidered logo",
      xs: "25",
      s: "50",
      m: "75",
      l: "50",
      xl: "25",
        xxl: "10",
        qty: "235",
        quantity: "235",
      price: "$29.99",
      taxed: true,
      total: "$7,047.65",
      status: "Production",
      mockups: [
        {
          id: "mockup-hoodie-1",
          name: "hoodie-black-mockup.png",
          url: "/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png",
          type: "image/png"
        }
      ]
    }
  ],
  summary: {
    itemTotal: "$11,918.90",
    feesTotal: "$595.95",
    subTotal: "$12,514.85",
    discount: "$1,251.49",
    salesTax: "$563.17",
    totalDue: "$11,826.53"
  },
  status: "Quote",
  imprints: [
    {
      id: "imprint-screen-print",
      type: "Screen Print",
      placement: "Front Center",
      size: "4\" x 3\"",
      colours: "Black & White",
      notes: "Standard screen printing setup",
      customerArt: [
        {
          id: "customer-art-1",
          name: "client-logo.ai",
          url: "/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png",
          type: "application/postscript",
          category: "customerArt"
        }
      ],
      productionFiles: [
        {
          id: "production-file-1",
          name: "screen-print-separations.eps",
          url: "/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png",
          type: "application/postscript",
          category: "productionFiles"
        }
      ],
      proofMockup: [
        {
          id: "proof-mockup-1",
          name: "screen-print-proof.png",
          url: "/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png",
          type: "image/png",
          category: "proofMockup"
        }
      ]
    },
    {
      id: "imprint-embroidery",
      type: "Embroidery",
      placement: "Left Chest", 
      size: "2\" x 1.5\"",
      colours: "Navy thread",
      notes: "Match thread color to hoodie",
      customerArt: [
        {
          id: "customer-art-2",
          name: "embroidery-design.dst",
          url: "/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png",
          type: "application/octet-stream",
          category: "customerArt"
        }
      ],
      productionFiles: [
        {
          id: "production-file-2",
          name: "embroidery-program.dst",
          url: "/public/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png",
          type: "application/octet-stream",
          category: "productionFiles"
        }
      ],
      proofMockup: [
        {
          id: "proof-mockup-2",
          name: "embroidery-proof.jpg",
          url: "/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png",
          type: "image/jpeg",
          category: "proofMockup"
        }
      ]
    }
  ]
};

// Additional sample quote data for different IDs
export const sampleQuoteData: Record<string, QuotationData> = {
  "3046": {
    id: "3046",
    nickname: "Western Alliance Transport Staff Merchandise",
    company: {
      name: "15493315 Canada Inc",
      logo: "/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png",
      address: "226 Rue du Domaine",
      city: "Laval",
      region: "Quebec",
      postalCode: "H7X 3R9",
      phone: "5148346659",
      website: "https://www.stitchandink.ca",
      email: "kiriakos@merchradar.com",
      taxNumbers: {
        gst: "123456789 RT0001",
        qst: "1234567890 TQ0001"
      }
    },
    customer: {
      billing: {
        name: "Pamela Hunt",
        company: "Western Alliance Transport",
        contact: "Pamela Hunt",
        address: "2450 Boulevard Industriel",
        city: "Montreal",
        region: "Quebec",
        postalCode: "H1P 3K2",
        phone: "514-512-9926",
        email: "pamela@westernalliancetransport.com"
      },
      shipping: {
        company: "Western Alliance Transport",
        contact: "Pamela Hunt",
        address: "2450 Boulevard Industriel",
        city: "Montreal",
        region: "H1P 3K2"
      }
    },
    details: {
      owner: "Kiriakos",
      deliveryMethod: "Express Delivery",
      productionDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next Thursday
      paymentDueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks
      invoiceDate: new Date().toISOString().split('T')[0],
      poNumber: "WAT-2024-001"
    },
    notes: {
      customer: "Urgent order for staff event next Thursday. Customer needs delivery no later than next Thursday. Logo colors need to be inverted for dark garments (black logo parts become white).",
      production: "Rush order - prioritize for next Thursday delivery. Screen print front logo and back slogan on tees/hoodies. Embroider logo only on hats. Use white ink/thread for dark garments."
    },
    items: [
      {
        category: "T-Shirts",
        itemNumber: "5000",
        color: "Black",
        description: "Gildan 5000 - 100% cotton, boxy fit, durable",
        xs: "0",
        s: "20",
        m: "50", 
        l: "50",
        xl: "20",
        xxl: "0",
        qty: "140",
        quantity: "140",
        price: "$7.52",
        taxed: true,
        total: "$1,052.80",
        status: "Quoted",
        mockups: [
          {
            id: "mockup-tshirt-black-1",
            name: "gildan-5000-black-front.jpg",
            url: "/lovable-uploads/e91fc045-78a0-474c-87ba-e13b18f676db.png",
            type: "image/png"
          },
          {
            id: "mockup-tshirt-black-2", 
            name: "gildan-5000-black-back.jpg",
            url: "/lovable-uploads/b9f2bdf8-8297-4a2d-874c-32a75fa82bac.png",
            type: "image/png"
          }
        ]
      },
      {
        category: "Hoodies",
        itemNumber: "1467",
        color: "Black",
        description: "Comfort Colors 1467 - Lightweight, soft cotton hoodie",
        xs: "0",
        s: "20",
        m: "50",
        l: "50", 
        xl: "20",
        xxl: "0",
        qty: "140",
        quantity: "140",
        price: "$30.44",
        taxed: true,
        total: "$4,261.60",
        status: "Quoted",
        mockups: [
          {
            id: "mockup-hoodie-black-1",
            name: "comfort-colors-1467-black-front.jpg",
            url: "/lovable-uploads/f0049266-3c6f-4cb2-a1c3-d23bc446559f.png",
            type: "image/png"
          },
          {
            id: "mockup-hoodie-black-2",
            name: "comfort-colors-1467-black-back.jpg", 
            url: "/lovable-uploads/77e97aa8-3c5c-4ff6-8bcd-c7423ad1ba9c.png",
            type: "image/png"
          }
        ]
      },
      {
        category: "Hats",
        itemNumber: "VC300A",
        color: "White",
        description: "Valucap VC300A - Unstructured, buckle closure",
        xs: "0",
        s: "0",
        m: "0",
        l: "0",
        xl: "0",
        xxl: "0",
        qty: "140",
        quantity: "140",
        price: "$11.40",
        taxed: true,
        total: "$1,596.00",
        status: "Quoted",
        mockups: [
          {
            id: "mockup-hat-white-1",
            name: "western-alliance-hat-mockup.png",
            url: "/lovable-uploads/a161c439-2876-46ac-9b46-df360f319a37.png",
            type: "image/png"
          }
        ]
      }
    ],
    summary: {
      itemTotal: "$6,910.40",
      feesTotal: "$345.52",
      subTotal: "$7,255.92",
      discount: "$0.00",
      salesTax: "$1,088.39",
      totalDue: "$8,344.31"
    },
    status: "Quote",
    imprints: [
      {
        id: "imprint-screen-print-front",
        type: "Screen Print",
        placement: "Front Center",
        size: "8\" x 6\"",
        colours: "White ink (inverted logo)",
        notes: "Large front logo placement on t-shirts and hoodies. Invert black logo elements to white for visibility on black garments.",
        customerArt: [
          {
            id: "customer-art-wat-logo",
            name: "western-alliance-main-logo.png",
            url: "/lovable-uploads/4916f36f-5c0f-4f85-b192-02a45d68a412.png",
            type: "image/png",
            category: "customerArt"
          }
        ],
        productionFiles: [
          {
            id: "production-file-front-logo",
            name: "wat-front-logo-white.eps",
            url: "/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png",
            type: "application/postscript",
            category: "productionFiles"
          }
        ],
        proofMockup: [
          {
            id: "proof-mockup-front-tshirt",
            name: "wat-front-tshirt-proof.png",
            url: "/lovable-uploads/e91fc045-78a0-474c-87ba-e13b18f676db.png",
            type: "image/png",
            category: "proofMockup"
          },
          {
            id: "proof-mockup-front-hoodie",
            name: "wat-front-hoodie-proof.png",
            url: "/lovable-uploads/f0049266-3c6f-4cb2-a1c3-d23bc446559f.png",
            type: "image/png",
            category: "proofMockup"
          }
        ]
      },
      {
        id: "imprint-screen-print-back",
        type: "Screen Print",
        placement: "Back Center",
        size: "10\" x 4\"",
        colours: "White ink",
        notes: "Large back slogan placement on t-shirts and hoodies only.",
        customerArt: [
          {
            id: "customer-art-wat-slogan",
            name: "delivering-solutions-connecting-communities.png",
            url: "/lovable-uploads/8cf66bdd-1e7e-4d5b-a28e-3f4f87171935.png",
            type: "image/png",
            category: "customerArt"
          }
        ],
        productionFiles: [
          {
            id: "production-file-back-slogan",
            name: "wat-back-slogan-white.eps",
            url: "/public/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png",
            type: "application/postscript",
            category: "productionFiles"
          }
        ],
        proofMockup: [
          {
            id: "proof-mockup-back",
            name: "wat-back-slogan-proof.png",
            url: "/public/lovable-uploads/d2507023-d2d7-428d-b225-4442856795ff.png",
            type: "image/png",
            category: "proofMockup"
          }
        ]
      },
      {
        id: "imprint-embroidery-hat",
        type: "Embroidery",
        placement: "Front Center",
        size: "3\" x 2\"",
        colours: "Navy blue thread",
        notes: "Embroidered logo on front of white hats only. Use original logo colors.",
        customerArt: [
          {
            id: "customer-art-wat-logo-embroidery",
            name: "western-alliance-logo-embroidery.png",
            url: "/lovable-uploads/4916f36f-5c0f-4f85-b192-02a45d68a412.png",
            type: "image/png",
            category: "customerArt"
          }
        ],
        productionFiles: [
          {
            id: "production-file-embroidery",
            name: "wat-logo-embroidery.dst",
            url: "/public/lovable-uploads/a254e6c0-7bd5-4ee1-a1d3-124051d69585.png",
            type: "application/octet-stream",
            category: "productionFiles"
          },
          {
            id: "production-file-embroidery-emb",
            name: "wat-logo-embroidery.emb",
            url: "/public/lovable-uploads/a254e6c0-7bd5-4ee1-a1d3-124051d69585.png",
            type: "application/octet-stream",
            category: "productionFiles"
          },
          {
            id: "production-file-embroidery-pes",
            name: "wat-logo-embroidery.pes",
            url: "/public/lovable-uploads/a254e6c0-7bd5-4ee1-a1d3-124051d69585.png",
            type: "application/octet-stream",
            category: "productionFiles"
          },
          {
            id: "production-file-embroidery-pdf",
            name: "wat-logo-embroidery.pdf",
            url: "/public/lovable-uploads/a254e6c0-7bd5-4ee1-a1d3-124051d69585.png",
            type: "application/pdf",
            category: "productionFiles"
          },
          {
            id: "production-file-embroidery-jpeg",
            name: "wat-logo-embroidery.jpeg",
            url: "/public/lovable-uploads/a254e6c0-7bd5-4ee1-a1d3-124051d69585.png",
            type: "application/octet-stream",
            category: "productionFiles"
          }
        ],
        proofMockup: [
          {
            id: "proof-mockup-embroidery",
            name: "western-alliance-hat-proof.png",
            url: "/lovable-uploads/a161c439-2876-46ac-9b46-df360f319a37.png",
            type: "image/png",
            category: "proofMockup"
          }
        ]
      }
    ]
  },
  "3032": quotationData,
  "3033": {
    id: "3033",
    nickname: "Tech Startup Bundle",
    company: {
      name: "15493315 Canada Inc",
      logo: "/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png",
      address: "226 Rue du Domaine",
      city: "Laval",
      region: "Quebec",
      postalCode: "H7X 3R9",
      phone: "5148346659",
      website: "https://www.stitchandink.ca",
      email: "a.thompson@stitchandink.com",
      taxNumbers: {
        gst: "123456789 RT0001",
        qst: "1234567890 TQ0001"
      }
    },
    customer: {
      billing: {
        name: "Sarah Johnson",
        company: "TechFlow Solutions",
        contact: "Sarah Johnson",
        address: "1234 Innovation Drive",
        city: "Toronto",
        region: "Ontario",
        postalCode: "M5V 2N8",
        phone: "4165551234",
        email: "sarah.johnson@techflow.ca"
      },
      shipping: {
        company: "TechFlow Solutions",
        contact: "Mark Stevens",
        address: "5678 Business Way",
        unit: "Suite 401",
        city: "Toronto",
        region: "M4B 1B3"
      }
    },
    details: {
      owner: "Sarah Johnson",
      deliveryMethod: "Pickup",
      productionDueDate: "15-08-2024",
      paymentDueDate: "30-08-2024",
      invoiceDate: "01-08-2024"
    },
    notes: {
      customer: "Please use company brand colors - blue and white only.",
      production: "Standard DTG printing on premium cotton blend."
    },
    items: [
      {
        category: "Polo Shirts",
        itemNumber: "PS-301",
        color: "Navy Blue",
        description: "Polo shirt with embroidered company logo",
        xs: "10",
        s: "25",
        m: "40",
        l: "35",
        xl: "20",
        xxl: "10",
        qty: "145",
        quantity: "145",
        price: "$24.99",
        taxed: true,
        total: "$3,623.55",
        status: "Ready"
      }
    ],
    summary: {
      itemTotal: "$3,623.55",
      feesTotal: "$181.18",
      subTotal: "$3,804.73",
      discount: "$0.00",
      salesTax: "$171.21",
      totalDue: "$3,975.94"
    },
    status: "Quote"
  },
  "3034": {
    id: "3034",
    nickname: "Restaurant Uniform Order",
    company: {
      name: "15493315 Canada Inc",
      logo: "/lovable-uploads/3341acd9-99bb-4638-8a1d-d74e7a28f2e5.png",
      address: "226 Rue du Domaine",
      city: "Laval",
      region: "Quebec",
      postalCode: "H7X 3R9",
      phone: "5148346659",
      website: "https://www.stitchandink.ca",
      email: "a.thompson@stitchandink.com",
      taxNumbers: {
        gst: "123456789 RT0001",
        qst: "1234567890 TQ0001"
      }
    },
    customer: {
      billing: {
        name: "Michael Chen",
        company: "Bella Vista Restaurant",
        contact: "Michael Chen",
        address: "789 Main Street",
        city: "Vancouver",
        region: "British Columbia",
        postalCode: "V6B 2N9",
        phone: "6045557890",
        email: "michael@bellavista.ca"
      },
      shipping: {
        company: "Bella Vista Restaurant",
        contact: "Lisa Wong",
        address: "789 Main Street",
        unit: "",
        city: "Vancouver",
        region: "V6B 2N9"
      }
    },
    details: {
      owner: "Michael Chen",
      deliveryMethod: "Courier",
      productionDueDate: "20-08-2024",
      paymentDueDate: "05-09-2024",
      invoiceDate: "05-08-2024"
    },
    notes: {
      customer: "Need different sizes for kitchen vs front-of-house staff.",
      production: "Heat press application for durability in commercial kitchen environment."
    },
    items: [
      {
        category: "Aprons",
        itemNumber: "AP-401",
        color: "Black",
        description: "Kitchen apron with restaurant logo",
        xs: "0",
        s: "15",
        m: "20",
        l: "15",
        xl: "10",
        xxl: "5",
        qty: "65",
        quantity: "65",
        price: "$18.50",
        taxed: true,
        total: "$1,202.50",
        status: "Production"
      }
    ],
    summary: {
      itemTotal: "$1,202.50",
      feesTotal: "$60.13",
      subTotal: "$1,262.63",
      discount: "$126.26",
      salesTax: "$56.82",
      totalDue: "$1,193.19"
    },
    status: "Production"
  }
};

// Function to get quote data by ID
export const getQuoteById = (id: string): QuotationData | null => {
  // Temporarily clear localStorage for quote 3046 to use fresh sample data
  if (id === "3046") {
    try {
      const stored = localStorage.getItem("saved_quotes");
      if (stored) {
        const savedQuotes = JSON.parse(stored);
        if (savedQuotes["3046"]) {
          delete savedQuotes["3046"];
          localStorage.setItem("saved_quotes", JSON.stringify(savedQuotes));
          console.log("Cleared corrupted quote 3046 from localStorage");
        }
      }
    } catch (error) {
      console.error("Failed to clear quote from localStorage:", error);
    }
  }
  
  // First check localStorage for saved/modified quotes
  try {
    const stored = localStorage.getItem("saved_quotes");
    if (stored) {
      const savedQuotes = JSON.parse(stored);
      if (savedQuotes[id]) {
        console.log(`Loading saved quote ${id} from localStorage`);
        return savedQuotes[id];
      }
    }
  } catch (error) {
    console.error("Failed to load saved quotes from localStorage:", error);
  }
  
  // Fall back to sample data
  return sampleQuoteData[id] || null;
};