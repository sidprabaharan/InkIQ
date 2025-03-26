
import React from 'react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X, RefreshCw } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function CartSidebar() {
  const { cartItems, removeFromCart, totalItems, subtotal, clearCart } = useCart();
  const [poNumber, setPoNumber] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const navigate = useNavigate();
  
  // Group cart items by supplier
  const itemsBySupplier = React.useMemo(() => {
    const grouped: Record<string, typeof cartItems> = {};
    
    cartItems.forEach(item => {
      if (!grouped[item.supplierName]) {
        grouped[item.supplierName] = [];
      }
      grouped[item.supplierName].push(item);
    });
    
    return grouped;
  }, [cartItems]);
  
  const handleCheckout = () => {
    if (!poNumber.trim()) {
      toast.error("Please enter a PO Number");
      return;
    }
    
    setIsCheckingOut(true);
    
    // Create a purchase order
    const newPurchaseOrder = {
      id: `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      supplier: Object.keys(itemsBySupplier)[0], // Just use the first supplier for simplicity
      dateCreated: new Date().toISOString().split('T')[0],
      status: "Pending",
      total: subtotal,
      poNumber,
      notes,
      items: cartItems.map(item => ({
        id: Math.floor(Math.random() * 10000),
        name: item.name,
        sku: item.sku,
        quantity: item.totalQuantity,
        price: item.price,
        total: item.price * item.totalQuantity
      }))
    };
    
    // In a real app, we'd send this to an API
    // For now, we'll just simulate saving it and redirect
    setTimeout(() => {
      toast.success("Order placed successfully!");
      clearCart();
      setIsCheckingOut(false);
      navigate('/purchase-orders');
    }, 1500);
  };
  
  if (totalItems === 0 && !isCheckingOut) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">Open cart</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
            <Button variant="outline" className="mt-4">Continue Shopping</Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 px-1 min-w-5 h-5 flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        
        {isCheckingOut ? (
          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="po-number">PO Number *</Label>
              <Input 
                id="po-number" 
                value={poNumber} 
                onChange={(e) => setPoNumber(e.target.value)} 
                placeholder="Enter your purchase order number"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea 
                id="notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Any special requirements for this order?"
                className="min-h-[100px]"
              />
            </div>
            
            <Separator />
            
            <div className="flex justify-between font-medium">
              <span>Total Items:</span>
              <span>{totalItems}</span>
            </div>
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="pt-4 space-y-2">
              <Button 
                className="w-full" 
                onClick={handleCheckout}
              >
                Place Order
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsCheckingOut(false)}
              >
                Back to Cart
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mt-4 mb-2">
              <div className="text-sm text-gray-500">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in cart
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
            
            <div className="space-y-6 my-4 max-h-[60vh] overflow-auto pr-2">
              {Object.entries(itemsBySupplier).map(([supplier, items]) => (
                <div key={supplier} className="space-y-2">
                  <h3 className="font-medium text-sm text-gray-700">{supplier}</h3>
                  
                  {items.map((item) => (
                    <div key={`${item.id}-${item.supplierName}`} className="flex gap-3 py-2">
                      <div className="w-12 h-12 rounded border bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium line-clamp-1">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.sku}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.totalQuantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                        <div className="mt-auto text-sm font-medium">
                          ${(item.price * item.totalQuantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            <div className="space-y-4 mt-6 pt-6 border-t">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => setIsCheckingOut(true)}
                disabled={totalItems === 0}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
