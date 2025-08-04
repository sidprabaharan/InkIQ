import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductCustomizer } from "./ProductCustomizer";
import { toast } from "sonner";
import { useCartManager } from "@/context/CartManagerContext";
import { CartItem } from "@/types/cart";

interface ProductCustomizationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: number;
    sku: string;
    name: string;
    category: string;
    lowestPrice: number;
    image?: string;
  };
  supplier: {
    name: string;
    price: number;
  };
}

export function ProductCustomizationDialog({ 
  open, 
  onOpenChange, 
  product, 
  supplier 
}: ProductCustomizationDialogProps) {
  const [isCustomizing, setIsCustomizing] = useState(false);
  const { addToCart, activeCart, createCart } = useCartManager();

  const handleSaveDesign = (designData: any) => {
    console.log('🎨 Design saved:', designData);
    
    // Create a cart if none exists
    let currentCartId = activeCart?.id;
    if (!currentCartId) {
      currentCartId = createCart();
    }
    
    // Create cart item with customization data
    const cartItem: CartItem = {
      id: product.id,
      sku: product.sku,
      name: product.name,
      category: product.category,
      price: supplier.price,
      supplierName: supplier.name,
      image: product.image,
      quantities: [{
        location: 'Custom Design',
        size: 'Various',
        quantity: 1
      }],
      totalQuantity: 1,
      customization: designData
    };
    
    addToCart(currentCartId, cartItem);
    toast.success("Customized product added to cart!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Customize {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <ProductCustomizer 
            productImage={product.image}
            onSaveDesign={handleSaveDesign}
          />
        </div>
        
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}