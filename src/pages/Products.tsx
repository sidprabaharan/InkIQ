
import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, ChevronDown, RefreshCw, ShoppingCart, Eye } from 'lucide-react';
import { ProductRow } from '@/components/products/ProductRow';
import { ProductFilters } from '@/components/products/ProductFilters';
import { mockProducts } from '@/data/mockProducts';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showVendors, setShowVendors] = useState(true);
  const [showPrices, setShowPrices] = useState(true);
  const [sortBy, setSortBy] = useState('relevancy');
  
  const categories = ['All', 'T-Shirts', 'Hoodies', 'Sweatshirts', 'Polos', 'Hats'];
  const itemsPerPage = 5;
  
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
  
  const totalAmount = 0; // You can calculate actual cart total here
  const totalItems = 0; // You can calculate actual cart items here
  
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Top Navigation Bar - Blue header similar to DGI */}
      <div className="bg-blue-800 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
            <Input
              placeholder="Search items by style number, description, or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-none text-white placeholder:text-gray-300 w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-white flex gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart ({totalItems})
          </Button>
        </div>
      </div>
      
      {/* Main Content Area with Filters and Products */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Filters */}
        <ProductFilters 
          showVendors={showVendors} 
          setShowVendors={setShowVendors}
          showPrices={showPrices}
          setShowPrices={setShowPrices}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
        
        {/* Main Product Listing */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              Showing results 1-{Math.min(displayedProducts.length, itemsPerPage)} of {filteredProducts.length} items
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">Sort By:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancy">Relevancy</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                Refresh Carts
              </Button>
            </div>
          </div>
          
          {/* Product Listing Cards */}
          <div className="space-y-4">
            {displayedProducts.map((product) => (
              <ProductRow 
                key={product.id} 
                product={product} 
                showVendors={showVendors}
                showPrices={showPrices}
              />
            ))}
            
            {displayedProducts.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-md">
                <p className="text-lg text-gray-500">No products found. Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
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
        </div>
        
        {/* Right Sidebar - Cart Summary (can be added later) */}
        <div className="w-64 border-l p-4 bg-gray-50 hidden md:block">
          <h3 className="font-semibold text-lg mb-4">Cart Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <Button className="w-full mt-4">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
