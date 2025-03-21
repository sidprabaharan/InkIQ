
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuoteSummaryCard } from "@/components/quotes/QuoteSummaryCard";
import { QuotationTable } from "@/components/quotes/QuotationTable";
import { useNavigate } from "react-router-dom";

export default function Invoices() {
  const navigate = useNavigate();
  
  const summaryCards = [
    {
      title: "Total Invoices",
      amount: "$5,347,821",
      percentage: 32,
      period: "last month"
    },
    {
      title: "Artwork Stage",
      amount: "$287,442",
      percentage: 15,
      period: "last month"
    },
    {
      title: "Production",
      amount: "$1,821,392",
      percentage: 28,
      period: "last month"
    },
    {
      title: "Completed",
      amount: "$2,983,211",
      percentage: 45,
      period: "last month"
    }
  ];

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
