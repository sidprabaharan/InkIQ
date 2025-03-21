import { Button } from "@/components/ui/button";
import { ChevronRight, Printer, Copy, ListChecks, MessageCircle, Edit, Link, File, Trash, Download, DollarSign, Truck, Package, ListPlus, Wrench, Box } from "lucide-react";
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
import { StatusDropdown } from "./StatusDropdown";
import { useState } from "react";
import { PackingSlip } from "./PackingSlip";

interface QuoteDetailHeaderProps {
  quoteId: string;
  status: string;
  customerInfo?: any;
  items?: any[];
}

export function QuoteDetailHeader({ 
  quoteId, 
  status: initialStatus, 
  customerInfo, 
  items = [] 
}: QuoteDetailHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState(initialStatus);
  const [packingSlipOpen, setPackingSlipOpen] = useState(false);
  
  const isInvoice = !status.toLowerCase().startsWith('quote');
  const documentType = isInvoice ? "Invoice" : "Quote";
  
  const handleDuplicate = () => {
    toast({
      title: `${documentType} duplicated`,
      description: `A new ${documentType.toLowerCase()} has been created based on this one`,
    });
    navigate("/quotes/new");
  };
  
  const handlePrint = () => {
    toast({
      title: `Printing ${documentType.toLowerCase()}`,
      description: `The ${documentType.toLowerCase()} would be sent to the printer in a real application`,
    });
    window.print();
  };
  
  const handleEditDocument = () => {
    toast({
      title: `Edit ${documentType}`,
      description: `Editing ${documentType.toLowerCase()} #${quoteId}`,
    });
  };
  
  const handleDocumentLink = () => {
    toast({
      title: `${documentType} Link Generated`,
      description: "Link copied to clipboard",
    });
  };
  
  const handlePackingSlip = () => {
    setPackingSlipOpen(true);
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
      description: `Creating work order for ${documentType.toLowerCase()} #${quoteId}`,
    });
  };
  
  const handlePrintBoxLabels = () => {
    toast({
      title: "Print Box Labels",
      description: `Printing box labels for ${documentType.toLowerCase()} #${quoteId}`,
    });
  };
  
  const handleDownloadPDF = () => {
    toast({
      title: "Download PDF",
      description: `Downloading ${documentType.toLowerCase()} PDF`,
    });
  };
  
  const handlePaymentExpenses = () => {
    toast({
      title: "Payment/Expenses",
      description: `Managing payment and expenses for ${documentType.toLowerCase()} #${quoteId}`,
    });
  };
  
  const handleApproval = () => {
    toast({
      title: "Approval",
      description: `Processing approval for ${documentType.toLowerCase()} #${quoteId}`,
    });
  };
  
  const handleDelete = () => {
    toast({
      title: `${documentType} deleted`,
      description: `The ${documentType.toLowerCase()} has been deleted`,
    });
    navigate("/quotes");
  };
  
  const handleShipping = () => {
    toast({
      title: "Shipping",
      description: `Managing shipping for ${documentType.toLowerCase()} #${quoteId}`,
    });
  };
  
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
  };
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-semibold">{documentType} #{quoteId}</h1>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <ListChecks className="h-4 w-4" />
              Tasks
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Tasks for {documentType} #{quoteId}</SheetTitle>
              <SheetDescription>
                View and manage tasks associated with this {documentType.toLowerCase()}.
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
              <SheetTitle>Messages for {documentType} #{quoteId}</SheetTitle>
              <SheetDescription>
                Communicate with your customer about this {documentType.toLowerCase()}.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <p className="text-muted-foreground">Messaging interface will be designed later.</p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex items-center gap-2">
        <StatusDropdown currentStatus={status} onStatusChange={handleStatusChange} />
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
            <DropdownMenuItem onClick={handleEditDocument}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDocumentLink}>
              <Link className="h-4 w-4 mr-2" />
              {documentType} Link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePackingSlip}>
              <Package className="h-4 w-4 mr-2" />
              Packing Slip
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShipping}>
              <Truck className="h-4 w-4 mr-2" />
              Shipping
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddLineItemsToPO}>
              <ListPlus className="h-4 w-4 mr-2" />
              Add Line Items to PO
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleWorkOrder}>
              <Wrench className="h-4 w-4 mr-2" />
              Work Order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrintBoxLabels}>
              <Box className="h-4 w-4 mr-2" />
              Print Box Labels
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
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
              Delete {documentType}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <PackingSlip
        open={packingSlipOpen}
        onOpenChange={setPackingSlipOpen}
        quoteId={quoteId}
        customerInfo={customerInfo}
        items={items || []}
      />
    </div>
  );
}
