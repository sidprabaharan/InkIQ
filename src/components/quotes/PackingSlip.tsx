
import React from "react";
import { Package, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface PackingSlipProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  customerInfo: {
    name: string;
    companyName?: string;
    address1: string;
    address2?: string;
    city: string;
    stateProvince: string;
    zipCode: string;
    country: string;
    phone?: string;
    email?: string;
  };
  items: Array<{
    description: string;
    itemNumber: string;
    color: string;
    xs: string;
    s: string;
    m: string;
    l: string;
    xl: string;
    xxl: string;
    xxxl: string;
  }>;
  shipDate?: string;
}

export function PackingSlip({
  open,
  onOpenChange,
  quoteId,
  customerInfo,
  items,
  shipDate = new Date().toLocaleDateString(),
}: PackingSlipProps) {
  const handlePrint = () => {
    const printContents = document.getElementById("packing-slip")?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
      document.body.innerHTML = `
        <html>
          <head>
            <title>Packing Slip #${quoteId}</title>
            <style>
              @media print {
                body { font-family: sans-serif; }
                .print-button { display: none; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  // Calculate totals for each size
  const sizeTotals = items.reduce((acc, item) => {
    acc.xs += parseInt(item.xs) || 0;
    acc.s += parseInt(item.s) || 0;
    acc.m += parseInt(item.m) || 0;
    acc.l += parseInt(item.l) || 0;
    acc.xl += parseInt(item.xl) || 0;
    acc.xxl += parseInt(item.xxl) || 0;
    acc.xxxl += parseInt(item.xxxl) || 0;
    return acc;
  }, { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, xxxl: 0 });

  const totalItems = Object.values(sizeTotals).reduce((sum, count) => sum + count, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90%] sm:max-w-[1000px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Packing Slip
          </SheetTitle>
          <SheetDescription>
            Print this packing slip to include with your shipment.
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <Button onClick={handlePrint} className="print-button mb-4">
            <Printer className="mr-2 h-4 w-4" />
            Print Packing Slip
          </Button>
          
          <div id="packing-slip" className="bg-white p-6 border rounded-lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-1">Packing Slip</h1>
              <p className="text-gray-500">Order #{quoteId}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Ship To:</h2>
                <div className="border p-3 rounded">
                  <p className="font-medium">{customerInfo.name}</p>
                  {customerInfo.companyName && <p>{customerInfo.companyName}</p>}
                  <p>{customerInfo.address1}</p>
                  {customerInfo.address2 && <p>{customerInfo.address2}</p>}
                  <p>{customerInfo.city}, {customerInfo.stateProvince} {customerInfo.zipCode}</p>
                  <p>{customerInfo.country}</p>
                  {customerInfo.phone && <p>Phone: {customerInfo.phone}</p>}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Shipment Details:</h2>
                <div className="border p-3 rounded">
                  <p><span className="font-medium">Order #:</span> {quoteId}</p>
                  <p><span className="font-medium">Ship Date:</span> {shipDate}</p>
                  <p><span className="font-medium">Total Items:</span> {totalItems}</p>
                  <p><span className="font-medium">Box ___ of ___</span></p>
                </div>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold mb-2">Items:</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Item #</th>
                  <th className="border p-2 text-left">Description</th>
                  <th className="border p-2 text-left">Color</th>
                  <th className="border p-2 text-center">XS</th>
                  <th className="border p-2 text-center">S</th>
                  <th className="border p-2 text-center">M</th>
                  <th className="border p-2 text-center">L</th>
                  <th className="border p-2 text-center">XL</th>
                  <th className="border p-2 text-center">2XL</th>
                  <th className="border p-2 text-center">3XL</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{item.itemNumber}</td>
                    <td className="border p-2">{item.description}</td>
                    <td className="border p-2">{item.color}</td>
                    <td className="border p-2 text-center">{item.xs}</td>
                    <td className="border p-2 text-center">{item.s}</td>
                    <td className="border p-2 text-center">{item.m}</td>
                    <td className="border p-2 text-center">{item.l}</td>
                    <td className="border p-2 text-center">{item.xl}</td>
                    <td className="border p-2 text-center">{item.xxl}</td>
                    <td className="border p-2 text-center">{item.xxxl}</td>
                  </tr>
                ))}
                <tr className="font-semibold bg-gray-50">
                  <td colSpan={3} className="border p-2 text-right">TOTAL:</td>
                  <td className="border p-2 text-center">{sizeTotals.xs}</td>
                  <td className="border p-2 text-center">{sizeTotals.s}</td>
                  <td className="border p-2 text-center">{sizeTotals.m}</td>
                  <td className="border p-2 text-center">{sizeTotals.l}</td>
                  <td className="border p-2 text-center">{sizeTotals.xl}</td>
                  <td className="border p-2 text-center">{sizeTotals.xxl}</td>
                  <td className="border p-2 text-center">{sizeTotals.xxxl}</td>
                </tr>
              </tbody>
            </table>
            
            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Shipping Notes:</h2>
              <p className="text-gray-600 italic">Please verify contents before shipping. Contact customer for any discrepancies.</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
