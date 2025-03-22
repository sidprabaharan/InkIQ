
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { BoxLabel } from './BoxLabel';

interface BoxLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  customerInfo: {
    name: string;
    companyName: string;
  };
  quoteNickname?: string;
  poNumber?: string;
}

export function BoxLabelDialog({ 
  open, 
  onOpenChange, 
  quoteId,
  customerInfo,
  quoteNickname = "",
  poNumber = ""
}: BoxLabelDialogProps) {
  const [boxNumber, setBoxNumber] = useState(1);
  const [totalBoxes, setTotalBoxes] = useState(1);
  
  const handlePrint = () => {
    window.print();
  };
  
  // Generate the work order URL
  const workOrderUrl = `${window.location.origin}/work-order/${quoteId}`;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Box Label</DialogTitle>
          <DialogClose className="absolute right-4 top-4" />
        </DialogHeader>
        
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm">Box:</label>
                <input
                  type="number"
                  min="1"
                  max={totalBoxes}
                  value={boxNumber}
                  onChange={(e) => setBoxNumber(parseInt(e.target.value))}
                  className="w-16 border rounded p-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm">Total Boxes:</label>
                <input
                  type="number"
                  min="1"
                  value={totalBoxes}
                  onChange={(e) => setTotalBoxes(parseInt(e.target.value))}
                  className="w-16 border rounded p-1"
                />
              </div>
            </div>
            <Button onClick={handlePrint} className="print:hidden">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
          
          <div className="print-container overflow-hidden border rounded-md">
            <BoxLabel 
              customer={customerInfo}
              orderInfo={{
                nickname: quoteNickname,
                poNumber: poNumber,
                orderNumber: quoteId,
                boxNumber,
                totalBoxes
              }}
              workOrderUrl={workOrderUrl}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
