import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Save, X, Trash2 } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { useCartManager } from '@/context/CartManagerContext';
import { toast } from 'sonner';

interface EditableCartItemProps {
  cartId: string;
  item: CartItem;
}

export function EditableCartItem({ cartId, item }: EditableCartItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuantities, setEditQuantities] = useState(item.quantities);
  const { updateCart, removeFromCart } = useCartManager();

  const handleSave = () => {
    const newTotalQuantity = editQuantities.reduce((sum, q) => sum + q.quantity, 0);
    
    if (newTotalQuantity === 0) {
      removeFromCart(cartId, item.id);
      toast.success('Item removed from cart');
      return;
    }

    // Update the cart with new quantities
    updateCart(cartId, (prevCart) => ({
      ...prevCart,
      items: prevCart.items.map(cartItem => 
        cartItem.id === item.id && cartItem.supplierName === item.supplierName
          ? { ...cartItem, quantities: editQuantities, totalQuantity: newTotalQuantity }
          : cartItem
      )
    }));
    
    setIsEditing(false);
    toast.success('Item quantities updated');
  };

  const handleCancel = () => {
    setEditQuantities(item.quantities);
    setIsEditing(false);
  };

  const updateQuantity = (locationIndex: number, newQuantity: number) => {
    const updated = [...editQuantities];
    updated[locationIndex] = { ...updated[locationIndex], quantity: Math.max(0, newQuantity) };
    setEditQuantities(updated);
  };

  const removeQuantityLocation = (locationIndex: number) => {
    setEditQuantities(prev => prev.filter((_, index) => index !== locationIndex));
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3">
          {/* Product Image */}
          <div className="w-16 h-16 rounded border bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
            {item.image ? (
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.sku}</p>
                <Badge variant="outline" className="text-xs mt-1">{item.supplierName}</Badge>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${(item.price * item.totalQuantity).toFixed(2)}</p>
                <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
              </div>
            </div>

            {/* Quantity Breakdown */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600">Quantities by Location & Size:</div>
              
              {isEditing ? (
                <div className="space-y-2">
                  {editQuantities.map((qty, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <span className="w-20 text-gray-600">{qty.location}:</span>
                      <span className="w-12">{qty.size}</span>
                      <Input
                        type="number"
                        min="0"
                        value={qty.quantity}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 0)}
                        className="w-16 h-6 text-xs"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeQuantityLocation(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {item.quantities.map((qty, index) => (
                    <div key={index} className="text-gray-600">
                      {qty.location} - {qty.size}: {qty.quantity}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-xs font-medium text-gray-800">
                Total: {isEditing ? editQuantities.reduce((sum, q) => sum + q.quantity, 0) : item.totalQuantity} pieces
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-3">
              {isEditing ? (
                <>
                  <Button size="sm" variant="outline" onClick={handleCancel}>
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => removeFromCart(cartId, item.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Remove
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}