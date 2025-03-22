
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PrintStyles } from "../layout/PrintStyles";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BoxLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  customerInfo?: any;
  orderNickname?: string;
  poNumber?: string;
}

export function BoxLabelDialog({
  open,
  onOpenChange,
  quoteId,
  customerInfo,
  orderNickname = "Project Care Quote",
  poNumber = "PO-" + quoteId,
}: BoxLabelDialogProps) {
  const customerNumber = `CUST-${quoteId}`;
  const orderNumber = `ORD-${quoteId}`;
  const workOrderUrl = `/work-orders/${quoteId}`;
  const customerCompany = customerInfo?.billing?.company || "Customer";

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Box Label</DialogTitle>
          </DialogHeader>
          
          {/* Preview of the label - reduced height to add scroll functionality */}
          <ScrollArea className="h-[480px] rounded-md border p-4">
            <div id="boxLabel" className="w-full" style={{ width: "4in", height: "6in", margin: "0 auto" }}>
              <BoxLabel
                customerNumber={customerNumber}
                orderNumber={orderNumber}
                poNumber={poNumber}
                orderNickname={orderNickname}
                workOrderUrl={workOrderUrl}
                customerCompany={customerCompany}
              />
            </div>
          </ScrollArea>

          <div className="flex justify-end">
            <Button onClick={handlePrint} className="print:hidden">
              <Printer className="h-4 w-4 mr-2" />
              Print Box Label
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <PrintStyles />
    </>
  );
}

function BoxLabel({
  customerNumber,
  orderNumber,
  poNumber,
  orderNickname,
  workOrderUrl,
  customerCompany,
}: {
  customerNumber: string;
  orderNumber: string;
  poNumber: string;
  orderNickname: string;
  workOrderUrl: string;
  customerCompany: string;
}) {
  return (
    <div className="flex flex-col h-full border border-black p-4" style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Removed the Box Label title that was circled in red */}

      <div className="flex flex-col h-full">
        {/* Added QR code at the top right corner */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow">
            <div className="text-xs font-semibold">Customer:</div>
            <div className="text-lg font-bold">{customerCompany}</div>
          </div>
          <div className="flex-shrink-0">
            <QRCodeSVG 
              value={window.location.origin + workOrderUrl}
              size={100}
              level={"H"}
            />
            <div className="text-xs text-center">
              Scan for Work Order
            </div>
          </div>
        </div>
        
        <div className="space-y-4 flex-grow">
          <div>
            <div className="text-xs font-semibold">Customer #:</div>
            <div className="text-lg font-bold">{customerNumber}</div>
          </div>
          
          <div>
            <div className="text-xs font-semibold">Order #:</div>
            <div className="text-lg font-bold">{orderNumber}</div>
          </div>
          
          <div>
            <div className="text-xs font-semibold">PO #:</div>
            <div className="text-lg font-bold">{poNumber}</div>
          </div>
          
          <div>
            <div className="text-xs font-semibold">Nickname:</div>
            <div className="text-lg font-bold truncate">{orderNickname}</div>
          </div>
        </div>
        
        {/* Modified the Box section to align lines with the bottom of "of" */}
        <div className="mt-auto w-full flex flex-col items-center justify-center">
          <div className="text-sm font-semibold">Box:</div>
          <div className="text-4xl font-bold flex items-end">
            <div className="border-b-2 border-black w-16 inline-block"></div>
            <span className="px-2">of</span>
            <div className="border-b-2 border-black w-16 inline-block"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
