import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusDropdown } from './StatusDropdown';
import { ProductMockupDisplay } from './ProductMockupDisplay';
import { ImprintDetailsSection } from './ImprintDetailsSection';
import { LineItemGroupData } from './OrderBreakdown';

interface LineItemGroupProps {
  group: LineItemGroupData;
  groupNumber: number;
}

export function LineItemGroup({ group, groupNumber }: LineItemGroupProps) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  
  return (
    <div className="space-y-4">
      {/* Group Header */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="px-3 py-1">
          Line Item Group {groupNumber}
        </Badge>
        <h3 className="font-semibold text-lg">{group.title}</h3>
      </div>

      <Card>
        <CardContent className="p-6">
          {/* Products Section */}
          <div className="space-y-6">
            {group.products.map((product, productIndex) => (
              <div key={product.id}>
                {productIndex > 0 && <Separator className="my-6" />}
                
                <div className="grid grid-cols-12 gap-6 items-start">
                  {/* Product Mockup */}
                  <div className="col-span-2">
                    <ProductMockupDisplay 
                      image={product.mockupImage}
                      productName={product.name}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="col-span-6">
                    <div className="space-y-2">
                      <h4 className="font-medium text-base">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                      
                      {/* Size Breakdown */}
                      <div className="space-y-1">
                        {Object.entries(product.sizes).map(([size, quantity]) => (
                          quantity > 0 && (
                            <div key={size} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{size}:</span>
                              <span>{quantity}</span>
                            </div>
                          )
                        ))}
                        <div className="flex justify-between text-sm font-medium pt-1 border-t">
                          <span>Total Quantity:</span>
                          <span>{product.totalQuantity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="col-span-2">
                    <div className="space-y-1 text-right">
                      <div className="text-sm text-muted-foreground">Unit Price</div>
                      <div className="font-medium">{formatPrice(product.unitPrice)}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="font-semibold text-lg">{formatPrice(product.totalPrice)}</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <StatusDropdown 
                      currentStatus={product.status}
                      onStatusChange={(newStatus) => {
                        // Handle status change
                        console.log(`Status changed for ${product.id}:`, newStatus);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Imprint Details Section */}
          <div className="mt-8">
            <Separator className="mb-6" />
            <ImprintDetailsSection imprintDetails={group.imprintDetails} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}