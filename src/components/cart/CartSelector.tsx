import React, { useState } from 'react';
import { useCartManager } from '@/context/CartManagerContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ShoppingCart, Plus, Copy, Trash2, ChevronDown, Edit2 } from 'lucide-react';

export function CartSelector() {
  const { 
    carts, 
    activeCartId, 
    activeCart, 
    setActiveCart, 
    createCart, 
    deleteCart, 
    duplicateCart,
    updateCart,
    getCartTotals,
    getAllCartsTotals,
    userSettings 
  } = useCartManager();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCartName, setNewCartName] = useState('');
  const [newCartStrategy, setNewCartStrategy] = useState<'separate' | 'combined'>('separate');
  const [editingCartId, setEditingCartId] = useState<string | null>(null);
  const [editCartName, setEditCartName] = useState('');
  
  const allTotals = getAllCartsTotals();
  const activeCartTotals = activeCartId ? getCartTotals(activeCartId) : { totalItems: 0, subtotal: 0 };
  
  const handleCreateCart = () => {
    const cartId = createCart(newCartName || undefined, newCartStrategy);
    setNewCartName('');
    setShowCreateDialog(false);
  };
  
  const handleEditCart = (cartId: string, currentName: string) => {
    setEditingCartId(cartId);
    setEditCartName(currentName);
  };
  
  const handleSaveEdit = () => {
    if (editingCartId && editCartName.trim()) {
      updateCart(editingCartId, { name: editCartName.trim() });
      setEditingCartId(null);
      setEditCartName('');
    }
  };
  
  const handleDeleteCart = (cartId: string) => {
    if (carts.length > 1 || confirm('This will delete your only cart. Are you sure?')) {
      deleteCart(cartId);
    }
  };
  
  const getCartStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'ready': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Create a default cart if none exist
  React.useEffect(() => {
    if (carts.length === 0) {
      createCart();
    }
  }, [carts.length]);
  
  return (
    <div className="flex items-center gap-2">
      {/* Active Cart Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            {activeCart ? (
              <>
                <span className="max-w-[150px] truncate">{activeCart.name}</span>
                {activeCartTotals.totalItems > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeCartTotals.totalItems}
                  </Badge>
                )}
              </>
            ) : (
              <span>Select Cart</span>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <div className="p-2">
            <div className="text-sm font-medium mb-2">Active Carts</div>
            {carts.filter(cart => cart.status !== 'submitted').map((cart) => {
              const totals = getCartTotals(cart.id);
              return (
                <div key={cart.id} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => setActiveCart(cart.id)}
                  >
                    <div className="flex items-center gap-2">
                      {editingCartId === cart.id ? (
                        <Input
                          value={editCartName}
                          onChange={(e) => setEditCartName(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                          className="h-6 text-sm"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span className={`text-sm ${activeCartId === cart.id ? 'font-medium' : ''}`}>
                            {cart.name}
                          </span>
                          <Badge variant="outline" className={getCartStatusColor(cart.status)}>
                            {cart.status}
                          </Badge>
                        </>
                      )}
                    </div>
                    {totals.totalItems > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {totals.totalItems} items • ${totals.subtotal.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditCart(cart.id, cart.name);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateCart(cart.id);
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCart(cart.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem asChild>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm">
                  <Plus className="h-4 w-4" />
                  Create New Cart
                </button>
              </DialogTrigger>
            </Dialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Total Badge */}
      {allTotals.totalItems > 0 && (
        <Badge variant="secondary">
          {allTotals.totalItems} total items
        </Badge>
      )}
      
      {/* Create Cart Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Cart</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cartName">Cart Name</Label>
              <Input
                id="cartName"
                value={newCartName}
                onChange={(e) => setNewCartName(e.target.value)}
                placeholder="Enter cart name (optional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cartStrategy">Ordering Strategy</Label>
              <Select value={newCartStrategy} onValueChange={(value: 'separate' | 'combined') => setNewCartStrategy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="separate">Separate POs (one per order)</SelectItem>
                  <SelectItem value="combined">Combined POs (bundle for shipping)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCart}>
                Create Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}