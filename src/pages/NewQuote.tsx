
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, MoreVertical, Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function NewQuote() {
  const navigate = useNavigate();

  return (
    <div className="p-0 bg-white min-h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Quotes</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-sm">Create Quotation</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-gray-500" onClick={() => navigate("/quotes")}>
            Cancel
          </Button>
          <Button variant="outline" className="text-gray-500">Preview</Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">Save & Finish</Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Left Content - 8 columns */}
        <div className="col-span-8 space-y-6">
          {/* Customers Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium">Customers</h3>
              <Button variant="outline" className="text-blue-500 border-blue-500">New Customer</Button>
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
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="py-3 text-xs uppercase">Category</TableHead>
                    <TableHead className="py-3 text-xs uppercase">Item#</TableHead>
                    <TableHead className="py-3 text-xs uppercase">Color</TableHead>
                    <TableHead className="py-3 text-xs uppercase">Description</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">XS</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">S</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">M</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">L</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">XL</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">2XL</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">3XL</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">Quantity</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">Price</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">Taxed</TableHead>
                    <TableHead className="py-3 text-xs uppercase text-center">Total</TableHead>
                    <TableHead className="py-3 text-xs uppercase"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="border-0 w-24 p-0 h-8">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="category1">Category 1</SelectItem>
                          <SelectItem value="category2">Category 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>$$</TableCell>
                    <TableCell className="text-center">
                      <input type="checkbox" className="h-4 w-4" />
                    </TableCell>
                    <TableCell>$$</TableCell>
                    <TableCell>
                      <MoreVertical className="h-5 w-5 text-gray-400" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
                <span className="text-sm">Item Total</span>
                <span className="text-sm">$0.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fees Total</span>
                <span className="text-sm">15%</span>
              </div>
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
    </div>
  );
}
