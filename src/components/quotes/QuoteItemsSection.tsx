import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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

interface ItemGroup {
  id: string;
  items: Item[];
  imprints?: any[];
}

interface QuoteItemsSectionProps {
  quoteData?: any;
}

export interface QuoteItemsSectionRef {
  getCurrentItemGroups: () => ItemGroup[];
}

export const QuoteItemsSection = forwardRef<QuoteItemsSectionRef, QuoteItemsSectionProps>(
  ({ quoteData }, ref) => {
    // Simple default item group structure
    const [itemGroups, setItemGroups] = useState<ItemGroup[]>([
      {
        id: 'group-1',
        items: [
          {
            category: 'T-Shirts',
            itemNumber: '001',
            color: 'Black',
            description: 'Cotton T-Shirt',
            sizes: { xs: 0, s: 5, m: 10, l: 8, xl: 3, xxl: 1, xxxl: 0 },
            quantity: 27,
            price: 15.00,
            taxed: true,
            total: 405.00,
            mockups: []
          }
        ]
      }
    ]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    getCurrentItemGroups: () => itemGroups,
  }));

    const addNewGroup = () => {
      const newGroup: ItemGroup = {
        id: `group-${Date.now()}`,
      items: [
        {
            category: '',
            itemNumber: '',
            color: '',
            description: '',
            sizes: { xs: 0, s: 0, m: 0, l: 0, xl: 0, xxl: 0, xxxl: 0 },
          quantity: 0,
          price: 0,
          taxed: false,
          total: 0,
          mockups: []
        }
        ]
      };
      setItemGroups([...itemGroups, newGroup]);
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Quote Items</h3>
          <Button onClick={addNewGroup} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item Group
          </Button>
                      </div>

        {itemGroups.map((group, groupIndex) => (
          <div key={group.id} className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium">Item Group {groupIndex + 1}</h4>
            
            {group.items.map((item, itemIndex) => (
              <div key={itemIndex} className="grid grid-cols-6 gap-4 p-4 border rounded">
                            <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <div className="text-sm">{item.category || 'T-Shirts'}</div>
                            </div>
                
                            <div>
                  <label className="block text-sm font-medium mb-1">Item #</label>
                  <div className="text-sm">{item.itemNumber || '001'}</div>
                            </div>
                
                              <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <div className="text-sm">{item.color || 'Black'}</div>
                              </div>
                
                              <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <div className="text-sm">{item.description || 'Cotton T-Shirt'}</div>
                            </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <div className="text-sm">{item.quantity || 27}</div>
                            </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Total</label>
                  <div className="text-sm font-medium">${(item.total || 405).toFixed(2)}</div>
                              </div>
                                  </div>
                                ))}
                        </div>
                      ))}

        {itemGroups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No items added yet.</p>
            <Button onClick={addNewGroup} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
              Add First Item
          </Button>
        </div>
        )}
      </div>
    );
  }
);

QuoteItemsSection.displayName = "QuoteItemsSection";