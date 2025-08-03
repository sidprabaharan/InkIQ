import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "./ProductCard";
import { LineItemGroupData, ImprintDetails } from "./OrderBreakdown";
import { 
  Package, 
  Palette, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Grid,
  List
} from "lucide-react";

interface RedesignedOrderBreakdownProps {
  groups: LineItemGroupData[];
  quoteId: string;
}

export function RedesignedOrderBreakdown({ groups, quoteId }: RedesignedOrderBreakdownProps) {
  const [viewMode, setViewMode] = useState<'cards' | 'compact'>('cards');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(groups.map(g => g.id)));

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleStatusChange = (productId: string, newStatus: string) => {
    console.log(`Status changed for product ${productId} to ${newStatus}`);
    // Handle status change logic here
  };

  let imprintCounter = 0;

  return (
    <div className="space-y-6">
      {/* Header with view controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Order Breakdown</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <Grid className="h-4 w-4 mr-2" />
            Cards
          </Button>
          <Button
            variant={viewMode === 'compact' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('compact')}
          >
            <List className="h-4 w-4 mr-2" />
            Compact
          </Button>
        </div>
      </div>

      {/* Groups */}
      {groups.map((group, index) => (
        <Card key={group.id} className="overflow-hidden">
          <CardHeader 
            className="cursor-pointer hover:bg-muted/30 transition-colors"
            onClick={() => toggleGroup(group.id)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                Group {index + 1}
                <Badge variant="outline">
                  {group.products.length} {group.products.length === 1 ? 'product' : 'products'}
                </Badge>
              </CardTitle>
              <Button variant="ghost" size="sm">
                {expandedGroups.has(group.id) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardHeader>

          {expandedGroups.has(group.id) && (
            <CardContent className="pt-0">
              <Tabs defaultValue="products" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="products" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Products
                  </TabsTrigger>
                  <TabsTrigger value="imprints" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Imprints ({group.imprintSections.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="mt-6">
                  {viewMode === 'cards' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {group.products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {group.products.map((product) => (
                        <Card key={product.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                {product.mockupImages.length > 0 ? (
                                  <img 
                                    src={product.mockupImages[0]} 
                                    alt={product.description}
                                    className="w-full h-full object-cover rounded-lg"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = '/placeholder.svg';
                                    }}
                                  />
                                ) : (
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium">{product.description}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {product.category} • #{product.itemNumber} • {product.color}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="font-medium">${product.total.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {product.quantity}
                                </p>
                              </div>
                              <Badge className={getStatusColor(product.status)}>
                                {product.status}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="imprints" className="mt-6">
                  <div className="space-y-4">
                    {group.imprintSections.map((imprintSection, sectionIndex) => {
                      imprintCounter++;
                      return (
                        <Card key={sectionIndex}>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Palette className="h-5 w-5" />
                              Imprint {quoteId} - {imprintCounter}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                              <div className="space-y-1">
                                <span className="text-sm font-medium text-muted-foreground">Type</span>
                                <p className="text-sm">{imprintSection.type}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-sm font-medium text-muted-foreground">Placement</span>
                                <p className="text-sm">{imprintSection.placement}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-sm font-medium text-muted-foreground">Size</span>
                                <p className="text-sm">{imprintSection.size}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-sm font-medium text-muted-foreground">Colours</span>
                                <p className="text-sm">{imprintSection.colours}</p>
                              </div>
                            </div>
                            
                            {imprintSection.notes && (
                              <div className="mb-4">
                                <span className="text-sm font-medium text-muted-foreground">Notes</span>
                                <p className="text-sm mt-1">{imprintSection.notes}</p>
                              </div>
                            )}
                            
                            {imprintSection.files.length > 0 && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground block mb-2">Logo Files</span>
                                <div className="flex flex-wrap gap-2">
                                  {imprintSection.files.map((file) => (
                                    <div key={file.id} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                                      <img 
                                        src={file.url} 
                                        alt={file.name}
                                        className="w-6 h-6 object-contain"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = '/placeholder.svg';
                                        }}
                                      />
                                      <span className="text-sm">{file.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

const getStatusColor = (status: string) => {
  const statusMap: { [key: string]: string } = {
    "pending": "bg-yellow-100 text-yellow-800",
    "ordered": "bg-blue-100 text-blue-800",
    "received": "bg-green-100 text-green-800",
    "cancelled": "bg-red-100 text-red-800",
    "in production": "bg-purple-100 text-purple-800",
    "complete": "bg-green-100 text-green-800",
    "artwork pending": "bg-yellow-100 text-yellow-800",
  };
  return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};