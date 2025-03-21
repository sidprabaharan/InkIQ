import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, MoreVertical, Plus } from "lucide-react";

interface QuoteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuoteFormDialog({ open, onOpenChange }: QuoteFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1100px] p-0 h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Quotes</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-sm">Create Quotation</span>
          </div>
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="text-gray-500">Cancel</Button>
            </DialogClose>
            <Button variant="outline" className="text-gray-500">Preview</Button>
            <Button className="bg-inkiq-primary hover:bg-inkiq-primary/90">Save & Finish</Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 p-6">
          {/* Left Content - 8 columns */}
          <div className="col-span-8 space-y-6">
            {/* Customers Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">Customers</h3>
                <Button variant="outline" className="text-inkiq-primary">New Customer</Button>
              </div>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select A Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer1">Customer 1</SelectItem>
                  <SelectItem value="customer2">Customer 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Customer Billing Section */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Customer Billing</h3>
              <div className="space-y-4">
                <Input placeholder="Company" />
                <Input placeholder="Name" />
                <Input placeholder="Address" />
                <Input placeholder="Address" />
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="State/ Province" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" />
                  <Input placeholder="Zip Code Postal Code" />
                </div>
              </div>
            </div>

            {/* Customer Shipping Address */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Customer Shipping Address</h3>
              <div className="space-y-4">
                <Input placeholder="Company" />
                <Input placeholder="Name" />
                <Input placeholder="Address" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" />
                  <Input placeholder="Input text" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Zip Code" />
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Quote Items */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Quote Items</h3>
              <div className="overflow-x-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item#</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">XS</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">M</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">L</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">XL</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">2XL</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">3XL</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Taxed</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <Select>
                          <SelectTrigger className="border-0 w-24 p-0 h-8">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="category1">Category 1</SelectItem>
                            <SelectItem value="category2">Category 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500"></td>
                      <td className="px-4 py-3 text-sm text-gray-500">$$</td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-center">
                        <input type="checkbox" className="h-4 w-4" />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">$$</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Line Item
                </Button>
                <Button variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Imprint
                </Button>
                <div className="flex-1"></div>
                <Button variant="outline" className="gap-2 ml-auto">
                  <Plus className="h-4 w-4" />
                  Line Item Group
                </Button>
              </div>
            </div>
          </div>

          {/* Right Content - 4 columns */}
          <div className="col-span-4 space-y-6">
            {/* Quotation Header */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h2 className="text-xl font-semibold">Quotation</h2>
              <p className="text-sm text-gray-500">#26048957</p>
            </div>

            {/* Quotation Details */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Quotation Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Owner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner1">Owner 1</SelectItem>
                      <SelectItem value="owner2">Owner 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Delivery Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="method1">Method 1</SelectItem>
                      <SelectItem value="method2">Method 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="PO Number" />
                <Input placeholder="Created" />
                <Input placeholder="Production Due Date" />
                <Input placeholder="Customer Due Date" />
                <Input placeholder="Payment Due Date" />
                <Input placeholder="Invoice Date" />
              </div>
            </div>

            {/* Nick Name */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Nick Name</h3>
              <Input placeholder="Add a new Nick Name" />
            </div>

            {/* Customer Notes */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Customer Notes</h3>
              <Textarea placeholder="Write text here ..." className="min-h-[100px]" />
            </div>

            {/* Production Note */}
            <div className="space-y-4">
              <h3 className="text-base font-medium">Production Note</h3>
              <Textarea placeholder="Write text here ..." className="min-h-[100px]" />
            </div>

            {/* Invoice Summary */}
            <div className="space-y-4">
              <div className="bg-blue-100 p-4 rounded-md">
                <h3 className="text-base font-medium text-center">Invoice Summary</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sub Total</span>
                  <span className="text-sm">$0.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Discount</span>
                  <div className="flex items-center">
                    <Input className="w-16 h-8 text-xs" placeholder="%" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sales Tax</span>
                  <div className="flex items-center">
                    <Input className="w-16 h-8 text-xs" placeholder="%" />
                  </div>
                </div>
                <div className="flex justify-between items-center font-medium">
                  <span>Total Due</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

