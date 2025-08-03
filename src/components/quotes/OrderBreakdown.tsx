import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusDropdown } from "./StatusDropdown";

export interface ImprintFile {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface ImprintDetails {
  type: string;
  details: string;
  files: ImprintFile[];
}

export interface ProductItem {
  id: string;
  category: string;
  itemNumber: string;
  color: string;
  description: string;
  sizes: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  quantity: number;
  price: number;
  tax: boolean;
  total: number;
  mockupImages: string[];
  status: string;
}

export interface LineItemGroupData {
  id: string;
  title: string;
  products: ProductItem[];
  imprintSections: ImprintDetails[];
}

interface OrderBreakdownProps {
  groups: LineItemGroupData[];
}

export function OrderBreakdown({ groups }: OrderBreakdownProps) {
  const formatPrice = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Order Breakdown</h2>
      {groups.map((group, index) => (
        <Card key={group.id} className="shadow-sm">
          <CardContent className="p-0">
            {/* Group Header */}
            <div className="bg-primary/5 border-b border-border px-6 py-4">
              <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto p-6 pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CATEGORY</TableHead>
                    <TableHead>ITEM#</TableHead>
                    <TableHead>COLOR</TableHead>
                    <TableHead>DESCRIPTION</TableHead>
                    <TableHead className="text-center">XS</TableHead>
                    <TableHead className="text-center">S</TableHead>
                    <TableHead className="text-center">M</TableHead>
                    <TableHead className="text-center">L</TableHead>
                    <TableHead className="text-center">XL</TableHead>
                    <TableHead className="text-center">2XL</TableHead>
                    <TableHead className="text-center">3XL</TableHead>
                    <TableHead className="text-center">QTY</TableHead>
                    <TableHead className="text-center">PRICE</TableHead>
                    <TableHead className="text-center">TAX</TableHead>
                    <TableHead className="text-center">TOTAL</TableHead>
                    <TableHead className="text-center">STATUS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.products.map((product) => (
                    <React.Fragment key={product.id}>
                      {/* Product Row */}
                      <TableRow>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.itemNumber}</TableCell>
                        <TableCell>{product.color}</TableCell>
                        <TableCell>{product.description}</TableCell>
                        <TableCell className="text-center">{product.sizes.xs || '-'}</TableCell>
                        <TableCell className="text-center">{product.sizes.s || '-'}</TableCell>
                        <TableCell className="text-center">{product.sizes.m || '-'}</TableCell>
                        <TableCell className="text-center">{product.sizes.l || '-'}</TableCell>
                        <TableCell className="text-center">{product.sizes.xl || '-'}</TableCell>
                        <TableCell className="text-center">{product.sizes.xxl || '-'}</TableCell>
                        <TableCell className="text-center">{product.sizes.xxxl || '-'}</TableCell>
                        <TableCell className="text-center">{product.quantity}</TableCell>
                        <TableCell className="text-center">{formatPrice(product.price)}</TableCell>
                        <TableCell className="text-center">{product.tax ? '✓' : ''}</TableCell>
                        <TableCell className="text-center">{formatPrice(product.total)}</TableCell>
                        <TableCell className="text-center">
                          <StatusDropdown 
                            currentStatus={product.status}
                            onStatusChange={(newStatus) => {}}
                          />
                        </TableCell>
                      </TableRow>
                      
                      {/* Item Mockups Row */}
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={16}>
                          <div className="flex gap-2 py-2">
                            {product.mockupImages.map((image, imgIndex) => (
                              <div key={imgIndex} className="w-16 h-16 border rounded overflow-hidden bg-background">
                                <img 
                                  src={image} 
                                  alt={`${product.description} mockup ${imgIndex + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder.svg';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Imprint Sections */}
            {group.imprintSections.map((imprintSection, sectionIndex) => (
              <div key={sectionIndex} className="bg-muted/20 border-t border-border px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-medium text-sm">Type: </span>
                    <span className="text-sm">{imprintSection.type}</span>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Details: </span>
                    <span className="text-sm">{imprintSection.details}</span>
                  </div>
                </div>
                
                {imprintSection.files.length > 0 && (
                  <div>
                    <span className="font-medium text-sm block mb-2">Logo Files:</span>
                    <div className="flex gap-2">
                      {imprintSection.files.map((file) => (
                        <div key={file.id} className="flex items-center gap-2 bg-background px-3 py-2 rounded border text-sm">
                          <img 
                            src={file.url} 
                            alt={file.name}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}