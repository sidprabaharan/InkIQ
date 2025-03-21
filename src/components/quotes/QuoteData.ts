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

// Sample data for the quote
export const quotationData: QuotationData = {
  id: "3032",
  nickname: "Project Care Quote",
  company: {
    name: "15493315 Canada Inc",
    logo: "/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png",
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
      total: "$4,871.25"
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
      total: "$7,047.65"
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
  status: "Artwork- SP/DTF"
};
