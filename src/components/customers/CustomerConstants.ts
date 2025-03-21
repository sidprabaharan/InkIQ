
export const industries = [
  { id: "tech", name: "Technology" },
  { id: "retail", name: "Retail" },
  { id: "healthcare", name: "Healthcare" },
  { id: "education", name: "Education" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "ecommerce", name: "Ecommerce" },
];

export const customerOrders = [
  {
    id: "3032",
    date: "2023-08-15",
    total: "$1,245.00",
    status: "Completed",
    items: "T-shirts (50), Hoodies (25)"
  },
  {
    id: "2987",
    date: "2023-06-22",
    total: "$780.50",
    status: "Completed",
    items: "Polos (30), Caps (40)"
  },
  {
    id: "2756",
    date: "2023-04-10",
    total: "$2,100.00",
    status: "Completed",
    items: "Custom Jackets (20)"
  }
];

export const customerQuotes = [
  {
    id: "Q-5893",
    date: "2023-09-05",
    total: "$2,450.00",
    status: "Pending Approval",
    items: "Custom T-shirts (100), Embroidered Caps (50)"
  },
  {
    id: "Q-5742",
    date: "2023-08-28",
    total: "$980.00",
    status: "Draft",
    items: "Polo Shirts (45)"
  },
  {
    id: "Q-5621",
    date: "2023-08-10",
    total: "$3,200.00",
    status: "Approved",
    items: "Hoodies (80), Tote Bags (100)"
  }
];

export const artworkFiles = {
  mockups: [
    { name: "Tshirt-Front-Design.png", date: "2023-08-01", size: "2.4 MB" },
    { name: "Hoodie-Back-Logo.png", date: "2023-06-15", size: "1.8 MB" }
  ],
  logoFiles: [
    { name: "Company-Logo-Vector.ai", date: "2023-01-10", size: "4.2 MB" },
    { name: "Logo-White-Version.png", date: "2023-01-10", size: "1.1 MB" }
  ],
  colorSeparations: [
    { name: "Logo-4Color-Sep.pdf", date: "2023-02-20", size: "5.6 MB" }
  ],
  digitizedLogos: [
    { name: "Logo-Digitized-3Inches.dst", date: "2023-03-05", size: "156 KB" },
    { name: "Logo-Digitized-5Inches.dst", date: "2023-03-05", size: "220 KB" }
  ],
  dtfGangSheets: [
    { name: "Small-Logos-Gang-Sheet.pdf", date: "2023-07-12", size: "8.2 MB" }
  ]
};
