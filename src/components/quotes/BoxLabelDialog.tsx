
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Printer } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { PrintStyles } from "../layout/PrintStyles";

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
  const [currentBox, setCurrentBox] = useState("1");
  const [totalBoxes, setTotalBoxes] = useState("1");
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

          {/* Box number inputs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor="currentBox">Box Number</Label>
              <Input
                id="currentBox"
                value={currentBox}
                onChange={(e) => setCurrentBox(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalBoxes">Total Boxes</Label>
              <Input
                id="totalBoxes"
                value={totalBoxes}
                onChange={(e) => setTotalBoxes(e.target.value)}
              />
            </div>
          </div>
          
          {/* Preview of the label */}
          <div className="border rounded p-4 mb-4">
            <div id="boxLabel" className="w-full" style={{ width: "4in", height: "6in", margin: "0 auto" }}>
              <BoxLabel
                customerNumber={customerNumber}
                orderNumber={orderNumber}
                poNumber={poNumber}
                orderNickname={orderNickname}
                currentBox={currentBox}
                totalBoxes={totalBoxes}
                workOrderUrl={workOrderUrl}
              />
            </div>
          </div>

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
  currentBox,
  totalBoxes,
  workOrderUrl,
}: {
  customerNumber: string;
  orderNumber: string;
  poNumber: string;
  orderNickname: string;
  currentBox: string;
  totalBoxes: string;
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
            <div className="text-3xl font-bold">
              {currentBox} of {totalBoxes}
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
