
import { ArrowUp } from "lucide-react";

interface QuoteSummaryCardProps {
  title: string;
  amount: string;
  percentage: number;
  period: string;
}

export function QuoteSummaryCard({
  title,
  amount,
  percentage,
  period,
}: QuoteSummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border p-5 flex flex-col">
      <h3 className="text-gray-600 font-medium mb-3">{title}</h3>
      <span className="text-2xl font-semibold mb-2">{amount}</span>
      <div className="flex items-center text-sm">
        <ArrowUp className="text-inkiq-green h-4 w-4 mr-1" />
        <span className="text-inkiq-green font-medium">{percentage}%</span>
        <span className="text-gray-500 ml-1">vs {period}</span>
      </div>
    </div>
  );
}
