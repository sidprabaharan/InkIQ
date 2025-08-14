
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface QuoteHeaderProps {
  onCancel?: () => void;
  onPreview?: () => void;
  onSave?: () => void;
  quoteId?: string;
  isNewQuote?: boolean;
  status?: string;
}

export function QuoteHeader({ 
  onCancel, 
  onPreview, 
  onSave,
  quoteId,
  isNewQuote = true,
  status = "Quote"
}: QuoteHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isInvoice = !status.toLowerCase().startsWith('quote');
  const documentType = isInvoice ? "Invoice" : "Quote";
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/quotes");
    }
  };

  const handleSave = () => {
    console.log("🔍 [DEBUG] QuoteHeader - handleSave called");
    console.log("🔍 [DEBUG] QuoteHeader - onSave prop:", onSave);
    console.log("🔍 [DEBUG] QuoteHeader - typeof onSave:", typeof onSave);
    
    if (onSave) {
      console.log("🔍 [DEBUG] QuoteHeader - Calling onSave prop");
      onSave();
      
      // When onSave is provided, let the parent component handle navigation
      // Don't navigate here to avoid conflicts
    } else {
      // Show success toast
      toast({
        title: `${documentType} saved successfully`,
        description: `New ${documentType.toLowerCase()} has been created`,
      });
      
      // Navigate to the first quote as a demo
      navigate("/quotes/3032");
    }
  };
  
  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate("/quotes")} className="text-sm text-gray-500 cursor-pointer hover:underline">
                {isInvoice ? "Invoices" : "Quotes"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">
                {isNewQuote ? `Create ${documentType}` : `Edit ${documentType} #${quoteId}`}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="text-gray-500" onClick={handleCancel}>
          Cancel
        </Button>
        {isNewQuote && (
          <Button variant="outline" className="text-gray-500" onClick={onPreview}>
            Preview
          </Button>
        )}
        {isNewQuote ? (
          <Button className="bg-inkiq-primary hover:bg-inkiq-primary/90 text-white" onClick={handleSave}>
            Save & Finish
          </Button>
        ) : (
          <Button className="bg-inkiq-primary hover:bg-inkiq-primary/90 text-white" onClick={handleSave}>
            Update {documentType}
          </Button>
        )}
      </div>
    </div>
  );
}
