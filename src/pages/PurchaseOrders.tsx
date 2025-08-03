
import React, { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Filter, Eye, FileText, ShoppingCart, Package, History, Edit2, Trash2, Send, Download } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useCartManager } from '@/context/CartManagerContext';
import { CartManagerProvider } from '@/context/CartManagerContext';
import { EditableCartItem } from '@/components/cart/EditableCartItem';
import { CartDetailsSheet } from '@/components/cart/CartDetailsSheet';

// Mock data for purchase orders
const initialPurchaseOrders = [
  {
    id: "PO-2023-001",
    supplier: "SanMar",
    dateCreated: "2023-05-15",
    status: "Delivered",
    total: 1250.75,
    poNumber: "CUST-001",
    items: [
      { id: 1, name: "Gildan Heavy Cotton T-Shirt", sku: "GIL2000", quantity: 100, price: 3.25, total: 325 },
      { id: 2, name: "Port & Company Essential Tee", sku: "PC61", quantity: 150, price: 3.10, total: 465 },
      { id: 3, name: "Next Level Cotton T-Shirt", sku: "NL3600", quantity: 100, price: 4.50, total: 450 }
    ]
  },
  {
    id: "PO-2023-002",
    supplier: "Alphabroder",
    dateCreated: "2023-06-02",
    status: "Shipped",
    poNumber: "CUST-002",
    total: 825.50,
    items: [
      { id: 1, name: "Fruit of the Loom Sweatshirt", sku: "FRT1200", quantity: 100, price: 8.25, total: 825.50 }
    ]
  },
  {
    id: "PO-2023-003",
    supplier: "S&S Activewear",
    dateCreated: "2023-06-10",
    status: "Processing",
    poNumber: "CUST-003",
    total: 1687.50,
    items: [
      { id: 1, name: "Jerzees Hoodie", sku: "JRZ996", quantity: 75, price: 12.50, total: 937.50 },
      { id: 2, name: "Next Level Cotton T-Shirt", sku: "NL3600", quantity: 150, price: 4.35, total: 652.50 },
      { id: 3, name: "Gildan Heavy Cotton T-Shirt", sku: "GIL2000", quantity: 50, price: 3.35, total: 167.50 }
    ]
  },
  {
    id: "PO-2023-004",
    supplier: "TSC Apparel",
    dateCreated: "2023-06-15",
    status: "Pending",
    poNumber: "CUST-004",
    total: 895.00,
    items: [
      { id: 1, name: "Fruit of the Loom Sweatshirt", sku: "FRT1200", quantity: 110, price: 8.15, total: 896.50 }
    ]
  },
  {
    id: "PO-2023-005",
    supplier: "SanMar",
    dateCreated: "2023-06-20",
    status: "Cancelled",
    poNumber: "CUST-005",
    total: 556.25,
    items: [
      { id: 1, name: "Jerzees Hoodie", sku: "JRZ996", quantity: 25, price: 12.75, total: 318.75 },
      { id: 2, name: "Port & Company Essential Tee", sku: "PC61", quantity: 75, price: 3.10, total: 232.50 }
    ]
  }
];

function PurchaseOrdersContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState(initialPurchaseOrders);
  const [activeTab, setActiveTab] = useState('active-carts');
  const [selectedCartDetails, setSelectedCartDetails] = useState<string | null>(null);
  const [cartDetailsOpen, setCartDetailsOpen] = useState(false);
  const location = useLocation();
  
  const { 
    carts, 
    deleteCart, 
    convertCartToPO, 
    updateCart,
    getCartTotals,
    createCart 
  } = useCartManager();
  
  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const suppliers = ['All', 'SanMar', 'Alphabroder', 'S&S Activewear', 'TSC Apparel'];
  const itemsPerPage = 10;
  
  // Check if we're navigating from cart checkout
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newOrder = params.get('newOrder');
    
    if (newOrder === 'true') {
      toast.success("Your purchase order has been created successfully!");
    }
  }, [location]);
  
  // Filter purchase orders based on search term, status, and supplier
  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (order.poNumber && order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSupplier = supplierFilter === 'All' || order.supplier === supplierFilter;
    
    return matchesSearch && matchesStatus && matchesSupplier;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  
  const toggleOrderExpansion = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const activeCarts = carts.filter(cart => cart.status === 'draft' || cart.status === 'ready');
  const submittedCarts = carts.filter(cart => cart.status === 'submitted');
  
  const handleConvertToPO = async (cartId: string) => {
    try {
      await convertCartToPO(cartId);
      toast.success("Cart converted to Purchase Order successfully!");
    } catch (error) {
      toast.error("Failed to convert cart to Purchase Order");
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

  const handleViewCartDetails = (cartId: string) => {
    setSelectedCartDetails(cartId);
    setCartDetailsOpen(true);
  };

  const handleDownloadCartDocument = (cartId: string) => {
    const cart = carts.find(c => c.id === cartId);
    if (cart) {
      toast.success(`Downloading document for ${cart.name}...`);
      // Future implementation: Generate and download PDF/document
    }
  };

  const selectedCart = selectedCartDetails ? carts.find(c => c.id === selectedCartDetails) : null;

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cart & Purchase Order Management</h1>
        <Button onClick={() => createCart()}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Cart
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active-carts" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Active Carts ({activeCarts.length})
          </TabsTrigger>
          <TabsTrigger value="submitted-carts" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Submitted Carts ({submittedCarts.length})
          </TabsTrigger>
          <TabsTrigger value="purchase-orders" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Historical POs ({purchaseOrders.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Carts Tab */}
        <TabsContent value="active-carts">
          <Card>
            <CardHeader>
              <CardTitle>Active Carts</CardTitle>
              <CardDescription>
                Draft and ready carts that can be converted to purchase orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeCarts.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No active carts found</p>
                  <Button onClick={() => createCart()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Cart
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeCarts.map((cart) => {
                    const totals = getCartTotals(cart.id);
                    
                    // Group items by supplier
                    const itemsBySupplier = cart.items.reduce((acc, item) => {
                      if (!acc[item.supplierName]) {
                        acc[item.supplierName] = [];
                      }
                      acc[item.supplierName].push(item);
                      return acc;
                    }, {} as Record<string, typeof cart.items>);
                    
                    return (
                      <Card key={cart.id}>
                        <CardContent className="p-6">
                          {/* Cart Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{cart.name}</h3>
                                <Badge className={getCartStatusColor(cart.status)}>
                                  {cart.status}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {cart.orderingStrategy}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">
                                Created: {cart.createdAt.toLocaleDateString()} • 
                                Updated: {cart.updatedAt.toLocaleDateString()}
                              </div>
                              {totals.totalItems > 0 && (
                                <div className="text-lg font-semibold text-primary mt-2">
                                  {totals.totalItems} items • ${totals.subtotal.toFixed(2)}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              {totals.totalItems > 0 && (
                                <Button
                                  variant="default"
                                  onClick={() => handleConvertToPO(cart.id)}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Convert to PO
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                onClick={() => deleteCart(cart.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Cart
                              </Button>
                            </div>
                          </div>

                          {/* Cart Items */}
                          {cart.items.length > 0 ? (
                            <div className="space-y-4">
                              {Object.entries(itemsBySupplier).map(([supplier, items]) => (
                                <div key={supplier} className="space-y-3">
                                  <div className="flex items-center gap-2 border-b pb-2">
                                    <h4 className="font-medium text-gray-700">Supplier: {supplier}</h4>
                                    <Badge variant="secondary">
                                      {items.length} {items.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                  </div>
                                  
                                  {items.map((item) => (
                                    <EditableCartItem
                                      key={`${item.id}-${item.supplierName}`}
                                      cartId={cart.id}
                                      item={item}
                                    />
                                  ))}
                                  
                                  {/* Supplier Subtotal */}
                                  <div className="text-right text-sm text-gray-600 border-t pt-2">
                                    Supplier Total: ${items.reduce((sum, item) => sum + (item.price * item.totalQuantity), 0).toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                              <p>This cart is empty</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Submitted Carts Tab */}
        <TabsContent value="submitted-carts">
          <Card>
            <CardHeader>
              <CardTitle>Submitted Carts</CardTitle>
              <CardDescription>
                Carts that have been converted to purchase orders and are pending processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submittedCarts.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No submitted carts found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submittedCarts.map((cart) => {
                    const totals = getCartTotals(cart.id);
                    return (
                      <div key={cart.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium">{cart.name}</h3>
                              <Badge className="bg-green-100 text-green-800">
                                Submitted
                              </Badge>
                              {cart.metadata.poNumber && (
                                <Badge variant="outline">
                                  PO: {cart.metadata.poNumber}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              Submitted: {cart.updatedAt.toLocaleDateString()} • 
                              {totals.totalItems} items • ${totals.subtotal.toFixed(2)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewCartDetails(cart.id)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDownloadCartDocument(cart.id)}>
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historical Purchase Orders Tab */}
        <TabsContent value="purchase-orders">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Historical Purchase Orders</CardTitle>
              <CardDescription>
                Track and manage completed purchase orders from your suppliers
              </CardDescription>
            </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search purchase orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier} value={supplier}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.poNumber || "-"}</TableCell>
                      <TableCell>{order.supplier}</TableCell>
                      <TableCell>{order.dateCreated}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => toggleOrderExpansion(order.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {expandedOrder === order.id && (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <div className="py-4 px-6 bg-muted/50 rounded-md">
                            <h4 className="font-medium mb-3">Order Items</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>SKU</TableHead>
                                  <TableHead>Product</TableHead>
                                  <TableHead className="text-right">Quantity</TableHead>
                                  <TableHead className="text-right">Unit Price</TableHead>
                                  <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items.map((item) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.sku}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell colSpan={4} className="text-right font-medium">Order Total:</TableCell>
                                  <TableCell className="text-right font-bold">${order.total.toFixed(2)}</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                
                {displayedOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No purchase orders found. Try adjusting your search or filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CartDetailsSheet
        cart={selectedCart || null}
        open={cartDetailsOpen}
        onOpenChange={setCartDetailsOpen}
      />
    </div>
  );
}

export default function PurchaseOrders() {
  return (
    <CartManagerProvider>
      <PurchaseOrdersContent />
    </CartManagerProvider>
  );
}
