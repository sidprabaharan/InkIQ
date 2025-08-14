
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuoteSummaryCard } from "@/components/quotes/QuoteSummaryCard";
import { QuotationTable } from "@/components/quotes/QuotationTable";
import { useNavigate } from "react-router-dom";
import { useQuotes } from "@/context/QuotesContext";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Quotes() {
  const navigate = useNavigate();
  const { getQuotes } = useQuotes();
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  
  // Refresh quotes when component mounts
  useEffect(() => {
    console.log('🔍 [DEBUG] Quotes page - Refreshing quotes on mount');
    getQuotes();
  }, []); // Empty dependency array - only run on mount
  
  // Mock function to calculate filtered totals based on date range and status
  const getFilteredTotals = () => {
    // In a real app, this would filter actual quote data
    const baseAmounts = {
      totalOpportunity: 8282942,
      quotesSent: 4125320,
      approvalSent: 2834291,
      approved: 1323331
    };
    
    // Apply mock filtering logic (in real app, filter actual data)
    const filterMultiplier = (dateFrom || dateTo || statusFilter !== "all" || ownerFilter !== "all" || paymentFilter !== "all") ? 0.7 : 1;
    
    return {
      totalOpportunity: Math.round(baseAmounts.totalOpportunity * filterMultiplier),
      quotesSent: Math.round(baseAmounts.quotesSent * filterMultiplier),
      approvalSent: Math.round(baseAmounts.approvalSent * filterMultiplier),
      approved: Math.round(baseAmounts.approved * filterMultiplier)
    };
  };
  
  const filteredTotals = getFilteredTotals();
  
  const summaryCards = [
    {
      title: "Total Opportunity",
      amount: `$${filteredTotals.totalOpportunity.toLocaleString()}`,
      percentage: 40,
      period: "last month"
    },
    {
      title: "Quotes Sent",
      amount: `$${filteredTotals.quotesSent.toLocaleString()}`,
      percentage: 25,
      period: "last month"
    },
    {
      title: "Quote Approval Sent",
      amount: `$${filteredTotals.approvalSent.toLocaleString()}`,
      percentage: 35,
      period: "last month"
    },
    {
      title: "Quote Approved",
      amount: `$${filteredTotals.approved.toLocaleString()}`,
      percentage: 18,
      period: "last month"
    }
  ];

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setStatusFilter("all");
    setOwnerFilter("all");
    setPaymentFilter("all");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Quotations</h1>
        <Button 
          className="bg-inkiq-primary hover:bg-inkiq-primary/90"
          onClick={() => navigate("/quotes/new")}
        >
          New Quote
        </Button>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-4 flex-wrap">
          
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

          {/* Owner Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Owner:</span>
            <Select value={ownerFilter} onValueChange={setOwnerFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Owners</SelectItem>
                <SelectItem value="shahid">Shahid Raja</SelectItem>
                <SelectItem value="kiri">Kiri</SelectItem>
                <SelectItem value="jhon">Jhon</SelectItem>
                <SelectItem value="kamelia">Kamelia</SelectItem>
                <SelectItem value="picanto">Picanto</SelectItem>
                <SelectItem value="helper">Helper</SelectItem>
                <SelectItem value="jessica">Jessica</SelectItem>
                <SelectItem value="michael">Michael</SelectItem>
                <SelectItem value="emma">Emma</SelectItem>
                <SelectItem value="tim">Tim</SelectItem>
                <SelectItem value="sarah">Sarah</SelectItem>
                <SelectItem value="kiriakos">Kiriakos</SelectItem>
                <SelectItem value="noraiz">Noraiz shahid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Payment:</span>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {(dateFrom || dateTo || statusFilter !== "all" || ownerFilter !== "all" || paymentFilter !== "all") && (
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

      <QuotationTable />
    </div>
  );
}
