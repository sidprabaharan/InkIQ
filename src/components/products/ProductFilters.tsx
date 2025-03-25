
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [showBrands, setShowBrands] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
  const [brandSearch, setBrandSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  
  // Mock data for filters
  const brands = [
    { name: 'Gildan', count: 352 },
    { name: 'Next Level', count: 287 },
    { name: 'Bella+Canvas', count: 263 },
    { name: 'American Apparel', count: 189 },
    { name: 'Port & Company', count: 167 },
    { name: 'Hanes', count: 142 },
    { name: 'Fruit of the Loom', count: 126 },
    { name: 'Augusta Sportswear', count: 98 },
    { name: 'Holloway', count: 82 },
    { name: 'AS Colour', count: 74 },
    { name: 'Champion', count: 69 },
    { name: 'Red Kap', count: 65 },
    { name: 'Badger', count: 59 },
    { name: 'Dickies', count: 54 },
    { name: 'DRI DUCK', count: 49 },
    { name: 'Bulwark', count: 47 },
    { name: 'J. America', count: 42 },
  ];
  
  const categories = [
    { name: 'T-Shirts', count: 1538 },
    { name: 'Sweatshirts & Hoodies', count: 578 },
    { name: 'Sports & Athletic', count: 492 },
    { name: 'Polos', count: 312 },
    { name: 'Hats & Caps', count: 258 },
    { name: 'Jackets', count: 196 },
    { name: 'Workwear', count: 184 },
    { name: 'Fleece', count: 148 },
    { name: 'Headwear', count: 137 },
    { name: 'Outerwear', count: 124 },
    { name: 'Activewear', count: 119 },
  ];

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  );
  
  return (
    <div className="w-64 border-r p-0 overflow-hidden bg-white flex-shrink-0 flex flex-col h-full">
      <div className="flex flex-col h-full">
        {/* View Options Checkboxes */}
        <div className="border-b p-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hide-prices" 
                checked={!showPrices} 
                onCheckedChange={(checked) => setShowPrices(!checked)} 
              />
              <Label htmlFor="hide-prices" className="text-sm text-gray-700">Hide Prices</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-vendors" 
                checked={showVendors} 
                onCheckedChange={setShowVendors} 
              />
              <Label htmlFor="show-vendors" className="text-sm text-gray-700">Show Only Synced Vendors</Label>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {/* Brands Filter */}
          <div className="border-b">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setShowBrands(!showBrands)}
            >
              <h3 className="font-medium text-gray-700">Brands</h3>
              {showBrands ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
            
            {showBrands && (
              <div className="px-4 pb-4">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search brands..." 
                    className="pl-8 text-sm h-8"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                  />
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {filteredBrands.map((brand) => (
                    <div key={brand.name} className="flex items-center justify-between text-sm hover:bg-gray-50 p-1 rounded cursor-pointer">
                      <span>{brand.name}</span>
                      <span className="text-gray-500 text-xs">({brand.count})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Categories Filter */}
          <div className="border-b">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setShowCategories(!showCategories)}
            >
              <h3 className="font-medium text-gray-700">Categories</h3>
              {showCategories ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
            </div>
            
            {showCategories && (
              <div className="px-4 pb-4">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search categories..." 
                    className="pl-8 text-sm h-8"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                  />
                </div>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  <div 
                    className={`flex items-center justify-between text-sm p-1 rounded cursor-pointer ${categoryFilter === 'All' ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-gray-50'}`}
                    onClick={() => setCategoryFilter('All')}
                  >
                    <span>All Products</span>
                  </div>
                  {filteredCategories.map((category) => (
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
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
