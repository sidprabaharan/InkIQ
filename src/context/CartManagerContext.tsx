import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { Cart, CartItem, UserSettings } from '@/types/cart';

interface CartManagerContextType {
  carts: Cart[];
  activeCartId: string | null;
  activeCart: Cart | null;
  userSettings: UserSettings;
  
  // Cart management
  createCart: (name?: string, strategy?: 'separate' | 'combined') => string;
  deleteCart: (cartId: string) => void;
  updateCart: (cartId: string, updates: Partial<Cart>) => void;
  setActiveCart: (cartId: string) => void;
  duplicateCart: (cartId: string) => string;
  
  // Item management
  addToCart: (cartId: string, item: CartItem) => void;
  removeFromCart: (cartId: string, itemId: number) => void;
  clearCart: (cartId: string) => void;
  
  // Cart operations
  convertCartToPO: (cartId: string) => Promise<string>;
  saveCartTemplate: (cartId: string, templateName: string) => void;
  
  // Settings
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  
  // Totals
  getCartTotals: (cartId: string) => { totalItems: number; subtotal: number };
  getAllCartsTotals: () => { totalItems: number; subtotal: number };
}

const CartManagerContext = createContext<CartManagerContextType | undefined>(undefined);

export const CartManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [activeCartId, setActiveCartId] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    automationLevel: 'manual',
    defaultOrderingStrategy: 'separate',
    cartNamingPreference: 'manual',
    approvalRequired: true
  });
  
  // Load data from localStorage on mount
  useEffect(() => {
    const savedCarts = localStorage.getItem('cartManager_carts');
    const savedSettings = localStorage.getItem('cartManager_settings');
    const savedActiveCart = localStorage.getItem('cartManager_activeCart');
    
    if (savedCarts) {
      const parsedCarts = JSON.parse(savedCarts).map((cart: any) => ({
        ...cart,
        createdAt: new Date(cart.createdAt),
        updatedAt: new Date(cart.updatedAt)
      }));
      setCarts(parsedCarts);
    }
    
    if (savedSettings) {
      setUserSettings(JSON.parse(savedSettings));
    }
    
    if (savedActiveCart) {
      setActiveCartId(savedActiveCart);
    }
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('cartManager_carts', JSON.stringify(carts));
  }, [carts]);
  
  useEffect(() => {
    localStorage.setItem('cartManager_settings', JSON.stringify(userSettings));
  }, [userSettings]);
  
  useEffect(() => {
    if (activeCartId) {
      localStorage.setItem('cartManager_activeCart', activeCartId);
    }
  }, [activeCartId]);
  
  const generateCartName = (strategy?: 'separate' | 'combined'): string => {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const timeStr = date.toTimeString().slice(0, 5).replace(':', '');
    const cartCount = carts.length + 1;
    
    if (strategy === 'combined') {
      return `Combined-Cart-${dateStr}-${timeStr}`;
    }
    return `Cart-${cartCount.toString().padStart(3, '0')}-${dateStr}`;
  };
  
  const createCart = (name?: string, strategy?: 'separate' | 'combined'): string => {
    const cartId = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const cartName = name || generateCartName(strategy);
    
    const newCart: Cart = {
      id: cartId,
      name: cartName,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      orderingStrategy: strategy || userSettings.defaultOrderingStrategy,
      automationLevel: userSettings.automationLevel,
      items: [],
      metadata: {}
    };
    
    setCarts(prev => [...prev, newCart]);
    setActiveCartId(cartId);
    
    toast.success(`Created new cart: ${cartName}`);
    return cartId;
  };
  
  const deleteCart = (cartId: string) => {
    setCarts(prev => prev.filter(cart => cart.id !== cartId));
    if (activeCartId === cartId) {
      const remainingCarts = carts.filter(cart => cart.id !== cartId);
      setActiveCartId(remainingCarts.length > 0 ? remainingCarts[0].id : null);
    }
    toast.info("Cart deleted");
  };
  
  const updateCart = (cartId: string, updates: Partial<Cart>) => {
    setCarts(prev => prev.map(cart => 
      cart.id === cartId 
        ? { ...cart, ...updates, updatedAt: new Date() }
        : cart
    ));
  };
  
  const setActiveCart = (cartId: string) => {
    setActiveCartId(cartId);
  };
  
  const duplicateCart = (cartId: string): string => {
    const originalCart = carts.find(cart => cart.id === cartId);
    if (!originalCart) return '';
    
    const newCartId = createCart(`${originalCart.name} (Copy)`, originalCart.orderingStrategy);
    const newCart = { ...originalCart, id: newCartId, name: `${originalCart.name} (Copy)` };
    
    updateCart(newCartId, newCart);
    return newCartId;
  };
  
  const addToCart = (cartId: string, newItem: CartItem) => {
    setCarts(prev => prev.map(cart => {
      if (cart.id !== cartId) return cart;
      
      const existingItemIndex = cart.items.findIndex(item => 
        item.id === newItem.id && item.supplierName === newItem.supplierName
      );
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        updatedItems = [...cart.items];
        const existingItem = updatedItems[existingItemIndex];
        
        // Merge quantities
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
        
        existingItem.totalQuantity = existingItem.quantities.reduce(
          (total, q) => total + q.quantity, 0
        );
      } else {
        updatedItems = [...cart.items, newItem];
      }
      
      return {
        ...cart,
        items: updatedItems,
        updatedAt: new Date()
      };
    }));
    
    toast.success(`Added ${newItem.totalQuantity} items to cart`);
  };
  
  const removeFromCart = (cartId: string, itemId: number) => {
    setCarts(prev => prev.map(cart => 
      cart.id === cartId 
        ? { 
            ...cart, 
            items: cart.items.filter(item => item.id !== itemId),
            updatedAt: new Date()
          }
        : cart
    ));
    toast.info("Item removed from cart");
  };
  
  const clearCart = (cartId: string) => {
    setCarts(prev => prev.map(cart => 
      cart.id === cartId 
        ? { ...cart, items: [], updatedAt: new Date() }
        : cart
    ));
  };
  
  const convertCartToPO = async (cartId: string): Promise<string> => {
    const cart = carts.find(c => c.id === cartId);
    if (!cart) throw new Error('Cart not found');
    
    // Update cart status
    updateCart(cartId, { status: 'submitted' });
    
    // In a real app, this would call an API
    const poId = `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    
    toast.success(`Purchase Order ${poId} created successfully!`);
    return poId;
  };
  
  const saveCartTemplate = (cartId: string, templateName: string) => {
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return;
    
    // Save template to localStorage
    const templates = JSON.parse(localStorage.getItem('cartTemplates') || '[]');
    templates.push({
      id: `template_${Date.now()}`,
      name: templateName,
      items: cart.items,
      createdAt: new Date()
    });
    localStorage.setItem('cartTemplates', JSON.stringify(templates));
    
    toast.success(`Template "${templateName}" saved`);
  };
  
  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...settings }));
  };
  
  const getCartTotals = (cartId: string) => {
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return { totalItems: 0, subtotal: 0 };
    
    const totalItems = cart.items.reduce((acc, item) => acc + item.totalQuantity, 0);
    const subtotal = cart.items.reduce((acc, item) => acc + (item.price * item.totalQuantity), 0);
    
    return { totalItems, subtotal };
  };
  
  const getAllCartsTotals = () => {
    const totalItems = carts.reduce((acc, cart) => {
      return acc + cart.items.reduce((itemAcc, item) => itemAcc + item.totalQuantity, 0);
    }, 0);
    
    const subtotal = carts.reduce((acc, cart) => {
      return acc + cart.items.reduce((itemAcc, item) => itemAcc + (item.price * item.totalQuantity), 0);
    }, 0);
    
    return { totalItems, subtotal };
  };
  
  const activeCart = activeCartId ? carts.find(cart => cart.id === activeCartId) || null : null;
  
  return (
    <CartManagerContext.Provider value={{
      carts,
      activeCartId,
      activeCart,
      userSettings,
      createCart,
      deleteCart,
      updateCart,
      setActiveCart,
      duplicateCart,
      addToCart,
      removeFromCart,
      clearCart,
      convertCartToPO,
      saveCartTemplate,
      updateUserSettings,
      getCartTotals,
      getAllCartsTotals
    }}>
      {children}
    </CartManagerContext.Provider>
  );
};

export const useCartManager = () => {
  const context = useContext(CartManagerContext);
  if (context === undefined) {
    throw new Error('useCartManager must be used within a CartManagerProvider');
  }
  return context;
};