
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dummy data for our first sample quote with id 3032
const quotationData = {
  id: "3032",
  nickname: "Project Care Quote",
  company: {
    name: "STITCHINK",
    logo: "/lovable-uploads/71710901-a739-4cf1-9473-259d48df2dfe.png",
    address: "15493315 Canada Inc 226 Rue du Domaine",
    city: "Laval",
    region: "Quebec",
    postalCode: "H7X 3R9",
    phone: "5148346659",
    website: "https://www.stitchandink.ca",
    email: "a.thompson@stitchandink.com"
  },
  customer: {
    billing: {
      name: "Project Care",
      company: "Project Care Foundation",
      contact: "Noraiz Shahid",
      address: "8426 165 Street",
      city: "Surrey",
      region: "British Columbia",
      postalCode: "V4N 3H3",
      phone: "6044017380",
      email: "contact@projectcare.org"
    },
    shipping: {
      company: "Project Care Foundation",
      contact: "Noraiz Shahid",
      address: "8426 165 Street",
      unit: "",
      city: "Surrey",
      region: "V4N 3H3"
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
    customer: "Customer has requested expedited processing due to upcoming event on July 15th. Ensure delivery by July 10th.",
    production: "Use heat transfer for logo placement as discussed with client."
  },
  items: [
    {
      category: "Shirts",
      itemNumber: "SH-001",
      color: "Red",
      description: "Crew Neck T-shirt with logo",
      xs: "50",
      s: "75",
      m: "100",
      l: "75",
      xl: "50",
      xxl: "0",
      xxxl: "0",
      quantity: "350",
      price: "$12.50",
      taxed: true,
      total: "$4,375.00"
    },
    {
      category: "Hats",
      itemNumber: "HT-003",
      color: "Black",
      description: "Snapback with embroidered logo",
      xs: "-",
      s: "-",
      m: "-",
      l: "-",
      xl: "-",
      xxl: "-",
      xxxl: "-",
      quantity: "200",
      price: "$18.00",
      taxed: true,
      total: "$3,600.00"
    }
  ],
  summary: {
    itemTotal: "$7,975.00",
    feesTotal: "$500.00",
    subTotal: "$8,475.00",
    discount: "$425.00",
    salesTax: "$402.50",
    totalDue: "$8,452.50"
  },
  status: "Artwork- SP/DTF"
};

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quote = quotationData;
  
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header with navigation */}
      <div className="flex items-center mb-6">
        <Link to="/quotes" className="text-sm text-gray-500">Quotes</Link>
        <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
        <span className="text-sm">{quote.nickname}</span>
      </div>
      
      {/* Top action bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <h1 className="text-2xl font-semibold">Quotation #{quote.id}</h1>
          <div className="flex items-center">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {quote.status}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Duplicate</Button>
          <Button variant="outline">Print</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                More Action <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Convert to Order</DropdownMenuItem>
              <DropdownMenuItem>Send Email</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="col-span-2 space-y-6">
          {/* Quotation Header */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">Quotation</h2>
                <p className="text-gray-500 text-sm">#{quote.id} {quote.nickname}</p>
                
                {/* Company Logo and Info */}
                <div className="mt-4">
                  <img src={quote.company.logo} alt="Company Logo" className="h-16 mb-2" />
                  <p>{quote.company.address}</p>
                  <p>{quote.company.city}, {quote.company.region} {quote.company.postalCode}</p>
                  <p>{quote.company.phone}</p>
                  <p>{quote.company.website}</p>
                  <p>{quote.company.email}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Customer Billing & Shipping */}
          <div className="grid grid-cols-2 gap-6">
            {/* Customer Billing */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium mb-4">Customer Billing</h3>
              <div>
                <p className="font-medium">{quote.customer.billing.name}</p>
                <p>{quote.customer.billing.company}</p>
                <p>{quote.customer.billing.contact}</p>
                <p>{quote.customer.billing.address}</p>
                <p>{quote.customer.billing.city}, {quote.customer.billing.region} {quote.customer.billing.postalCode}</p>
                <p>{quote.customer.billing.phone}</p>
                <p>{quote.customer.billing.email}</p>
              </div>
            </div>
            
            {/* Customer Shipping */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium mb-4">Customer Shipping</h3>
              <div>
                <p>{quote.customer.shipping.company}</p>
                <p>{quote.customer.shipping.contact}</p>
                <p>{quote.customer.shipping.address}</p>
                {quote.customer.shipping.unit && <p>{quote.customer.shipping.unit}</p>}
                <p>{quote.customer.shipping.city}, {quote.customer.shipping.region}</p>
              </div>
            </div>
          </div>
          
          {/* Quote Items */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-medium mb-4">Quote Items</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Item#</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">XS</TableHead>
                    <TableHead className="text-center">S</TableHead>
                    <TableHead className="text-center">M</TableHead>
                    <TableHead className="text-center">L</TableHead>
                    <TableHead className="text-center">XL</TableHead>
                    <TableHead className="text-center">2XL</TableHead>
                    <TableHead className="text-center">3XL</TableHead>
                    <TableHead className="text-center">Quant</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                    <TableHead className="text-center">Taxed</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quote.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.itemNumber}</TableCell>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-center">{item.xs}</TableCell>
                      <TableCell className="text-center">{item.s}</TableCell>
                      <TableCell className="text-center">{item.m}</TableCell>
                      <TableCell className="text-center">{item.l}</TableCell>
                      <TableCell className="text-center">{item.xl}</TableCell>
                      <TableCell className="text-center">{item.xxl}</TableCell>
                      <TableCell className="text-center">{item.xxxl}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-center">{item.price}</TableCell>
                      <TableCell className="text-center">{item.taxed ? '✓' : ''}</TableCell>
                      <TableCell className="text-center">{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        {/* Right Column - 1/3 width */}
        <div className="col-span-1 space-y-6">
          {/* Quotation Details */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-medium mb-4">Quotation Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Owner</span>
                <span>{quote.details.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Method</span>
                <span>{quote.details.deliveryMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Production Due Date</span>
                <span>{quote.details.productionDueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Due Date</span>
                <span>{quote.details.paymentDueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice Date</span>
                <span>{quote.details.invoiceDate}</span>
              </div>
            </div>
          </div>
          
          {/* Customer Notes */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-medium mb-4">Customer Notes</h3>
            <p className="text-sm text-gray-600">{quote.notes.customer}</p>
          </div>
          
          {/* Production Notes */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="font-medium mb-4">Production Notes</h3>
            <p className="text-sm text-gray-600">{quote.notes.production}</p>
          </div>
          
          {/* Invoice Summary */}
          <div className="bg-white p-6 rounded-lg border">
            <div className="bg-blue-100 p-3 rounded-md mb-4">
              <h3 className="font-medium text-center">Invoice Summary</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Item Total</span>
                <span>{quote.summary.itemTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fees Total</span>
                <span>{quote.summary.feesTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Total</span>
                <span>{quote.summary.subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span>{quote.summary.discount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sales Tax</span>
                <span>{quote.summary.salesTax}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Due</span>
                <span>{quote.summary.totalDue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
