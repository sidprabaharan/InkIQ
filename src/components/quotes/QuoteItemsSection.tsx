import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, MoreHorizontal, Trash2, Copy, Image, X, Upload } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ItemMockup {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface QuoteItem {
  id: string;
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
  unitPrice: number;
  taxed: boolean;
  total: number;
  mockups: ItemMockup[];
}

interface ItemGroup {
  id: string;
  items: QuoteItem[];
}

interface QuoteItemsSectionProps {
  quoteData?: any;
}

export interface QuoteItemsSectionRef {
  getCurrentItemGroups: () => ItemGroup[];
}

const PRODUCT_CATEGORIES = [
  "T-Shirts",
  "Polo Shirts", 
  "Hoodies",
  "Sweatshirts",
  "Tank Tops",
  "Long Sleeve Shirts",
  "Jackets",
  "Hats",
  "Bags",
  "Other"
];

export const QuoteItemsSection = forwardRef<QuoteItemsSectionRef, QuoteItemsSectionProps>(
  ({ quoteData }, ref) => {
    const [itemGroups, setItemGroups] = useState<ItemGroup[]>([
      {
        id: 'group-1',
        items: [
          {
            id: 'item-1',
            category: '',
            itemNumber: '',
            color: '',
            description: '',
            sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, xxxl: 0 },
            quantity: 0,
            unitPrice: 0,
            taxed: false,
            total: 0,
            mockups: []
          }
        ]
      }
    ]);

    // Add state for imprint dialog
    const [imprintDialogOpen, setImprintDialogOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [proofMockupFile, setProofMockupFile] = useState<File | null>(null);

    // Debug logging in useEffect to prevent infinite re-renders
    useEffect(() => {
      console.log('🔍 [DEBUG] QuoteItemsSection - Component rendered');
    }, []);
    
    // Log when itemGroups change (mockups added/removed)
    useEffect(() => {
      console.log('🔍 [DEBUG] QuoteItemsSection - itemGroups updated:', itemGroups);
    }, [itemGroups]);
    
    // Log when dialog opens/closes
    useEffect(() => {
      if (imprintDialogOpen) {
        console.log('🔍 [DEBUG] QuoteItemsSection - Imprint dialog opened');
      }
    }, [imprintDialogOpen]);

    // Calculate totals for each item
    const calculateItemTotal = (item: QuoteItem) => {
      const totalQuantity = Object.values(item.sizes).reduce((sum, qty) => sum + qty, 0);
      return totalQuantity * item.unitPrice;
    };

    // Calculate total quantity for an item
    const calculateItemQuantity = (item: QuoteItem) => {
      return Object.values(item.sizes).reduce((sum, qty) => sum + qty, 0);
    };

    // Update item when any field changes
    const updateItem = (groupId: string, itemId: string, updates: Partial<QuoteItem>) => {
      console.log('🔍 [DEBUG] QuoteItemsSection - updateItem called:', { groupId, itemId, updates });
      console.log('🔍 [DEBUG] QuoteItemsSection - Current itemGroups before update:', JSON.parse(JSON.stringify(itemGroups)));
      
      setItemGroups(prev => {
        console.log('🔍 [DEBUG] QuoteItemsSection - updateItem setState callback - prev state:', JSON.parse(JSON.stringify(prev)));
        
        const updated = prev.map(group => {
          if (group.id === groupId) {
            console.log('🔍 [DEBUG] QuoteItemsSection - Found matching group:', group.id);
            return {
              ...group,
              items: group.items.map(item => {
                if (item.id === itemId) {
                  console.log('🔍 [DEBUG] QuoteItemsSection - Found matching item:', item.id);
                  console.log('🔍 [DEBUG] QuoteItemsSection - Current item mockups:', item.mockups);
                  console.log('🔍 [DEBUG] QuoteItemsSection - Updates to apply:', updates);
                  
                  const updatedItem = { ...item, ...updates };
                  
                  // Recalculate total when sizes or price changes
                  if (updates.sizes || updates.unitPrice) {
                    updatedItem.total = calculateItemTotal(updatedItem);
                    updatedItem.quantity = calculateItemQuantity(updatedItem);
                  }
                  
                  console.log('🔍 [DEBUG] QuoteItemsSection - Updated item:', updatedItem);
                  console.log('🔍 [DEBUG] QuoteItemsSection - Updated item mockups:', updatedItem.mockups);
                  
                  return updatedItem;
                }
                return item;
              })
            };
          }
          return group;
        });
        
        console.log('🔍 [DEBUG] QuoteItemsSection - updateItem setState callback - updated state:', JSON.parse(JSON.stringify(updated)));
        return updated;
      });
    };

    // Update size quantity
    const updateSizeQuantity = (groupId: string, itemId: string, size: keyof QuoteItem['sizes'], value: number) => {
      console.log('🔍 [DEBUG] QuoteItemsSection - updateSizeQuantity called:', { groupId, itemId, size, value });
      updateItem(groupId, itemId, {
          sizes: {
          ...itemGroups.find(g => g.id === groupId)?.items.find(i => i.id === itemId)?.sizes!,
          [size]: value
        }
      });
    };

    // Add new line item to existing group
    const addLineItem = (groupId: string) => {
      console.log('🔍 [DEBUG] QuoteItemsSection - addLineItem called for group:', groupId);
      const newItem: QuoteItem = {
        id: `item-${Date.now()}`,
        category: '',
        itemNumber: '',
        color: '',
        description: '',
        sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, xxxl: 0 },
        quantity: 0,
        unitPrice: 0,
        taxed: false,
        total: 0,
        mockups: []
      };

      setItemGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            items: [...group.items, newItem]
          };
        }
        return group;
      }));
    };

    // Get first available item ID for a group
    const getFirstItemId = (groupId: string) => {
      const group = itemGroups.find(g => g.id === groupId);
      return group?.items[0]?.id || '';
    };

    // Add new imprint to existing item
    const addImprint = (groupId: string, itemId: string) => {
      console.log('🔍 [DEBUG] QuoteItemsSection - addImprint called:', { groupId, itemId });
      console.log('🔍 [DEBUG] QuoteItemsSection - Opening imprint dialog...');
      
      // If no specific item is selected, use the first available item in the group
      let targetItemId = itemId;
      if (!targetItemId && groupId) {
        const firstItem = itemGroups.find(g => g.id === groupId)?.items[0];
        if (firstItem) {
          targetItemId = firstItem.id;
          console.log('🔍 [DEBUG] QuoteItemsSection - No item selected, using first item:', targetItemId);
        }
      }
      
      if (!targetItemId) {
        console.error('🔍 [ERROR] QuoteItemsSection - No item available for imprint');
        return;
      }
      
      console.log('🔍 [DEBUG] QuoteItemsSection - Setting dialog state...');
      setSelectedGroupId(groupId);
      setSelectedItemId(targetItemId);
      setImprintDialogOpen(true);
      setUploadedFiles([]);
      setProofMockupFile(null);
      
      console.log('🔍 [DEBUG] QuoteItemsSection - Dialog state set:', { 
        imprintDialogOpen: true, 
        selectedGroupId: groupId, 
        selectedItemId: targetItemId 
      });
      
      // Verify the item exists
      const targetItem = itemGroups.find(g => g.id === groupId)?.items.find(i => i.id === targetItemId);
      console.log('🔍 [DEBUG] QuoteItemsSection - Target item found:', targetItem);
      console.log('🔍 [DEBUG] QuoteItemsSection - Target item mockups:', targetItem?.mockups);
    };

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log('🔍 [DEBUG] QuoteItemsSection - handleFileUpload called');
      const files = Array.from(event.target.files || []);
      console.log('🔍 [DEBUG] QuoteItemsSection - Files selected:', files);
      
      setUploadedFiles(prev => [...prev, ...files]);
      console.log('🔍 [DEBUG] QuoteItemsSection - Updated uploadedFiles:', [...uploadedFiles, ...files]);
    };

    // Handle proof/mockup file upload
    const handleProofMockupUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log('🔍 [DEBUG] QuoteItemsSection - handleProofMockupUpload called');
      const file = event.target.files?.[0];
      if (file) {
        console.log('🔍 [DEBUG] QuoteItemsSection - Proof/Mockup file selected:', file);
        setProofMockupFile(file);
      }
    };

    // Handle imprint dialog close
    const handleImprintDialogClose = () => {
      console.log('🔍 [DEBUG] QuoteItemsSection - handleImprintDialogClose called');
      console.log('🔍 [DEBUG] QuoteItemsSection - Current state before closing:', {
        imprintDialogOpen,
        selectedItemId,
        selectedGroupId,
        uploadedFiles: uploadedFiles.length,
        proofMockupFile: proofMockupFile?.name
      });
      
      setImprintDialogOpen(false);
      setSelectedItemId('');
      setSelectedGroupId('');
      setUploadedFiles([]);
      setProofMockupFile(null);
      
      console.log('🔍 [DEBUG] QuoteItemsSection - Dialog closed, state reset');
    };

    // Handle imprint save
    const handleImprintSave = () => {
      console.log('🔍 [DEBUG] QuoteItemsSection - handleImprintSave called');
      console.log('🔍 [DEBUG] QuoteItemsSection - Saving imprints for item:', selectedItemId);
      console.log('🔍 [DEBUG] QuoteItemsSection - Files to save:', uploadedFiles);
      console.log('🔍 [DEBUG] QuoteItemsSection - Proof/Mockup file:', proofMockupFile);
      console.log('🔍 [DEBUG] QuoteItemsSection - selectedGroupId:', selectedGroupId);
      console.log('🔍 [DEBUG] QuoteItemsSection - Current itemGroups state:', itemGroups);
      
      if (uploadedFiles.length > 0 || proofMockupFile) {
        // Convert files to mockups and add to the item
        const newMockups: ItemMockup[] = [];
        
        // Add uploaded files
        uploadedFiles.forEach((file, index) => {
          const mockup = {
            id: `mockup-${Date.now()}-${index}`,
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
          };
          newMockups.push(mockup);
          console.log('🔍 [DEBUG] QuoteItemsSection - Created mockup from uploaded file:', mockup);
        });
        
        // Add proof/mockup file if exists
        if (proofMockupFile) {
          const proofMockup = {
            id: `proof-mockup-${Date.now()}`,
            name: proofMockupFile.name,
            url: URL.createObjectURL(proofMockupFile),
            type: proofMockupFile.type
          };
          newMockups.push(proofMockup);
          console.log('🔍 [DEBUG] QuoteItemsSection - Created mockup from proof file:', proofMockup);
        }

        console.log('🔍 [DEBUG] QuoteItemsSection - All new mockups to add:', newMockups);
        
        // Find current item to get existing mockups
        const currentItem = itemGroups.find(g => g.id === selectedGroupId)?.items.find(i => i.id === selectedItemId);
        console.log('🔍 [DEBUG] QuoteItemsSection - Current item found:', currentItem);
        console.log('🔍 [DEBUG] QuoteItemsSection - Current item mockups before update:', currentItem?.mockups);
        
        if (!currentItem) {
          console.error('🔍 [ERROR] QuoteItemsSection - Could not find current item for update');
          return;
        }
        
        // Update the item with new mockups
        const updatedMockups = [...(currentItem.mockups || []), ...newMockups];
        console.log('🔍 [DEBUG] QuoteItemsSection - Updated mockups array:', updatedMockups);
        
        console.log('🔍 [DEBUG] QuoteItemsSection - About to call updateItem with:', {
          groupId: selectedGroupId,
          itemId: selectedItemId,
          mockups: updatedMockups
        });
        
        updateItem(selectedGroupId, selectedItemId, {
          mockups: updatedMockups
        });
        
        console.log('🔍 [DEBUG] QuoteItemsSection - updateItem called with mockups:', updatedMockups);
        
        // Verify the update worked by checking the state after a brief delay
        setTimeout(() => {
          const updatedItem = itemGroups.find(g => g.id === selectedGroupId)?.items.find(i => i.id === selectedItemId);
          console.log('🔍 [DEBUG] QuoteItemsSection - Item after update (delayed check):', updatedItem);
          console.log('🔍 [DEBUG] QuoteItemsSection - Mockups after update (delayed check):', updatedItem?.mockups);
          
          // Also check the current state directly
          console.log('🔍 [DEBUG] QuoteItemsSection - Current itemGroups state after update:', itemGroups);
        }, 100);
        
      } else {
        console.log('🔍 [DEBUG] QuoteItemsSection - No files to save');
      }
      
      handleImprintDialogClose();
    };

    // Duplicate an item
    const duplicateItem = (groupId: string, itemId: string) => {
      console.log('🔍 [DEBUG] QuoteItemsSection - duplicateItem called:', { groupId, itemId });
      const originalItem = itemGroups.find(g => g.id === groupId)?.items.find(i => i.id === itemId);
      if (originalItem) {
        const newItem = {
          ...originalItem,
          id: `item-${Date.now()}`,
          itemNumber: `${originalItem.itemNumber}-copy`
        };
        
        setItemGroups(prev => prev.map(group => {
          if (group.id === groupId) {
            return {
              ...group,
              items: [...group.items, newItem]
            };
          }
          return group;
        }));
      }
    };

    // Delete an item
    const deleteItem = (groupId: string, itemId: string) => {
      console.log('🔍 [DEBUG] QuoteItemsSection - deleteItem called:', { groupId, itemId });
      setItemGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            items: group.items.filter(item => item.id !== itemId)
          };
        }
        return group;
      }));
    };

    // Add new line item group
    const addLineItemGroup = () => {
      console.log('🔍 [DEBUG] QuoteItemsSection - addLineItemGroup called');
      const newGroup: ItemGroup = {
        id: `group-${Date.now()}`,
        items: [
          {
            id: `item-${Date.now()}`,
            category: '',
            itemNumber: '',
            color: '',
            description: '',
            sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, xxxl: 0 },
            quantity: 0,
            unitPrice: 0,
            taxed: false,
            total: 0,
            mockups: []
          }
        ]
      };
      setItemGroups([...itemGroups, newGroup]);
    };

    // Calculate subtotal for all items
    const calculateSubtotal = () => {
      return itemGroups.reduce((total, group) => {
        return total + group.items.reduce((groupTotal, item) => {
          return groupTotal + item.total;
        }, 0);
      }, 0);
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getCurrentItemGroups: () => itemGroups,
    }));

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Quote Items</h3>
        </div>

        {/* Quote Items Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
                <TableHead className="font-medium text-gray-900">CATEGORY</TableHead>
                <TableHead className="font-medium text-gray-900">ITEM#</TableHead>
                <TableHead className="font-medium text-gray-900">COLOR</TableHead>
                <TableHead className="font-medium text-gray-900">DESCRIPTION</TableHead>
                <TableHead className="font-medium text-gray-900 text-center">XS</TableHead>
                <TableHead className="font-medium text-gray-900 text-center">S</TableHead>
                <TableHead className="font-medium text-gray-900 text-center">M</TableHead>
                <TableHead className="font-medium text-gray-900 text-center">L</TableHead>
                <TableHead className="font-medium text-gray-900 text-center">XL</TableHead>
                <TableHead className="font-medium text-gray-900 text-center">2XL</TableHead>
                <TableHead className="font-medium text-gray-900 text-center">3XL</TableHead>
                <TableHead className="font-medium text-gray-900">PRICE</TableHead>
                <TableHead className="font-medium text-gray-900 text-center">TAXED</TableHead>
                <TableHead className="font-medium text-gray-900">TOTAL</TableHead>
                <TableHead className="font-medium text-gray-900"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {itemGroups.map((group) =>
                group.items.map((item) => (
                  <TableRow key={item.id} className="border-b">
                    {/* Category */}
                    <TableCell>
                      <Select 
                        value={item.category} 
                        onValueChange={(value) => updateItem(group.id, item.id, { category: value })}
                      >
                        <SelectTrigger className="w-full border-0 shadow-none">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRODUCT_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Item Number */}
                    <TableCell>
                      <Input 
                        value={item.itemNumber}
                        onChange={(e) => updateItem(group.id, item.id, { itemNumber: e.target.value })}
                        placeholder="Item #"
                        className="w-full border-0 shadow-none"
                      />
                    </TableCell>

                    {/* Color */}
                    <TableCell>
                      <Input 
                        value={item.color}
                        onChange={(e) => updateItem(group.id, item.id, { color: e.target.value })}
                        placeholder="Color"
                        className="w-full border-0 shadow-none"
                      />
                    </TableCell>

                    {/* Description */}
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(group.id, item.id, { description: e.target.value })}
                        placeholder="Description"
                        className="w-full border-0 shadow-none"
                      />
                    </TableCell>

                    {/* Size Quantities */}
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.sizes.xs}
                        onChange={(e) => updateSizeQuantity(group.id, item.id, 'xs', parseInt(e.target.value) || 0)}
                        className="w-16 text-center border-0 shadow-none"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.sizes.s}
                        onChange={(e) => updateSizeQuantity(group.id, item.id, 's', parseInt(e.target.value) || 0)}
                        className="w-16 text-center border-0 shadow-none"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.sizes.m}
                        onChange={(e) => updateSizeQuantity(group.id, item.id, 'm', parseInt(e.target.value) || 0)}
                        className="w-16 text-center border-0 shadow-none"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.sizes.l}
                        onChange={(e) => updateSizeQuantity(group.id, item.id, 'l', parseInt(e.target.value) || 0)}
                        className="w-16 text-center border-0 shadow-none"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.sizes.xl}
                        onChange={(e) => updateSizeQuantity(group.id, item.id, 'xl', parseInt(e.target.value) || 0)}
                        className="w-16 text-center border-0 shadow-none"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.sizes.xxl}
                        onChange={(e) => updateSizeQuantity(group.id, item.id, 'xxl', parseInt(e.target.value) || 0)}
                        className="w-16 text-center border-0 shadow-none"
                        min="0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={item.sizes.xxxl}
                        onChange={(e) => updateSizeQuantity(group.id, item.id, 'xxxl', parseInt(e.target.value) || 0)}
                        className="w-16 text-center border-0 shadow-none"
                        min="0"
                      />
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input 
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(group.id, item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                          className="w-20 pl-6 border-0 shadow-none"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </TableCell>

                    {/* Taxed */}
                    <TableCell className="text-center">
                        <Checkbox
                          checked={item.taxed}
                        onCheckedChange={(checked) => updateItem(group.id, item.id, { taxed: checked as boolean })}
                        className="mx-auto"
                        />
                    </TableCell>

                    {/* Total */}
                    <TableCell className="font-medium">
                      ${item.total.toFixed(2)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => addImprint(group.id, item.id)}>
                            <Image className="mr-2 h-4 w-4" />
                              Attach Mockups
                            </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateItem(group.id, item.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteItem(group.id, item.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Imprint Section - Right underneath the table */}
        {(() => {
          const hasMockups = itemGroups.some(group => 
            group.items.some(item => item.mockups.length > 0)
          );
          
          return hasMockups ? (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-sm text-gray-700">IMPRINT 1</h4>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {itemGroups.map((group) =>
                  group.items.map((item) =>
                    item.mockups.map((mockup) => (
                      <div key={mockup.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                        <div className="aspect-square bg-white rounded border overflow-hidden mb-2">
                          {mockup.type.startsWith('image/') ? (
                              <img 
                                src={mockup.url} 
                                alt={mockup.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Image className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 truncate" title={mockup.name}>
                          {mockup.name}
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          ) : null;
        })()}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <div className="flex gap-2">
            <Button onClick={() => addLineItem(itemGroups[0]?.id || '')} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Line Item
            </Button>
            <Button onClick={() => addImprint(itemGroups[0]?.id || '', getFirstItemId(itemGroups[0]?.id || ''))} variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Imprint
            </Button>
                            </div>
          <Button onClick={addLineItemGroup} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Line Item Group
          </Button>
                            </div>

        {/* Invoice Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-center font-medium text-blue-800 mb-4">Invoice Summary</div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sub Total:</span>
              <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                              </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>$0.00</span>
                              </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <div className="flex gap-2">
                <Input type="number" placeholder="%" className="w-16" />
                <Input type="number" placeholder="$" className="w-20" />
                          </div>
            </div>
            <div className="flex justify-between">
              <span>Sales Tax:</span>
              <Input type="number" placeholder="%" className="w-16" />
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total Due:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {itemGroups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No items added yet.</p>
            <Button onClick={addLineItemGroup} className="mt-4 gap-2">
              <Plus className="h-4 w-4" />
              Add First Item
            </Button>
                            </div>
                          )}
                          
        {/* Imprint Upload Dialog */}
        <Dialog open={imprintDialogOpen} onOpenChange={setImprintDialogOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Imprint
              </DialogTitle>
              <div className="flex items-center gap-2 ml-auto">
                <Button variant="outline" size="sm" className="gap-2">
                  <Image className="h-4 w-4" />
                  Select from Library
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleImprintDialogClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
                                  </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Imprint Details Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">Imprint 1</h4>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                              </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Method */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Method <span className="text-red-500">*</span>
                    </label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Imprint Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="embroidery">Embroidery</SelectItem>
                        <SelectItem value="screen-print">Screen Print</SelectItem>
                        <SelectItem value="heat-transfer">Heat Transfer</SelectItem>
                        <SelectItem value="vinyl">Vinyl</SelectItem>
                        <SelectItem value="direct-to-garment">Direct to Garment</SelectItem>
                      </SelectContent>
                    </Select>
                            </div>
                  
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      placeholder="e.g., Front chest, Back, Left sleeve" 
                      className="w-full"
                    />
                                  </div>
                              </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Width */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Width (in) <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number" 
                      placeholder="0.0" 
                      step="0.1" 
                      min="0"
                      className="w-full"
                    />
                            </div>
                  
                  {/* Height */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Height (in) <span className="text-red-500">*</span>
                    </label>
                    <Input 
                      type="number" 
                      placeholder="0.0" 
                      step="0.1" 
                      min="0"
                      className="w-full"
                    />
                                      </div>
                                  </div>
                
                {/* Colors or Threads */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Colors or Threads
                  </label>
                  <Input 
                    placeholder="e.g., Black, White, Navy Blue | Thread colors: 5563, 5606" 
                    className="w-full"
                  />
                              </div>
                
                {/* Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea 
                    placeholder="Additional details, special instructions..." 
                    className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                            </div>
                        </div>
              
              {/* Artwork Upload Sections */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Artwork Upload</h4>
                
                {/* Upload 1: Customer Provided Art */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Upload 1: Customer Provided Art
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
                    </Button>
                    </div>
                  </div>
                
                {/* Upload 2: Production-Ready Files */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Upload 2: Production-Ready Files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <Button variant="outline" size="sm" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Upload
          </Button>
                  </div>
                </div>
                
                {/* Optional: Proof/Mockup */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Optional: Proof/Mockup
                  </label>
                  <p className="text-xs text-gray-500">Visual proof, mockup, or reference images</p>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Image className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <input
                      id="proof-mockup-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf,.gif"
                      onChange={handleProofMockupUpload}
                      className="hidden"
                    />
          <Button 
            variant="outline" 
                      size="sm" 
            className="gap-2"
                      onClick={() => document.getElementById('proof-mockup-upload')?.click()}
          >
                      <Image className="h-4 w-4" />
                      Upload
          </Button>
                    {proofMockupFile && (
                      <div className="mt-2 text-sm text-green-600">
                        ✓ {proofMockupFile.name}
        </div>
                    )}
      </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={handleImprintDialogClose} className="gap-2">
          <Plus className="h-4 w-4" />
                Add New Imprint
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleImprintDialogClose}>
                  Discard
                </Button>
                <Button 
                  onClick={() => {
                    console.log('🔍 [DEBUG] QuoteItemsSection - Save Imprint button clicked!');
                    console.log('🔍 [DEBUG] QuoteItemsSection - About to call handleImprintSave');
                    handleImprintSave();
                  }} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Imprint
        </Button>
      </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
  }
);

QuoteItemsSection.displayName = "QuoteItemsSection";