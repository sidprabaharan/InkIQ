
import React, { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronRight } from "lucide-react";
import { QuotationStatusBadge } from "./QuotationStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { StatusDropdown } from "./StatusDropdown";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
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

// Helper to format currency
function money(value: number | string | null | undefined): string {
  const n = typeof value === 'string' ? Number(value) : (value ?? 0);
  if (Number.isNaN(n)) return '$0.00';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

interface QuotationTableProps {
  isInvoicesPage?: boolean;
}

export function QuotationTable({ isInvoicesPage = false }: QuotationTableProps) {
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [lineItemStatuses, setLineItemStatuses] = useState<{[key: string]: string}>({});
  const [rows, setRows] = useState<Quotation[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      // Load latest quotes (limit for performance)
      const { data: quotes } = await supabase
        .from('quotes')
        .select('id, quote_number, customer_id, owner_id, total_amount, amount_outstanding, quote_status, payment_due_date')
        .order('created_at', { ascending: false })
        .limit(50);

      const customerIds = Array.from(new Set((quotes ?? []).map(q => q.customer_id).filter(Boolean)));
      let customerMap: Record<string, string> = {};
      if (customerIds.length > 0) {
        const { data: customers } = await supabase
          .from('customers')
          .select('id, company_name, name')
          .in('id', customerIds);
        for (const c of customers ?? []) {
          customerMap[c.id] = c.company_name ?? c.name ?? '';
        }
      }

      const mapped: Quotation[] = (quotes ?? []).map(q => ({
        id: q.quote_number ?? q.id, // navigate using quote_number when available
        customer: customerMap[q.customer_id] ?? '',
        dueDate: q.payment_due_date ?? '',
        owner: q.owner_id ?? '',
        total: money(q.total_amount ?? 0),
        outstanding: money(q.amount_outstanding ?? 0),
        status: q.quote_status === 'quote_approval_sent' ? 'Quote Approval Sent' : 'Quote',
        isPaid: (Number(q.amount_outstanding ?? 0) === 0)
      }));

      if (isMounted) setRows(mapped);
    })();
    return () => {
      isMounted = false;
    };
  }, []);
  
  const quotationsData = rows;
  
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
