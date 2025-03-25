
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronDown } from 'lucide-react';

interface ProductFiltersProps {
  showVendors: boolean;
  setShowVendors: (show: boolean) => void;
  showPrices: boolean;
  setShowPrices: (show: boolean) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
}

export function ProductFilters({ 
  showVendors, 
  setShowVendors,
  showPrices,
  setShowPrices,
  categoryFilter,
  setCategoryFilter
}: ProductFiltersProps) {
  // Mock data for filters
  const brands = [
    { name: 'Gildan', count: 352 },
    { name: 'Next Level', count: 287 },
    { name: 'Bella+Canvas', count: 263 },
    { name: 'American Apparel', count: 189 },
    { name: 'Port & Company', count: 167 },
    { name: 'Hanes', count: 142 },
    { name: 'Fruit of the Loom', count: 126 },
  ];
  
  const categories = [
    { name: 'T-Shirts', count: 1538 },
    { name: 'Sweatshirts & Hoodies', count: 578 },
    { name: 'Polos', count: 312 },
    { name: 'Hats & Caps', count: 258 },
    { name: 'Jackets', count: 196 },
    { name: 'Workwear', count: 184 },
  ];
  
  return (
    <div className="w-64 border-r p-4 overflow-y-auto bg-white flex-shrink-0">
      <div className="space-y-4">
        {/* View Options Checkboxes */}
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 mb-2">View Options</h3>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="hide-prices" 
              checked={showPrices} 
              onCheckedChange={setShowPrices} 
            />
            <Label htmlFor="hide-prices">Show Prices</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-vendors" 
              checked={showVendors} 
              onCheckedChange={setShowVendors} 
            />
            <Label htmlFor="show-vendors">Show Vendors</Label>
          </div>
        </div>
        
        {/* Brands Filter */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Brands</h3>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
          <div className="mt-2">
            <Input 
              placeholder="Search brands..." 
              className="mb-2"
            />
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              {brands.map((brand) => (
                <div key={brand.name} className="flex items-center justify-between text-sm hover:bg-gray-50 p-1 rounded">
                  <span>{brand.name}</span>
                  <span className="text-gray-500 text-xs">({brand.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Categories Filter */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-700">Categories</h3>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
          <div className="mt-2 space-y-1 max-h-40 overflow-y-auto pr-1">
            <div 
              className={`flex items-center justify-between text-sm p-1 rounded cursor-pointer ${categoryFilter === 'All' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}
              onClick={() => setCategoryFilter('All')}
            >
              <span>All Products</span>
            </div>
            {categories.map((category) => (
              <div 
                key={category.name} 
                className={`flex items-center justify-between text-sm p-1 rounded cursor-pointer ${categoryFilter === category.name ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}
                onClick={() => setCategoryFilter(category.name)}
              >
                <span>{category.name}</span>
                <span className="text-gray-500 text-xs">({category.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
