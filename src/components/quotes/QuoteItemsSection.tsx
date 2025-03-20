
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function QuoteItemsSection() {
  const [items, setItems] = useState([
    {
      category: "",
      itemNumber: "",
      color: "",
      description: "",
      sizes: {
        xs: 0,
        s: 0,
        m: 0,
        l: 0,
        xl: 0,
        xxl: 0,
        xxxl: 0
      },
      quantity: 0,
      price: 0,
      taxed: false,
      total: 0
    }
  ]);

  const handleInputChange = (index: number, field: string, value: string | number | boolean) => {
    const newItems = [...items];
    
    if (field.startsWith("sizes.")) {
      const size = field.split(".")[1];
      newItems[index].sizes = {
        ...newItems[index].sizes,
        [size]: typeof value === 'string' ? parseInt(value) || 0 : value
      };
      
      // Recalculate quantity based on sizes
      const totalQuantity = Object.values(newItems[index].sizes).reduce((sum, val) => sum + (val as number), 0);
      newItems[index].quantity = totalQuantity;
    } else {
      // @ts-ignore - dynamic field assignment
      newItems[index][field] = value;
    }
    
    // Calculate total
    if (field === 'price' || field.startsWith('sizes.')) {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      category: "",
      itemNumber: "",
      color: "",
      description: "",
      sizes: {
        xs: 0,
        s: 0,
        m: 0,
        l: 0,
        xl: 0,
        xxl: 0,
        xxxl: 0
      },
      quantity: 0,
      price: 0,
      taxed: false,
      total: 0
    }]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Quote Items</h3>
      <div className="border rounded-md overflow-x-auto">
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
            {items.map((item, index) => (
              <TableRow key={index} className="border-b">
                <TableCell className="p-2">
                  <Select 
                    value={item.category} 
                    onValueChange={(value) => handleInputChange(index, "category", value)}
                  >
                    <SelectTrigger className="border-0 h-8 w-full p-0 focus:ring-0">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category1">Category 1</SelectItem>
                      <SelectItem value="category2">Category 2</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-2">
                  <Input 
                    className="h-8 border-0 p-1 focus:ring-0" 
                    value={item.itemNumber}
                    onChange={(e) => handleInputChange(index, "itemNumber", e.target.value)}
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input 
                    className="h-8 border-0 p-1 focus:ring-0" 
                    value={item.color}
                    onChange={(e) => handleInputChange(index, "color", e.target.value)}
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Input 
                    className="h-8 border-0 p-1 focus:ring-0" 
                    value={item.description}
                    onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  />
                </TableCell>
                <TableCell className="p-2 text-center">
                  <Input 
                    className="h-8 border-0 p-1 w-10 text-center mx-auto focus:ring-0" 
                    type="number" 
                    value={item.sizes.xs || ""}
                    onChange={(e) => handleInputChange(index, "sizes.xs", e.target.value)}
                    min="0"
                  />
                </TableCell>
                <TableCell className="p-2 text-center">
                  <Input 
                    className="h-8 border-0 p-1 w-10 text-center mx-auto focus:ring-0" 
                    type="number" 
                    value={item.sizes.s || ""}
                    onChange={(e) => handleInputChange(index, "sizes.s", e.target.value)}
                    min="0"
                  />
                </TableCell>
                <TableCell className="p-2 text-center">
                  <Input 
                    className="h-8 border-0 p-1 w-10 text-center mx-auto focus:ring-0" 
                    type="number" 
                    value={item.sizes.m || ""}
                    onChange={(e) => handleInputChange(index, "sizes.m", e.target.value)}
                    min="0"
                  />
                </TableCell>
                <TableCell className="p-2 text-center">
                  <Input 
                    className="h-8 border-0 p-1 w-10 text-center mx-auto focus:ring-0" 
                    type="number" 
                    value={item.sizes.l || ""}
                    onChange={(e) => handleInputChange(index, "sizes.l", e.target.value)}
                    min="0"
                  />
                </TableCell>
                <TableCell className="p-2 text-center">
                  <Input 
                    className="h-8 border-0 p-1 w-10 text-center mx-auto focus:ring-0" 
                    type="number" 
                    value={item.sizes.xl || ""}
                    onChange={(e) => handleInputChange(index, "sizes.xl", e.target.value)}
                    min="0"
                  />
                </TableCell>
                <TableCell className="p-2 text-center">
                  <Input 
                    className="h-8 border-0 p-1 w-10 text-center mx-auto focus:ring-0" 
                    type="number" 
                    value={item.sizes.xxl || ""}
                    onChange={(e) => handleInputChange(index, "sizes.xxl", e.target.value)}
                    min="0"
                  />
                </TableCell>
                <TableCell className="p-2 text-center">
                  <Input 
                    className="h-8 border-0 p-1 w-10 text-center mx-auto focus:ring-0" 
                    type="number" 
                    value={item.sizes.xxxl || ""}
                    onChange={(e) => handleInputChange(index, "sizes.xxxl", e.target.value)}
                    min="0"
                  />
                </TableCell>
                <TableCell className="p-2 text-center">
                  <div className="text-sm font-medium">{item.quantity}</div>
                </TableCell>
                <TableCell className="p-2">
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <Input 
                      className="h-8 border-0 p-1 w-16 focus:ring-0" 
                      type="number"
                      value={item.price || ""}
                      onChange={(e) => handleInputChange(index, "price", e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </TableCell>
                <TableCell className="p-2 text-center">
                  <Checkbox
                    checked={item.taxed}
                    onCheckedChange={(checked) => handleInputChange(index, "taxed", !!checked)}
                    className="h-4 w-4 mx-auto"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <div className="text-sm font-medium">${item.total.toFixed(2)}</div>
                </TableCell>
                <TableCell className="p-2">
                  <MoreVertical className="h-5 w-5 text-gray-400 mx-auto cursor-pointer" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" onClick={addItem}>
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
