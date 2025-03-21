
import { Button } from "@/components/ui/button";
import { ChevronRight, Printer, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface QuoteDetailHeaderProps {
  quoteId: string;
  status: string;
}

export function QuoteDetailHeader({ quoteId, status }: QuoteDetailHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-semibold">Quote #{quoteId}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          {status}
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
  );
}
