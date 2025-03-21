
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface QuoteHeaderProps {
  onCancel?: () => void;
  onPreview?: () => void;
  onSave?: () => void;
  quoteId?: string;
  isNewQuote?: boolean;
}

export function QuoteHeader({ 
  onCancel, 
  onPreview, 
  onSave,
  quoteId,
  isNewQuote = true
}: QuoteHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/quotes");
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      
      // Show success toast
      toast({
        title: "Quote saved successfully",
        description: isNewQuote ? "New quote has been created" : "Quote has been updated",
      });
      
      // Navigate to the quote detail page if we have a quoteId
      if (quoteId) {
        navigate(`/quotes/${quoteId}`);
      } else {
        // For demo purposes, navigate to a default quote id
        navigate("/quotes/3032");
      }
    } else {
      // Show success toast
      toast({
        title: "Quote saved successfully",
        description: "New quote has been created",
      });
      
      // Navigate to the first quote as a demo
      navigate("/quotes/3032");
    }
  };
  
  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Quotes</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{isNewQuote ? "Create Quotation" : `Quote #${quoteId}`}</span>
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
          <Button variant="outline" className="text-gray-500" onClick={() => navigate(`/quotes/new`)}>
            Create New Quote
          </Button>
        )}
      </div>
    </div>
  );
}
