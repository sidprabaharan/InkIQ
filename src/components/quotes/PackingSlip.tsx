
import React, { useState } from "react";
import { Package, Printer, Save, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentBox, setCurrentBox] = useState("1");
  const [totalBoxes, setTotalBoxes] = useState("1");
  const [editedCustomerInfo, setEditedCustomerInfo] = useState(customerInfo);
  const [editedItems, setEditedItems] = useState(items);
  const [editedShipDate, setEditedShipDate] = useState(shipDate);
  const [shippingNotes, setShippingNotes] = useState("Please verify contents before shipping. Contact customer for any discrepancies.");

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
                .edit-button { display: none; }
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

  const handleToggleEdit = () => {
    if (isEditing) {
      // Save changes
      toast({
        title: "Changes saved",
        description: "Packing slip has been updated",
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle item quantity changes
  const updateItemQuantity = (index: number, size: string, value: string) => {
    const newItems = [...editedItems];
    newItems[index] = {
      ...newItems[index],
      [size.toLowerCase()]: value
    };
    setEditedItems(newItems);
  };

  // Calculate totals for each size
  const sizeTotals = editedItems.reduce((acc, item) => {
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

  // Update customer info
  const updateCustomerInfo = (field: string, value: string) => {
    setEditedCustomerInfo({
      ...editedCustomerInfo,
      [field]: value
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[90%] sm:max-w-[1000px] p-0">
        <SheetHeader className="p-6 pb-2">
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Packing Slip
          </SheetTitle>
          <SheetDescription>
            Print this packing slip to include with your shipment. Click Edit to update quantities for short shipments.
          </SheetDescription>
        </SheetHeader>
        
        <div className="px-6 pt-2 pb-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={handlePrint} className="print-button">
              <Printer className="mr-2 h-4 w-4" />
              Print Packing Slip
            </Button>
            <Button 
              onClick={handleToggleEdit} 
              variant={isEditing ? "default" : "outline"} 
              className="edit-button"
            >
              {isEditing ? <Save className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
              {isEditing ? "Save Changes" : "Edit Quantities"}
            </Button>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-180px)] px-6 pb-6">
          <div id="packing-slip" className="bg-white p-6 border rounded-lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-1">Packing Slip</h1>
              <p className="text-gray-500">Order #{quoteId}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Ship To:</h2>
                <div className="border p-3 rounded">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input 
                        value={editedCustomerInfo.name} 
                        onChange={(e) => updateCustomerInfo("name", e.target.value)}
                        placeholder="Customer Name"
                      />
                      <Input 
                        value={editedCustomerInfo.companyName || ''} 
                        onChange={(e) => updateCustomerInfo("companyName", e.target.value)}
                        placeholder="Company"
                      />
                      <Input 
                        value={editedCustomerInfo.address1} 
                        onChange={(e) => updateCustomerInfo("address1", e.target.value)}
                        placeholder="Address Line 1"
                      />
                      <Input 
                        value={editedCustomerInfo.address2 || ''} 
                        onChange={(e) => updateCustomerInfo("address2", e.target.value)}
                        placeholder="Address Line 2"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          value={editedCustomerInfo.city} 
                          onChange={(e) => updateCustomerInfo("city", e.target.value)}
                          placeholder="City"
                        />
                        <Input 
                          value={editedCustomerInfo.stateProvince} 
                          onChange={(e) => updateCustomerInfo("stateProvince", e.target.value)}
                          placeholder="State/Province"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          value={editedCustomerInfo.zipCode} 
                          onChange={(e) => updateCustomerInfo("zipCode", e.target.value)}
                          placeholder="Zip/Postal Code"
                        />
                        <Input 
                          value={editedCustomerInfo.country} 
                          onChange={(e) => updateCustomerInfo("country", e.target.value)}
                          placeholder="Country"
                        />
                      </div>
                      <Input 
                        value={editedCustomerInfo.phone || ''} 
                        onChange={(e) => updateCustomerInfo("phone", e.target.value)}
                        placeholder="Phone"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium">{editedCustomerInfo.name}</p>
                      {editedCustomerInfo.companyName && <p>{editedCustomerInfo.companyName}</p>}
                      <p>{editedCustomerInfo.address1}</p>
                      {editedCustomerInfo.address2 && <p>{editedCustomerInfo.address2}</p>}
                      <p>{editedCustomerInfo.city}, {editedCustomerInfo.stateProvince} {editedCustomerInfo.zipCode}</p>
                      <p>{editedCustomerInfo.country}</p>
                      {editedCustomerInfo.phone && <p>Phone: {editedCustomerInfo.phone}</p>}
                      {editedCustomerInfo.email && <p>Email: {editedCustomerInfo.email}</p>}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Shipment Details:</h2>
                <div className="border p-3 rounded">
                  <p><span className="font-medium">Order #:</span> {quoteId}</p>
                  <div className="flex items-center gap-2 my-1">
                    <span className="font-medium">Ship Date:</span> 
                    {isEditing ? (
                      <Input 
                        type="date" 
                        value={editedShipDate} 
                        onChange={(e) => setEditedShipDate(e.target.value)}
                        className="w-40"
                      />
                    ) : (
                      <span>{editedShipDate}</span>
                    )}
                  </div>
                  <p><span className="font-medium">Total Items:</span> {totalItems}</p>
                  <div className="flex items-center gap-2 my-1">
                    <span className="font-medium">Box</span>
                    {isEditing ? (
                      <>
                        <Input 
                          type="number" 
                          value={currentBox} 
                          onChange={(e) => setCurrentBox(e.target.value)}
                          className="w-16"
                          min="1"
                        />
                        <span>of</span>
                        <Input 
                          type="number" 
                          value={totalBoxes} 
                          onChange={(e) => setTotalBoxes(e.target.value)}
                          className="w-16"
                          min="1"
                        />
                      </>
                    ) : (
                      <span>{currentBox} of {totalBoxes}</span>
                    )}
                  </div>
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
                {editedItems.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{item.itemNumber}</td>
                    <td className="border p-2">{item.description}</td>
                    <td className="border p-2">{item.color}</td>
                    <td className="border p-2 text-center">
                      {isEditing ? 
                        <Input 
                          type="number" 
                          value={item.xs} 
                          onChange={(e) => updateItemQuantity(index, "xs", e.target.value)}
                          className="w-full text-center p-1 h-8"
                          min="0"
                        /> : 
                        item.xs
                      }
                    </td>
                    <td className="border p-2 text-center">
                      {isEditing ? 
                        <Input 
                          type="number" 
                          value={item.s} 
                          onChange={(e) => updateItemQuantity(index, "s", e.target.value)}
                          className="w-full text-center p-1 h-8"
                          min="0"
                        /> : 
                        item.s
                      }
                    </td>
                    <td className="border p-2 text-center">
                      {isEditing ? 
                        <Input 
                          type="number" 
                          value={item.m} 
                          onChange={(e) => updateItemQuantity(index, "m", e.target.value)}
                          className="w-full text-center p-1 h-8"
                          min="0"
                        /> : 
                        item.m
                      }
                    </td>
                    <td className="border p-2 text-center">
                      {isEditing ? 
                        <Input 
                          type="number" 
                          value={item.l} 
                          onChange={(e) => updateItemQuantity(index, "l", e.target.value)}
                          className="w-full text-center p-1 h-8"
                          min="0"
                        /> : 
                        item.l
                      }
                    </td>
                    <td className="border p-2 text-center">
                      {isEditing ? 
                        <Input 
                          type="number" 
                          value={item.xl} 
                          onChange={(e) => updateItemQuantity(index, "xl", e.target.value)}
                          className="w-full text-center p-1 h-8"
                          min="0"
                        /> : 
                        item.xl
                      }
                    </td>
                    <td className="border p-2 text-center">
                      {isEditing ? 
                        <Input 
                          type="number" 
                          value={item.xxl} 
                          onChange={(e) => updateItemQuantity(index, "xxl", e.target.value)}
                          className="w-full text-center p-1 h-8"
                          min="0"
                        /> : 
                        item.xxl
                      }
                    </td>
                    <td className="border p-2 text-center">
                      {isEditing ? 
                        <Input 
                          type="number" 
                          value={item.xxxl} 
                          onChange={(e) => updateItemQuantity(index, "xxxl", e.target.value)}
                          className="w-full text-center p-1 h-8"
                          min="0"
                        /> : 
                        item.xxxl
                      }
                    </td>
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
              {isEditing ? (
                <Input 
                  value={shippingNotes} 
                  onChange={(e) => setShippingNotes(e.target.value)}
                  placeholder="Add shipping notes"
                />
              ) : (
                <p className="text-gray-600 italic">{shippingNotes}</p>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
