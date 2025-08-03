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
  xxxl: string;
  quantity: string;
  price: string;
  taxed: boolean;
  total: string;
  status: string;
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
      xxxl: "",
      quantity: "375",
      price: "$12.99",
      taxed: true,
      total: "$4,871.25",
      status: "Artwork"
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
      xxxl: "",
      quantity: "235",
      price: "$29.99",
      taxed: true,
      total: "$7,047.65",
      status: "Production"
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
  status: "Quote"
};

// Additional sample quote data for different IDs
export const sampleQuoteData: Record<string, QuotationData> = {
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
        xxxl: "5",
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
        xxxl: "0",
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
  return sampleQuoteData[id] || null;
};