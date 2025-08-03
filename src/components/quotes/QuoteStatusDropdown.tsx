import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, FileText, Palette, CheckCircle, Cog, Package, DollarSign, CreditCard, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuoteStatusDropdownProps {
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
}

const quoteStatusOptions = [
  { name: "Quote", icon: FileText, color: "text-gray-600" },
  { name: "Artwork Pending", icon: Palette, color: "text-yellow-600" },
  { name: "Approved", icon: CheckCircle, color: "text-blue-600" },
  { name: "In Production", icon: Cog, color: "text-purple-600" },
  { name: "Complete", icon: Package, color: "text-green-600" },
  { name: "Invoiced", icon: FileText, color: "text-teal-600" },
  { name: "Paid", icon: CreditCard, color: "text-green-700" },
  { name: "Cancelled", icon: X, color: "text-red-600" },
];

export function QuoteStatusDropdown({ currentStatus, onStatusChange }: QuoteStatusDropdownProps) {
  const { toast } = useToast();

  const handleStatusSelect = (status: string) => {
    onStatusChange(status);
    toast({
      title: "Status Updated",
      description: `Quote status changed to ${status}`,
    });
  };

  const currentStatusConfig = quoteStatusOptions.find(option => 
    option.name.toLowerCase() === currentStatus.toLowerCase()
  ) || quoteStatusOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <currentStatusConfig.icon className={`h-4 w-4 ${currentStatusConfig.color}`} />
          {currentStatus}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white">
        {quoteStatusOptions.map((option) => (
          <DropdownMenuItem
            key={option.name}
            onClick={() => handleStatusSelect(option.name)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <option.icon className={`h-4 w-4 ${option.color}`} />
            {option.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}