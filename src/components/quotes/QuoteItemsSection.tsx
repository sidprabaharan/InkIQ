import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Trash2, Copy, Image, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MockupUploadDialog } from "./MockupUploadDialog";
import { toast } from "sonner";

interface ItemMockup {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface Item {
  category: string;
  itemNumber: string;
  color: string;
  description: string;
  sizes: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  quantity: number;
  price: number;
  taxed: boolean;
  total: number;
  mockups: ItemMockup[];
}

export function QuoteItemsSection() {
  const [items, setItems] = useState<Item[]>([
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
      total: 0,
      mockups: []
    }
  ]);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);

  const handleInputChange = (index: number, field: string, value: string | number | boolean) => {
    const newItems = [...items];
    
    if (field.startsWith("sizes.")) {
      const size = field.split(".")[1];
      newItems[index].sizes = {
        ...newItems[index].sizes,
        [size]: typeof value === 'string' ? parseInt(value) || 0 : value
      };
      
      const totalQuantity = Object.values(newItems[index].sizes).reduce((sum, val) => sum + (val as number), 0);
      newItems[index].quantity = totalQuantity;
    } else {
      newItems[index][field] = value;
    }
    
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
      total: 0,
      mockups: []
    }]);
  };

  const duplicateItem = (index: number) => {
    const itemToDuplicate = {...items[index]};
    setItems([...items.slice(0, index + 1), itemToDuplicate, ...items.slice(index + 1)]);
  };

  const deleteItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleAttachMockups = (index: number) => {
    setCurrentItemIndex(index);
    setUploadDialogOpen(true);
  };

  const handleUploadComplete = (files: File[]) => {
    if (files.length > 0 && currentItemIndex !== null) {
      const newMockups = files.map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }));
      
      setItems(prevItems => {
        const newItems = [...prevItems];
        newItems[currentItemIndex] = {
          ...newItems[currentItemIndex],
          mockups: [...newItems[currentItemIndex].mockups, ...newMockups]
        };
        return newItems;
      });

      toast.success(`${files.length} mockup${files.length > 1 ? 's' : ''} attached successfully`);
    }
  };

  const handleRemoveMockup = (itemIndex: number, mockupId: string) => {
    setItems(prevItems => {
      const newItems = [...prevItems];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        mockups: newItems[itemIndex].mockups.filter(mockup => mockup.id !== mockupId)
      };
      return newItems;
    });
    
    toast.success("Mockup removed successfully");
  };

  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">Quote Items</h3>
      <div className="border rounded-md overflow-x-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="py-2 text-xs uppercase w-[10%]">Category</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[10%]">Item#</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[10%]">Color</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[15%]">Description</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">XS</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">S</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">M</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">L</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">XL</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">2XL</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">3XL</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">Quantity</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">Price</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">Taxed</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">Total</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[2%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, itemIndex) => (
              <React.Fragment key={itemIndex}>
                <TableRow className="border-b hover:bg-gray-50">
                  <TableCell className="p-0 border-r border-gray-200">
                    <Select 
                      value={item.category} 
                      onValueChange={(value) => handleInputChange(itemIndex, "category", value)}
                    >
                      <SelectTrigger className="border-0 h-8 w-full rounded-none focus:ring-0">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="category1">Category 1</SelectItem>
                        <SelectItem value="category2">Category 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-0 border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full focus:ring-0" 
                      value={item.itemNumber}
                      onChange={(e) => handleInputChange(itemIndex, "itemNumber", e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-0 border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full focus:ring-0" 
                      value={item.color}
                      onChange={(e) => handleInputChange(itemIndex, "color", e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-0 border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full focus:ring-0" 
                      value={item.description}
                      onChange={(e) => handleInputChange(itemIndex, "description", e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full text-center focus:ring-0" 
                      type="number" 
                      value={item.sizes.xs || ""}
                      onChange={(e) => handleInputChange(itemIndex, "sizes.xs", e.target.value)}
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full text-center focus:ring-0" 
                      type="number" 
                      value={item.sizes.s || ""}
                      onChange={(e) => handleInputChange(itemIndex, "sizes.s", e.target.value)}
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full text-center focus:ring-0" 
                      type="number" 
                      value={item.sizes.m || ""}
                      onChange={(e) => handleInputChange(itemIndex, "sizes.m", e.target.value)}
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full text-center focus:ring-0" 
                      type="number" 
                      value={item.sizes.l || ""}
                      onChange={(e) => handleInputChange(itemIndex, "sizes.l", e.target.value)}
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full text-center focus:ring-0" 
                      type="number" 
                      value={item.sizes.xl || ""}
                      onChange={(e) => handleInputChange(itemIndex, "sizes.xl", e.target.value)}
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full text-center focus:ring-0" 
                      type="number" 
                      value={item.sizes.xxl || ""}
                      onChange={(e) => handleInputChange(itemIndex, "sizes.xxl", e.target.value)}
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center border-r border-gray-200">
                    <Input 
                      className="h-8 border-0 rounded-none w-full text-center focus:ring-0" 
                      type="number" 
                      value={item.sizes.xxxl || ""}
                      onChange={(e) => handleInputChange(itemIndex, "sizes.xxxl", e.target.value)}
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="p-0 text-center border-r border-gray-200">
                    <div className="text-sm font-medium h-8 flex items-center justify-center">{item.quantity}</div>
                  </TableCell>
                  <TableCell className="p-0 border-r border-gray-200">
                    <div className="flex items-center h-8">
                      <span className="text-gray-500 ml-2 mr-0">$</span>
                      <Input 
                        className="h-8 border-0 rounded-none pl-0 w-full focus:ring-0" 
                        type="number"
                        value={item.price || ""}
                        onChange={(e) => handleInputChange(itemIndex, "price", e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="p-0 text-center border-r border-gray-200">
                    <div className="h-8 flex items-center justify-center">
                      <Checkbox
                        checked={item.taxed}
                        onCheckedChange={(checked) => handleInputChange(itemIndex, "taxed", !!checked)}
                        className="h-4 w-4"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="p-0 border-r border-gray-200">
                    <div className="text-sm font-medium h-8 flex items-center justify-center">${item.total.toFixed(2)}</div>
                  </TableCell>
                  <TableCell className="p-0 text-center">
                    <div className="h-8 flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-5 w-5 flex items-center justify-center focus:outline-none">
                            <MoreVertical className="h-5 w-5 text-gray-400 cursor-pointer" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem onClick={() => handleAttachMockups(itemIndex)} className="gap-2">
                            <Image className="h-4 w-4" />
                            Attach Mockups
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateItem(itemIndex)} className="gap-2">
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteItem(itemIndex)} className="gap-2 text-red-500">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
                
                {item.mockups.length > 0 && (
                  <TableRow className="border-b hover:bg-gray-50">
                    <TableCell colSpan={16} className="p-2 bg-gray-50">
                      <div className="flex flex-wrap gap-2 p-2">
                        {item.mockups.map((mockup) => (
                          <div 
                            key={mockup.id} 
                            className="relative w-20 h-20 border rounded-md overflow-hidden group"
                          >
                            <img 
                              src={mockup.url} 
                              alt={mockup.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => handleRemoveMockup(itemIndex, mockup.id)}
                              className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex gap-4 mt-2">
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
      
      <MockupUploadDialog 
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUploadComplete}
      />
    </div>
  );
}
