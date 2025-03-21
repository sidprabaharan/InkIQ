
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface QuoteHeaderProps {
  onCancel?: () => void;
  onPreview?: () => void;
  onSave?: () => void;
}

export function QuoteHeader({ onCancel, onPreview, onSave }: QuoteHeaderProps) {
  const navigate = useNavigate();
  
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
    } else {
      // Navigate to the first quote as a demo
      // In a real app, we would create a new quote and get its ID
      navigate("/quotes/3032");
    }
  };
  
  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Quotes</span>
        <ChevronRight className="h-4 w-4 text-gray-400" />
        <span className="text-sm">Create Quotation</span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="text-gray-500" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="outline" className="text-gray-500" onClick={onPreview}>
          Preview
        </Button>
        <Button className="bg-inkiq-primary hover:bg-inkiq-primary/90 text-white" onClick={handleSave}>
          Save & Finish
        </Button>
      </div>
    </div>
  );
}
