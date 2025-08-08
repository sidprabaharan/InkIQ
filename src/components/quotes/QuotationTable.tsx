
import React, { useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { QuotationStatusBadge } from "./QuotationStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { StatusDropdown } from "./StatusDropdown";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: string;
  status: string;
}

interface Quotation {
  id: string;
  norisId?: string;
  customer: string;
  dueDate: string;
  owner: string;
  total: string;
  outstanding: string;
  status: string;
  isPaid: boolean;
  lineItems?: LineItem[];
}

// Define which statuses belong to quotes vs invoices
const quoteStatuses = ["Quote", "Quote Approval Sent", "Quote Approved"];

// Sample data for both quotes and invoices
const allQuotationsData: Quotation[] = [
  // Quotes data - will show on Quotes page
  {
    id: "3046",
    customer: "Western Alliance Transport",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
    owner: "Kiriakos",
    total: "$8,344.31",
    outstanding: "$8,344.31",
    status: "Quote",
    isPaid: false,
  },
  {
    id: "3032",
    norisId: "Noris shahid",
    customer: "Project Care",
    dueDate: "24-12-2024",
    owner: "Noraiz shahid",
    total: "$278",
    outstanding: "$24",
    status: "Quote",
    isPaid: false,
  },
  {
    id: "3039",
    norisId: "Noris shahid",
    customer: "Care Pharmacy",
    dueDate: "24-12-2024",
    owner: "Tim",
    total: "$12382",
    outstanding: "$82",
    status: "Quote Approval Sent",
    isPaid: true,
  },
  {
    id: "3045",
    customer: "Montreal University",
    dueDate: "15-01-2025",
    owner: "Sarah",
    total: "$3,450",
    outstanding: "$3,450",
    status: "Quote Approved",
    isPaid: false,
  },
  
  // Invoices data - will show on Invoices page
  {
    id: "3033",
    customer: "Cinemania",
    dueDate: "24-12-2024",
    owner: "Shahid Raja",
    total: "$9102",
    outstanding: "$992",
    status: "Purchase Orders",
    isPaid: true,
  },
  {
    id: "3034",
    norisId: "Noris shahid",
    customer: "McGill Investment Club",
    dueDate: "24-12-2024",
    owner: "Kiri",
    total: "$1292",
    outstanding: "$241",
    status: "Achieved Quote",
    isPaid: false,
  },
  {
    id: "3035",
    customer: "Peer Support system",
    dueDate: "24-12-2024",
    owner: "Jhon",
    total: "$777.28",
    outstanding: "$0.000",
    status: "Miscellaneous",
    isPaid: true,
  },
  {
    id: "3036",
    norisId: "Noris shahid",
    customer: "Qubic Inc",
    dueDate: "24-12-2024",
    owner: "Kamelia",
    total: "$939.92",
    outstanding: "$424.92",
    status: "Short Collections",
    isPaid: false,
  },
  {
    id: "3037",
    customer: "Custom shirts",
    dueDate: "24-12-2024",
    owner: "Picanto",
    total: "$1,892",
    outstanding: "$1.21",
    status: "On Hold",
    isPaid: false,
  },
  {
    id: "3038",
    norisId: "Noris shahid",
    customer: "Design & Co",
    dueDate: "24-12-2024",
    owner: "Helper",
    total: "$9,9282",
    outstanding: "$2,421",
    status: "Artwork",
    isPaid: true,
  },
  {
    id: "3040",
    customer: "ABC Print Shop",
    dueDate: "30-11-2024",
    owner: "Jessica",
    total: "$4,590",
    outstanding: "$0",
    status: "Complete",
    isPaid: true,
  },
  {
    id: "3041",
    customer: "Tech Innovators",
    dueDate: "15-12-2024",
    owner: "Michael",
    total: "$2,750",
    outstanding: "$1,250",
    status: "Production",
    isPaid: false,
  },
  {
    id: "3042",
    customer: "Global Retail Solutions",
    dueDate: "05-01-2025",
    owner: "Emma",
    total: "$8,325",
    outstanding: "$4,125",
    status: "Shipping",
    isPaid: false,
  },
];

interface QuotationTableProps {
  isInvoicesPage?: boolean;
}

export function QuotationTable({ isInvoicesPage = false }: QuotationTableProps) {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [lineItemStatuses, setLineItemStatuses] = useState<{[key: string]: string}>({});
  
  // Filter data based on whether we're on the Quotes or Invoices page
  const quotationsData = allQuotationsData
    .filter(quotation => {
      if (isInvoicesPage) {
        // For invoices page, show everything that's NOT a quote status
        return !quoteStatuses.includes(quotation.status);
      } else {
        // For quotes page, only show quote statuses
        return quoteStatuses.includes(quotation.status);
      }
    })
    .sort((a, b) => parseInt(b.id) - parseInt(a.id)); // Sort by ID descending
  
  const handleRowClick = (quotationId: string) => {
    navigate(`/quotes/${quotationId}`);
  };

  const toggleRowExpansion = (quotationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(quotationId)) {
        newSet.delete(quotationId);
      } else {
        newSet.add(quotationId);
      }
      return newSet;
    });
  };

  const handleLineItemStatusChange = (lineItemId: string, newStatus: string) => {
    setLineItemStatuses(prev => ({
      ...prev,
      [lineItemId]: newStatus
    }));
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">{isInvoicesPage ? "Invoices" : "Quotations"}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-inkiq-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">ID.</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Customer</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Due Date</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Owner</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Total</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Outstanding</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {quotationsData.map((quotation) => (
              <React.Fragment key={quotation.id}>
                <tr className="border-b hover:bg-gray-50 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {isInvoicesPage && quotation.lineItems && (
                        <button
                          onClick={(e) => toggleRowExpansion(quotation.id, e)}
                          className="hover:bg-gray-200 rounded p-1"
                        >
                          {expandedRows.has(quotation.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      <div>
                        {quotation.id}
                        {quotation.norisId && (
                          <div className="text-xs text-gray-400">{quotation.norisId}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td 
                    className="px-4 py-3 text-sm"
                    onClick={() => handleRowClick(quotation.id)}
                  >
                    {quotation.customer}
                  </td>
                  <td 
                    className="px-4 py-3 text-sm text-gray-500"
                    onClick={() => handleRowClick(quotation.id)}
                  >
                    {quotation.dueDate}
                  </td>
                  <td 
                    className="px-4 py-3 text-sm text-gray-500"
                    onClick={() => handleRowClick(quotation.id)}
                  >
                    {quotation.owner}
                  </td>
                  <td 
                    className="px-4 py-3 text-sm"
                    onClick={() => handleRowClick(quotation.id)}
                  >
                    {quotation.total}
                  </td>
                  <td 
                    className="px-4 py-3 text-sm"
                    onClick={() => handleRowClick(quotation.id)}
                  >
                    {quotation.outstanding}
                  </td>
                  <td 
                    className="px-4 py-3 space-x-2"
                    onClick={() => handleRowClick(quotation.id)}
                  >
                    <QuotationStatusBadge status={quotation.status} />
                    <PaymentStatusBadge isPaid={quotation.isPaid} />
                  </td>
                </tr>
                
                {/* Expandable Line Items Row */}
                {isInvoicesPage && quotation.lineItems && expandedRows.has(quotation.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={7} className="px-4 py-0">
                      <div className="py-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Line Items</h4>
                        <div className="space-y-2">
                          {quotation.lineItems.map((lineItem) => (
                            <div 
                              key={lineItem.id} 
                              className="flex items-center justify-between p-3 bg-white rounded border"
                            >
                              <div className="flex-1">
                                <div className="text-sm font-medium">{lineItem.description}</div>
                                <div className="text-xs text-gray-500">
                                  Qty: {lineItem.quantity} × {lineItem.price}
                                </div>
                              </div>
                              <div className="ml-4">
                                <StatusDropdown
                                  currentStatus={lineItemStatuses[lineItem.id] || lineItem.status}
                                  onStatusChange={(newStatus) => handleLineItemStatusChange(lineItem.id, newStatus)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center space-x-1">
          <button className="pagination-button">
            <span className="sr-only">Previous</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button">2</button>
          <button className="pagination-button">3</button>
          <button className="pagination-button">
            <span className="sr-only">Next</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-300">Previous</Button>
          <Button variant="outline" className="border-gray-300">Next</Button>
        </div>
      </div>
    </div>
  );
}
