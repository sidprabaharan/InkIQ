import { Button } from "@/components/ui/button";
import { ChevronRight, Printer, Copy, ListChecks, MessageCircle, Edit, Link, File, Trash, Download, DollarSign, Truck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
  
  const handleEditQuotation = () => {
    toast({
      title: "Edit Quote",
      description: "Editing quote #" + quoteId,
    });
  };
  
  const handleQuotationLink = () => {
    toast({
      title: "Quote Link Generated",
      description: "Link copied to clipboard",
    });
  };
  
  const handlePackingSlip = () => {
    toast({
      title: "Packing Slip",
      description: "Generating packing slip for quote #" + quoteId,
    });
  };
  
  const handleAddLineItemsToPO = () => {
    toast({
      title: "Add to PO",
      description: "Adding line items to purchase order",
    });
  };
  
  const handleWorkOrder = () => {
    toast({
      title: "Work Order",
      description: "Creating work order for quote #" + quoteId,
    });
  };
  
  const handlePrintBoxLabels = () => {
    toast({
      title: "Print Box Labels",
      description: "Printing box labels for quote #" + quoteId,
    });
  };
  
  const handleDownloadPDF = () => {
    toast({
      title: "Download PDF",
      description: "Downloading quote PDF",
    });
  };
  
  const handlePaymentExpenses = () => {
    toast({
      title: "Payment/Expenses",
      description: "Managing payment and expenses for quote #" + quoteId,
    });
  };
  
  const handleApproval = () => {
    toast({
      title: "Approval",
      description: "Processing approval for quote #" + quoteId,
    });
  };
  
  const handleDelete = () => {
    toast({
      title: "Quote deleted",
      description: "The quote has been deleted",
    });
    navigate("/quotes");
  };
  
  const handleShipping = () => {
    toast({
      title: "Shipping",
      description: "Managing shipping for quote #" + quoteId,
    });
  };
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-semibold">Quote #{quoteId}</h1>
        
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
          <DropdownMenuContent className="w-56 bg-white">
            <DropdownMenuItem onClick={handleApproval}>
              Approval
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditQuotation}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Quotation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleQuotationLink}>
              <Link className="h-4 w-4 mr-2" />
              Quotation Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePackingSlip}>
              Packing Slip
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShipping}>
              <Truck className="h-4 w-4 mr-2" />
              Shipping
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddLineItemsToPO}>
              Add Line Items to PO
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleWorkOrder}>
              Work Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrintBoxLabels}>
              Print Box Labels
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Quotation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePaymentExpenses}>
              <DollarSign className="h-4 w-4 mr-2" />
              Payment/Expenses
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash className="h-4 w-4 mr-2" />
              Delete Quotation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
