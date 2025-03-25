
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, ShoppingCart, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex border-b">
          {/* Product Image & Basic Info */}
          <div className="flex p-4 gap-4 min-w-[400px]">
            <div className="w-24 h-24 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <div className="font-semibold text-gray-700">{product.sku} - {product.name}</div>
              <div className="text-sm text-gray-500 mb-2">
                Category: {product.category}
              </div>
              
              {product.colors && (
                <div className="flex gap-1 mb-2">
                  <span className="text-xs text-gray-500 mt-1">Colors:</span>
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-5 h-5 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  {product.colors.length > 3 && (
                    <Button variant="ghost" size="sm" className="h-5 px-1 text-xs">
                      More colors...
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Supplier Pricing Table */}
          {showVendors && (
            <div className="flex-1 flex items-stretch divide-x border-l">
              {product.suppliers.slice(0, 4).map((supplier, index) => (
                <div key={index} className="flex-1 flex flex-col items-center justify-center p-3 relative min-w-[120px]">
                  <div className="text-xs font-medium mb-1">{supplier.name}</div>
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
                  <Button size="sm" variant="outline" className="mt-2 text-xs h-7 px-2">
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex flex-col items-center justify-center px-4 border-l">
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
              <Eye className="h-4 w-4 mr-1" />
              See Inventory
            </Button>
          </div>
        </div>
        
        {/* Expanded Info - Can add more product details, inventory by size, etc. */}
        {expanded && (
          <div className="p-4 bg-gray-50">
            <h4 className="font-medium mb-2">Inventory Details</h4>
            <div className="grid grid-cols-6 gap-2 text-sm">
              <div className="bg-white p-2 rounded border">
                <div className="font-medium">S</div>
                <div className="text-gray-600">{Math.floor(Math.random() * 500)}</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-medium">M</div>
                <div className="text-gray-600">{Math.floor(Math.random() * 500)}</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-medium">L</div>
                <div className="text-gray-600">{Math.floor(Math.random() * 500)}</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-medium">XL</div>
                <div className="text-gray-600">{Math.floor(Math.random() * 500)}</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-medium">2XL</div>
                <div className="text-gray-600">{Math.floor(Math.random() * 500)}</div>
              </div>
              <div className="bg-white p-2 rounded border">
                <div className="font-medium">3XL</div>
                <div className="text-gray-600">{Math.floor(Math.random() * 500)}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
