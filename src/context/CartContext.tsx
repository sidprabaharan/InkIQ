
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

type Supplier = {
  name: string;
  price: number;
  inventory: number;
};

export type CartItem = {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  supplierName: string;
  image?: string;
  quantities: {
    location: string;
    size: string;
    quantity: number;
  }[];
  totalQuantity: number;
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  
  // Calculate totals whenever cart changes
  useEffect(() => {
    const items = cartItems.reduce((acc, item) => acc + item.totalQuantity, 0);
    setTotalItems(items);
    
    const total = cartItems.reduce((acc, item) => {
      return acc + (item.price * item.totalQuantity);
    }, 0);
    setSubtotal(total);
  }, [cartItems]);
  
  const addToCart = (newItem: CartItem) => {
    setCartItems(prev => {
      // Check if item already exists
      const existingItemIndex = prev.findIndex(item => 
        item.id === newItem.id && item.supplierName === newItem.supplierName
      );
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prev];
        const existingItem = updatedItems[existingItemIndex];
        
        // Merge quantities from the same locations and sizes
        newItem.quantities.forEach(newQty => {
          const existingQtyIndex = existingItem.quantities.findIndex(
            q => q.location === newQty.location && q.size === newQty.size
          );
          
          if (existingQtyIndex >= 0) {
            existingItem.quantities[existingQtyIndex].quantity += newQty.quantity;
          } else {
            existingItem.quantities.push(newQty);
          }
        });
        
        // Update total quantity
        existingItem.totalQuantity = existingItem.quantities.reduce(
          (total, q) => total + q.quantity, 0
        );
        
        return updatedItems;
      } else {
        // Add new item
        return [...prev, newItem];
      }
    });
    
    toast.success(`Added ${newItem.totalQuantity} items to cart`);
  };
  
  const removeFromCart = (itemId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast.info("Item removed from cart");
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      totalItems,
      subtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
