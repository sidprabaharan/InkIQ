
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
          
          {/* Preview of the label */}
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div id="boxLabel" className="w-full" style={{ width: "4in", height: "6in", margin: "0 auto" }}>
              <BoxLabel
                customerNumber={customerNumber}
                orderNumber={orderNumber}
                poNumber={poNumber}
                orderNickname={orderNickname}
                workOrderUrl={workOrderUrl}
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
}: {
  customerNumber: string;
  orderNumber: string;
  poNumber: string;
  orderNickname: string;
  workOrderUrl: string;
}) {
  return (
    <div className="flex flex-col h-full border border-black p-4" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="text-center border-b pb-2 mb-2">
        <h1 className="text-xl font-bold">Box Label</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 flex-grow">
        <div className="space-y-4">
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
          
          <div className="mt-auto">
            <div className="text-xs font-semibold">Box:</div>
            <div className="text-3xl font-bold flex items-center">
              <div className="border-b-2 border-black w-12 inline-block"></div>
              <span className="px-2">of</span>
              <div className="border-b-2 border-black w-12 inline-block"></div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center">
          <QRCodeSVG 
            value={window.location.origin + workOrderUrl}
            size={150}
            level={"H"}
          />
          <div className="mt-2 text-xs text-center">
            Scan for Work Order
          </div>
        </div>
      </div>
    </div>
  );
}
