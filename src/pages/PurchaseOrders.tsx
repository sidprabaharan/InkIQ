
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Plus, Filter, Eye, FileText } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Mock data for purchase orders
const mockPurchaseOrders = [
  {
    id: "PO-2023-001",
    supplier: "SanMar",
    dateCreated: "2023-05-15",
    status: "Delivered",
    total: 1250.75,
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
    total: 556.25,
    items: [
      { id: 1, name: "Jerzees Hoodie", sku: "JRZ996", quantity: 25, price: 12.75, total: 318.75 },
      { id: 2, name: "Port & Company Essential Tee", sku: "PC61", quantity: 75, price: 3.10, total: 232.50 }
    ]
  }
];

export default function PurchaseOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const suppliers = ['All', 'SanMar', 'Alphabroder', 'S&S Activewear', 'TSC Apparel'];
  const itemsPerPage = 10;
  
  // Filter purchase orders based on search term, status, and supplier
  const filteredOrders = mockPurchaseOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
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
  
  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Purchase Orders</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Purchase Order
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Purchase Order Management</CardTitle>
          <CardDescription>
            Create, track and manage orders from your suppliers
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
                        <TableCell colSpan={6}>
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
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
    </div>
  );
}
