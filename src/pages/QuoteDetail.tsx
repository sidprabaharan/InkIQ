
import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, MoreHorizontal, ArrowLeft, Printer, Copy } from "lucide-react";
import { QuoteHeader } from "@/components/quotes/QuoteHeader";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const quoteId = id || "3032";
  const quote = quotationData;
  
  const handleBackToQuotes = () => {
    navigate("/quotes");
  };
  
  const handleDuplicate = () => {
    toast({
      title: "Quote duplicated",
      description: "A new quote has been created based on this one",
    });
    navigate("/quotes/new");
  };
  
  const handlePrint = () => {
    toast({
      title: "Printing quote",
      description: "The quote would be sent to the printer in a real application",
    });
    window.print();
  };
  
  const handleConvertToOrder = () => {
    toast({
      title: "Converting to order",
      description: "Quote has been converted to an order",
    });
  };
  
  const handleSendEmail = () => {
    toast({
      title: "Email sent",
      description: "Quote has been emailed to the customer",
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Quote deleted",
      description: "The quote has been deleted",
    });
    navigate("/quotes");
  };
  
  return (
    <div className="p-0 bg-gray-50 min-h-full">
      <QuoteHeader
        quoteId={quoteId}
        isNewQuote={false}
      />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleBackToQuotes}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Quotes
            </Button>
            <h1 className="text-2xl font-semibold">Quote #{quoteId}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {quote.status}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  More Actions <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleConvertToOrder}>
                  Convert to Order
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSendEmail}>
                  Send Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-6">
          {/* Company and Quote Details - top row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Company Information - top left */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-3">15493315 Canada Inc</h2>
              <div className="space-y-1 text-gray-700">
                <p>226 Rue du Domaine</p>
                <p>Laval, Quebec H7X 3R9</p>
                <p>5148346659</p>
                <p>
                  <a href="https://www.stitchandink.ca" className="text-blue-600 hover:underline">
                    https://www.stitchandink.ca
                  </a>
                </p>
                <p>
                  <a href="mailto:a.thompson@stitchandink.com" className="text-blue-600 hover:underline">
                    a.thompson@stitchandink.com
                  </a>
                </p>
              </div>
            </div>
            
            {/* Quote Details - top right */}
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
          </div>
          
          {/* Billing and Shipping - second row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Billing Information */}
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
            
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-medium mb-4">Customer Shipping</h3>
              <div>
                <p>{quote.customer.shipping.company}</p>
                <p>{quote.customer.shipping.contact}</p>
                <p>{quote.customer.shipping.address}</p>
                <p>{quote.customer.shipping.unit}</p>
                <p>{quote.customer.shipping.city}, {quote.customer.shipping.region}</p>
              </div>
            </div>
          </div>
          
          {/* Quote Items - full width */}
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
          
          {/* Invoice Summary and Notes - bottom row - UPDATED LAYOUT */}
          <div className="grid grid-cols-3 gap-6">
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
                  <span className="text-gray-600">Shipping</span>
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
    </div>
  );
}
