import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, Building2, Hash } from "lucide-react";
import { Cart } from "@/types/cart";

interface CartDetailsSheetProps {
  cart: Cart | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CartDetailsSheet: React.FC<CartDetailsSheetProps> = ({
  cart,
  open,
  onOpenChange,
}) => {
  if (!cart) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalAmount = cart.items.reduce((sum, item) => sum + (item.price * item.totalQuantity), 0);

  // Group items by supplier
  const itemsBySupplier = cart.items.reduce((acc, item) => {
    if (!acc[item.supplierName]) {
      acc[item.supplierName] = [];
    }
    acc[item.supplierName].push(item);
    return acc;
  }, {} as Record<string, typeof cart.items>);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {cart.name}
          </SheetTitle>
          <SheetDescription>
            Cart details and item breakdown
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Cart Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cart Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Created: {cart.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Updated: {cart.updatedAt.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(cart.status)}>
                  {cart.status.charAt(0).toUpperCase() + cart.status.slice(1)}
                </Badge>
                
                <Badge variant="outline">
                  {cart.orderingStrategy === 'combined' ? 'Combined Order' : 'Separate Orders'}
                </Badge>
                
                <Badge variant="outline">
                  {cart.automationLevel.charAt(0).toUpperCase() + cart.automationLevel.slice(1)}
                </Badge>

                {cart.metadata.priority && (
                  <Badge className={getPriorityColor(cart.metadata.priority)}>
                    {cart.metadata.priority.charAt(0).toUpperCase() + cart.metadata.priority.slice(1)} Priority
                  </Badge>
                )}
              </div>

              {cart.metadata.poNumber && (
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">PO Number: {cart.metadata.poNumber}</span>
                </div>
              )}

              {cart.metadata.estimatedShipDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Est. Ship Date: {cart.metadata.estimatedShipDate.toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Items:</span>
                  <span>{cart.items.reduce((sum, item) => sum + item.totalQuantity, 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items by Supplier */}
          {Object.entries(itemsBySupplier).map(([supplier, items]) => (
            <Card key={supplier}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {supplier}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id}>
                      {index > 0 && <Separator />}
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                            <p className="text-sm text-muted-foreground">Category: {item.category}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${item.price.toFixed(2)} each</div>
                            <div className="text-sm text-muted-foreground">
                              Total: ${(item.price * item.totalQuantity).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Breakdown */}
                        <div className="bg-muted/50 rounded-lg p-3">
                          <h5 className="font-medium text-sm mb-2">Quantity Breakdown:</h5>
                          <div className="grid grid-cols-1 gap-2">
                            {item.quantities.map((qty, qtyIndex) => (
                              <div key={qtyIndex} className="flex justify-between text-sm">
                                <span>{qty.location} - {qty.size}</span>
                                <span className="font-medium">{qty.quantity} units</span>
                              </div>
                            ))}
                          </div>
                          <Separator className="my-2" />
                          <div className="flex justify-between text-sm font-medium">
                            <span>Total Quantity:</span>
                            <span>{item.totalQuantity} units</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Notes */}
          {cart.metadata.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{cart.metadata.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};