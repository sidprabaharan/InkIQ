
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuoteSummaryCard } from "@/components/quotes/QuoteSummaryCard";
import { QuotationTable } from "@/components/quotes/QuotationTable";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Invoices() {
  const navigate = useNavigate();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Mock function to calculate filtered totals based on date range and status
  const getFilteredTotals = () => {
    // In a real app, this would filter actual invoice data
    const baseAmounts = {
      total: 5347821,
      pastDue1to30: 421392,
      pastDue30to60: 183211,
      pastDue60plus: 92156
    };
    
    // Apply mock filtering logic (in real app, filter actual data)
    const filterMultiplier = (dateFrom || dateTo || statusFilter !== "all") ? 0.7 : 1;
    
    return {
      total: Math.round(baseAmounts.total * filterMultiplier),
      pastDue1to30: Math.round(baseAmounts.pastDue1to30 * filterMultiplier),
      pastDue30to60: Math.round(baseAmounts.pastDue30to60 * filterMultiplier),
      pastDue60plus: Math.round(baseAmounts.pastDue60plus * filterMultiplier)
    };
  };
  
  const filteredTotals = getFilteredTotals();
  
  const summaryCards = [
    {
      title: "Total Invoices",
      amount: `$${filteredTotals.total.toLocaleString()}`,
      percentage: 32,
      period: "last month"
    },
    {
      title: "1-30 Days Past Due",
      amount: `$${filteredTotals.pastDue1to30.toLocaleString()}`,
      percentage: 28,
      period: "last month"
    },
    {
      title: "30-60 Days Past Due",
      amount: `$${filteredTotals.pastDue30to60.toLocaleString()}`,
      percentage: 12,
      period: "last month"
    },
    {
      title: "60+ Days Past Due",
      amount: `$${filteredTotals.pastDue60plus.toLocaleString()}`,
      percentage: 8,
      period: "last month"
    }
  ];

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setStatusFilter("all");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <Button 
          className="bg-inkiq-primary hover:bg-inkiq-primary/90"
          onClick={() => navigate("/quotes/new")}
        >
          New Invoice
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          {/* Date From */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">From:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "MMM dd") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">To:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "MMM dd") : "Select"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="artwork">Artwork</SelectItem>
                <SelectItem value="production">Production</SelectItem>
                <SelectItem value="shipping">Shipping</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="onhold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {(dateFrom || dateTo || statusFilter !== "all") && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <QuoteSummaryCard
            key={index}
            title={card.title}
            amount={card.amount}
            percentage={card.percentage}
            period={card.period}
          />
        ))}
      </div>

      <QuotationTable isInvoicesPage={true} />
    </div>
  );
}
