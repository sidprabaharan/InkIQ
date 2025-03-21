
import React, { useState } from "react";
import { QuoteItem } from "./QuoteData";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface QuoteItemsSectionProps {
  initialItems?: QuoteItem[];
}

export function QuoteItemsSection({ initialItems = [] }: QuoteItemsSectionProps) {
  const [items, setItems] = useState<QuoteItem[]>(initialItems);

  const addNewItem = () => {
    const newItem: QuoteItem = {
      category: "",
      itemNumber: "",
      color: "",
      description: "",
      xs: "",
      s: "",
      m: "",
      l: "",
      xl: "",
      xxl: "",
      xxxl: "",
      quantity: "0",
      price: "$0.00",
      taxed: true,
      total: "$0.00"
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index: number, field: keyof QuoteItem, value: string | boolean) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Quote Items</h3>
        <Button onClick={addNewItem} variant="outline" size="sm" className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Item#</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">XS</TableHead>
              <TableHead className="text-center">S</TableHead>
              <TableHead className="text-center">M</TableHead>
              <TableHead className="text-center">L</TableHead>
              <TableHead className="text-center">XL</TableHead>
              <TableHead className="text-center">2XL</TableHead>
              <TableHead className="text-center">3XL</TableHead>
              <TableHead className="text-center">QTY</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Taxed</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className="text-center py-4 text-gray-500">
                  No items added. Click "Add Item" to add your first item.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select value={item.category} onValueChange={(value) => updateItem(index, 'category', value)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="T-Shirts">T-Shirts</SelectItem>
                        <SelectItem value="Hoodies">Hoodies</SelectItem>
                        <SelectItem value="Hats">Hats</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.itemNumber} 
                      onChange={(e) => updateItem(index, 'itemNumber', e.target.value)}
                      className="w-[80px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.color} 
                      onChange={(e) => updateItem(index, 'color', e.target.value)}
                      className="w-[80px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.description} 
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-[150px]"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.xs} 
                      onChange={(e) => updateItem(index, 'xs', e.target.value)}
                      className="w-[50px] text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.s} 
                      onChange={(e) => updateItem(index, 's', e.target.value)}
                      className="w-[50px] text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.m} 
                      onChange={(e) => updateItem(index, 'm', e.target.value)}
                      className="w-[50px] text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.l} 
                      onChange={(e) => updateItem(index, 'l', e.target.value)}
                      className="w-[50px] text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.xl} 
                      onChange={(e) => updateItem(index, 'xl', e.target.value)}
                      className="w-[50px] text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.xxl} 
                      onChange={(e) => updateItem(index, 'xxl', e.target.value)}
                      className="w-[50px] text-center"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={item.xxxl} 
                      onChange={(e) => updateItem(index, 'xxxl', e.target.value)}
                      className="w-[50px] text-center"
                    />
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell>
                    <Input 
                      value={item.price} 
                      onChange={(e) => updateItem(index, 'price', e.target.value)}
                      className="w-[80px] text-right"
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={item.taxed} 
                      onCheckedChange={(checked) => updateItem(index, 'taxed', !!checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">{item.total}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeItem(index)}
                      className="h-8 w-8 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
