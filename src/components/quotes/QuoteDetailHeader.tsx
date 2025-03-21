
import { Button } from "@/components/ui/button";
import { ChevronRight, Printer, Copy, ListChecks, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";

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
        
        {/* New Tasks Button with Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <ListChecks className="h-4 w-4" />
              Tasks
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Tasks for Quote #{quoteId}</SheetTitle>
              <SheetDescription>
                View and manage tasks associated with this quote.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <p className="text-muted-foreground">Task management interface will be designed later.</p>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* New Messages Button with Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <MessageCircle className="h-4 w-4" />
              Messages
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Messages for Quote #{quoteId}</SheetTitle>
              <SheetDescription>
                Communicate with your customer about this quote.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <p className="text-muted-foreground">Messaging interface will be designed later.</p>
            </div>
          </SheetContent>
        </Sheet>
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
