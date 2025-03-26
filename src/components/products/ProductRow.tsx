import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ExternalLink, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

type Supplier = {
  name: string;
  price: number;
  inventory: number;
};

type Product = {
  id: number;
  sku: string;
  name: string;
  category: string;
  suppliers: Supplier[];
  lowestPrice: number;
  image?: string;
  colors?: string[];
};

interface ProductRowProps {
  product: Product;
  showVendors: boolean;
  showPrices: boolean;
}

export function ProductRow({ product, showVendors, showPrices }: ProductRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [expandedColor, setExpandedColor] = useState<string | null>(null);
  const [showAllColors, setShowAllColors] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, Record<string, number>>>({});
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
  const locations = ['DALLAS, TX', 'MEMPHIS, TN', 'GILDAN DISTRIBUTION CENTER'];
  
  // Select first color as default expanded color
  React.useEffect(() => {
    if (product.colors && product.colors.length > 0 && !expandedColor) {
      setExpandedColor(product.colors[0]);
    }
  }, [product.colors, expandedColor]);
  
  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setExpanded(true);
  };

  const toggleShowAllColors = () => {
    setShowAllColors(!showAllColors);
  };
  
  const handleQuantityChange = (location: string, size: string, value: string) => {
    const numValue = value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);
    
    setQuantities(prev => ({
      ...prev,
      [location]: {
        ...(prev[location] || {}),
        [size]: numValue
      }
    }));
  };
  
  const getTotalQuantity = () => {
    let total = 0;
    Object.values(quantities).forEach(locationQuantities => {
      Object.values(locationQuantities).forEach(qty => {
        total += qty;
      });
    });
    return total;
  };
  
  const handleAddToCart = () => {
    const total = getTotalQuantity();
    if (total === 0) {
      toast.error("Please select at least one item to add to cart");
      return;
    }
    
    toast.success(`Added ${total} items to cart`);
    // Reset quantities after adding to cart
    setQuantities({});
  };
  
  return (
    <Card className="overflow-hidden mb-4">
      <CardContent className="p-0">
        {/* Basic Product Row */}
        <div className="flex border-b">
          {/* Product Image & Basic Info - Now 50% width */}
          <div className="flex p-4 gap-4 w-1/2">
            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            
            <div className="flex flex-col flex-grow min-w-0">
              <div className="text-sm text-black mb-1 truncate">
                <span className="font-semibold">{product.sku}</span> • {product.category}
              </div>
              <div className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</div>
              
              {product.colors && (
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-xs text-gray-500 mr-1 mt-1">Color:</span>
                  {product.colors.slice(0, showAllColors ? product.colors.length : 5).map((color, index) => (
                    <div
                      key={index}
                      className={`w-5 h-5 rounded-full cursor-pointer border ${expandedColor === color ? 'ring-2 ring-blue-500' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setExpandedColor(color)}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <div 
                      className="text-xs text-blue-600 mt-1 cursor-pointer hover:underline"
                      onClick={toggleShowAllColors}
                    >
                      {showAllColors ? "Show fewer" : `+${product.colors.length - 5} more colors`}
                    </div>
                  )}
                </div>
              )}
              
              {showPrices && (
                <div className="text-green-600 font-semibold text-sm">
                  ${product.lowestPrice.toFixed(2)}
                </div>
              )}
            </div>
          </div>
          
          {/* Supplier Pricing Table - Now 50% width */}
          {showVendors && (
            <div className="flex-1 flex items-stretch divide-x border-l w-1/2">
              {product.suppliers.slice(0, 4).map((supplier, index) => (
                <div 
                  key={index} 
                  className="flex-1 flex flex-col items-center justify-center p-3 relative min-w-0 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSupplierClick(supplier)}
                >
                  <div className="text-xs font-medium mb-1 text-blue-600 truncate w-full text-center">{supplier.name}</div>
                  {showPrices && (
                    <div className="text-base font-semibold mb-1">
                      ${supplier.price.toFixed(2)}
                      {supplier.price === product.lowestPrice && (
                        <span className="absolute top-1 right-1">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-[10px] px-1">Best</Badge>
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-1 mt-1">
                    <div className={`w-2 h-2 rounded-full ${supplier.inventory > 500 ? 'bg-green-500' : supplier.inventory > 100 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] text-gray-500">{supplier.inventory}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Expanded Inventory Section */}
        {expanded && selectedSupplier && (
          <div className="bg-gray-50">
            {/* Supplier Header - Updated to show selected supplier */}
            <div className="px-4 py-3 flex items-center gap-6 border-b bg-white">
              <div className="text-sm font-medium flex-1">
                {selectedSupplier.name}'s Inventory & Pricing
              </div>
              
              <div className="ml-auto">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={() => setExpanded(false)}
                >
                  Close <ChevronUp className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            
            {/* Sizes and Pricing Grid - Redesigned */}
            <div className="p-4">
              <div className="grid grid-cols-8 gap-2 text-center mb-4">
                <div className="font-medium text-sm"></div>
                {sizes.map(size => (
                  <div key={size} className="font-medium text-sm">{size}</div>
                ))}
              </div>
              
              {/* Price row - Using selected supplier price */}
              <div className="grid grid-cols-8 gap-2 text-center mb-4">
                <div className="text-sm text-left font-medium">Price</div>
                {sizes.map((size) => (
                  <div key={size} className="text-sm font-medium">
                    ${selectedSupplier.price.toFixed(2)}
                  </div>
                ))}
              </div>
              
              {/* Location inventory grid - improved display without input field styling */}
              {locations.map((location, locationIndex) => (
                <div key={location} className="mt-4">
                  <div className="grid grid-cols-8 gap-2 text-center items-center mb-2">
                    <div className="text-xs text-left font-medium">
                      {location}
                      {locationIndex < 2 && <div className="text-[10px] text-gray-500">Cutoff 4:00 CT</div>}
                    </div>
                    
                    {sizes.map((size, sizeIndex) => {
                      // Adjust inventory to reflect selected supplier
                      // Using supplier inventory as baseline and adjusting by location and size
                      const baseInventory = selectedSupplier.inventory;
                      
                      const inventory = 
                        locationIndex === 0 ? Math.floor(baseInventory * 0.2 * (1 - (sizeIndex * 0.1))) :
                        locationIndex === 1 ? Math.floor(baseInventory * 0.15 * (1 - (sizeIndex * 0.05))) :
                        locationIndex === 2 && (sizeIndex === 1 || sizeIndex === 2 || sizeIndex === 6) ? 
                          Math.floor(baseInventory * 0.65 * (1 + (sizeIndex * 0.1))) : 0;
                      
                      return (
                        <div key={`${location}-${size}`} className="relative flex flex-col items-center">
                          {/* Inventory count shown as plain text rather than input-styled */}
                          <div className="text-xs mb-1 font-medium">
                            {inventory > 0 ? inventory : '-'}
                          </div>
                          
                          {/* Only show quantity selector when inventory > 0 */}
                          {inventory > 0 && (
                            <div className="flex items-center gap-1 w-full">
                              <Input
                                type="number"
                                min="0"
                                max={inventory}
                                value={quantities[location]?.[size] || ''}
                                onChange={(e) => handleQuantityChange(location, size, e.target.value)}
                                className="h-8 w-full text-xs text-center"
                                placeholder="Qty"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {locationIndex < 2 && (
                    <div className="ml-auto text-right">
                      <Badge variant="outline" className="bg-green-100 text-green-800 text-xs">
                        Est. delivery {locationIndex === 0 ? '02/10' : '02/10'}
                      </Badge>
                    </div>
                  )}
                  
                  {locationIndex === 2 && (
                    <div className="ml-auto text-right">
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 text-xs">
                        Call For Pricing
                      </Badge>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 text-xs ml-2">
                        Est. delivery 3-7 Days
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add to cart button with total quantity */}
              <div className="mt-6 text-right flex justify-end items-center gap-4">
                {getTotalQuantity() > 0 && (
                  <div className="text-sm font-medium">
                    Total Quantity: <span className="text-green-600">{getTotalQuantity()}</span>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="bg-green-100 text-green-800 hover:bg-green-200"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
