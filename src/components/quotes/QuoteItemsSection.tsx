
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function QuoteItemsSection() {
  return (
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
  );
}
