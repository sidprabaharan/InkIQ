
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Filter, Plus, ArrowUpDown } from 'lucide-react';

// Mock data for products
const mockProducts = [
  {
    id: 1,
    sku: 'GIL2000',
    name: 'Gildan Heavy Cotton T-Shirt',
    category: 'T-Shirts',
    suppliers: [
      { name: 'SanMar', price: 3.25, inventory: 1250 },
      { name: 'Alphabroder', price: 3.15, inventory: 850 },
      { name: 'S&S Activewear', price: 3.35, inventory: 1500 },
      { name: 'TSC Apparel', price: 3.30, inventory: 750 }
    ],
    lowestPrice: 3.15
  },
  {
    id: 2,
    sku: 'NL3600',
    name: 'Next Level Cotton T-Shirt',
    category: 'T-Shirts',
    suppliers: [
      { name: 'SanMar', price: 4.50, inventory: 800 },
      { name: 'Alphabroder', price: 4.75, inventory: 1200 },
      { name: 'S&S Activewear', price: 4.35, inventory: 950 }
    ],
    lowestPrice: 4.35
  },
  {
    id: 3,
    sku: 'JRZ996',
    name: 'Jerzees Hoodie',
    category: 'Hoodies',
    suppliers: [
      { name: 'SanMar', price: 12.75, inventory: 450 },
      { name: 'S&S Activewear', price: 12.50, inventory: 320 }
    ],
    lowestPrice: 12.50
  },
  {
    id: 4,
    sku: 'FRT1200',
    name: 'Fruit of the Loom Sweatshirt',
    category: 'Sweatshirts',
    suppliers: [
      { name: 'Alphabroder', price: 8.25, inventory: 620 },
      { name: 'TSC Apparel', price: 8.15, inventory: 480 }
    ],
    lowestPrice: 8.15
  },
  {
    id: 5,
    sku: 'PC61',
    name: 'Port & Company Essential Tee',
    category: 'T-Shirts',
    suppliers: [
      { name: 'SanMar', price: 3.10, inventory: 1800 },
      { name: 'Alphabroder', price: 3.25, inventory: 1250 },
      { name: 'TSC Apparel', price: 3.20, inventory: 900 }
    ],
    lowestPrice: 3.10
  }
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  
  const categories = ['All', 'T-Shirts', 'Hoodies', 'Sweatshirts', 'Polos', 'Hats'];
  const itemsPerPage = 10;
  
  // Filter products based on search term and category
  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  
  const toggleProductExpansion = (productId: number) => {
    if (expandedProduct === productId) {
      setExpandedProduct(null);
    } else {
      setExpandedProduct(productId);
    }
  };
  
  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            View and manage all products from different suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
                  <TableHead className="w-[100px]">SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">
                    Lowest Price
                    <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    <TableRow className="cursor-pointer" onClick={() => toggleProductExpansion(product.id)}>
                      <TableCell className="font-medium">{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">${product.lowestPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={(e) => { 
                          e.stopPropagation();
                          toggleProductExpansion(product.id);
                        }}>
                          {expandedProduct === product.id ? 'Hide Details' : 'Show Details'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {expandedProduct === product.id && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="py-2 px-4 bg-muted/50 rounded-md">
                            <h4 className="font-medium mb-2">Supplier Options</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Supplier</TableHead>
                                  <TableHead className="text-right">Price</TableHead>
                                  <TableHead className="text-right">Inventory</TableHead>
                                  <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {product.suppliers.map((supplier, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{supplier.name}</TableCell>
                                    <TableCell className="text-right">
                                      ${supplier.price.toFixed(2)}
                                      {supplier.price === product.lowestPrice && (
                                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                          Best Price
                                        </span>
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">{supplier.inventory}</TableCell>
                                    <TableCell className="text-right">
                                      <Button size="sm" variant="outline">Add to Cart</Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                
                {displayedProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No products found. Try adjusting your search or filters.
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
