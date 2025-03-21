
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuoteSummaryCard } from "@/components/quotes/QuoteSummaryCard";
import { QuotationTable } from "@/components/quotes/QuotationTable";
import { useNavigate } from "react-router-dom";

export default function Quotes() {
  const navigate = useNavigate();
  
  const summaryCards = [
    {
      title: "Total Opportunity",
      amount: "$8282942",
      percentage: 40,
      period: "last month"
    },
    {
      title: "Approved Quotations",
      amount: "$8,222",
      percentage: 40,
      period: "last month"
    },
    {
      title: "Pending Quotations",
      amount: "$9,2921",
      percentage: 40,
      period: "last month"
    },
    {
      title: "Quote Approval Sent",
      amount: "$6,0122",
      percentage: 40,
      period: "last month"
    }
  ];

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
