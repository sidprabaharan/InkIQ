import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartManager } from '@/context/CartManagerContext';

export function CartIcon() {
  const { getAllCartsTotals } = useCartManager();
  const navigate = useNavigate();
  const allTotals = getAllCartsTotals();

  const handleClick = () => {
    navigate('/purchase-orders');
  };

  return (
    <Button variant="ghost" className="relative" onClick={handleClick}>
      <ShoppingCart className="h-5 w-5" />
      {allTotals.totalItems > 0 && (
        <Badge className="absolute -top-2 -right-2 px-1 min-w-5 h-5 flex items-center justify-center">
          {allTotals.totalItems}
        </Badge>
      )}
      <span className="sr-only">View cart</span>
    </Button>
  );
}