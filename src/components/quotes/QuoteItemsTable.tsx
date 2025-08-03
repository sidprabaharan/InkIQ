import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImprintItem, ImprintFile } from "@/types/imprint";
import { GarmentDetails, GarmentStatus, GarmentIssue } from "@/types/garment";
import { GarmentStatusDropdown } from "@/components/garment/GarmentStatusDropdown";
import { StockIssueDialog } from "@/components/garment/StockIssueDialog";
import { GarmentIssuesList } from "@/components/garment/GarmentIssuesList";
import { useToast } from "@/hooks/use-toast";

interface Mockup {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface QuoteItem {
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
  price: number | string;
  taxed: boolean;
  total: number | string;
  status: string;
  mockups: Mockup[];
  garmentDetails?: GarmentDetails;
}

interface ItemGroup {
  id: string;
  items: QuoteItem[];
  imprints: ImprintItem[];
}

interface QuoteItemsTableProps {
  itemGroups: ItemGroup[];
}

export function QuoteItemsTable({ itemGroups }: QuoteItemsTableProps) {
  const { toast } = useToast();
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<QuoteItem | null>(null);

  // Helper function to get total quantity for an item
  const getTotalQuantity = (sizes: QuoteItem['sizes']) => {
    return Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
  };

  // Initialize default garment details if not present
  const getGarmentDetails = (item: QuoteItem): GarmentDetails => {
    if (item.garmentDetails) {
      return item.garmentDetails;
    }
    
    const totalQuantity = getTotalQuantity(item.sizes);
    return {
      status: 'pending',
      stockIssues: [],
      receivedQuantity: 0,
      expectedQuantity: totalQuantity,
      statusHistory: [{
        id: `${item.id}-initial`,
        status: 'pending',
        timestamp: new Date(),
        notes: 'Initial status'
      }],
      lastUpdated: new Date()
    };
  };

  const handleStatusChange = (item: QuoteItem, newStatus: GarmentStatus, notes?: string) => {
    // In a real app, this would update the backend
    toast({
      title: "Status Updated",
      description: `${item.description} status changed to ${newStatus}`,
    });
  };

  const handleReportIssue = (item: QuoteItem) => {
    setSelectedItem(item);
    setIssueDialogOpen(true);
  };

  const handleIssueSubmit = (issueData: Omit<GarmentIssue, 'id' | 'reportedDate'>) => {
    if (!selectedItem) return;
    
    // In a real app, this would update the backend
    toast({
      title: "Issue Reported",
      description: `${issueData.type} reported for ${selectedItem.description}`,
      variant: "destructive",
    });
    
    setSelectedItem(null);
  };
  const renderItemGroup = (group: ItemGroup, groupIndex: number) => {
    return (
      <div key={group.id} className="mb-8 border rounded-md overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="py-2 text-xs uppercase w-[8%]">Category</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[6%]">Item#</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[6%]">Color</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[15%]">Description</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[4%]">XS</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[4%]">S</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[4%]">M</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[4%]">L</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[4%]">XL</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[4%]">2XL</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[4%]">3XL</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">Price</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">Taxed</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[6%]">Total</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[12%]">Garment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.items.flatMap((item, itemIndex) => {
              const garmentDetails = getGarmentDetails(item);
              const totalQuantity = getTotalQuantity(item.sizes);
              
              const rows = [
                  <TableRow key={`${group.id}-item-${itemIndex}`} className="border-b hover:bg-gray-50">
                    <TableCell className="p-2 border-r border-gray-200">
                      <div className="text-sm">{item.category}</div>
                    </TableCell>
                    <TableCell className="p-2 border-r border-gray-200">
                      <div className="text-sm">{item.itemNumber}</div>
                    </TableCell>
                    <TableCell className="p-2 border-r border-gray-200">
                      <div className="text-sm">{item.color}</div>
                    </TableCell>
                    <TableCell className="p-2 border-r border-gray-200">
                      <div className="text-sm">{item.description}</div>
                    </TableCell>
                    <TableCell className="p-2 text-center border-r border-gray-200">
                      <div className="text-sm">{item.sizes.xs || 0}</div>
                    </TableCell>
                    <TableCell className="p-2 text-center border-r border-gray-200">
                      <div className="text-sm">{item.sizes.s || 0}</div>
                    </TableCell>
                    <TableCell className="p-2 text-center border-r border-gray-200">
                      <div className="text-sm">{item.sizes.m || 0}</div>
                    </TableCell>
                    <TableCell className="p-2 text-center border-r border-gray-200">
                      <div className="text-sm">{item.sizes.l || 0}</div>
                    </TableCell>
                    <TableCell className="p-2 text-center border-r border-gray-200">
                      <div className="text-sm">{item.sizes.xl || 0}</div>
                    </TableCell>
                    <TableCell className="p-2 text-center border-r border-gray-200">
                      <div className="text-sm">{item.sizes.xxl || 0}</div>
                    </TableCell>
                    <TableCell className="p-2 text-center border-r border-gray-200">
                      <div className="text-sm">{item.sizes.xxxl || 0}</div>
                    </TableCell>
                    <TableCell className="p-2 border-r border-gray-200">
                      <div className="text-sm">${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price.toString().replace(/[$,]/g, '')).toFixed(2)}</div>
                    </TableCell>
                    <TableCell className="p-2 text-center border-r border-gray-200">
                      <div className="text-sm">{item.taxed ? '✓' : ''}</div>
                    </TableCell>
                    <TableCell className="p-2 border-r border-gray-200">
                      <div className="text-sm font-medium">${typeof item.total === 'number' ? item.total.toFixed(2) : parseFloat(item.total.toString().replace(/[$,]/g, '')).toFixed(2)}</div>
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex flex-col gap-1">
                        <GarmentStatusDropdown
                          garmentDetails={garmentDetails}
                          onStatusChange={(status, notes) => handleStatusChange(item, status, notes)}
                          onReportIssue={() => handleReportIssue(item)}
                        />
                        {totalQuantity > 0 && garmentDetails.receivedQuantity !== garmentDetails.expectedQuantity && (
                          <div className="text-xs text-muted-foreground">
                            {garmentDetails.receivedQuantity}/{garmentDetails.expectedQuantity} received
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
              ];
              
              if ((item.mockups && item.mockups.length > 0) || getGarmentDetails(item).stockIssues.length > 0) {
                rows.push(
                  <TableRow key={`${group.id}-item-${itemIndex}-details`} className="border-b hover:bg-gray-50">
                    <TableCell colSpan={15} className="p-2 bg-gray-50">
                      <div className="space-y-4">
                        {item.mockups && item.mockups.length > 0 && (
                          <div>
                            <h5 className="font-medium text-sm mb-2">Mockups</h5>
                            <div className="flex flex-wrap gap-2">
                              {item.mockups.map((mockup) => (
                                <div 
                                  key={mockup.id} 
                                  className="w-20 h-20 border rounded-md overflow-hidden"
                                >
                                  <img 
                                    src={mockup.url} 
                                    alt={mockup.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <GarmentIssuesList issues={getGarmentDetails(item).stockIssues} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              }
              
              return rows;
            })}

            {group.imprints && group.imprints.length > 0 && (
              <TableRow className="border-b bg-slate-50">
                <TableCell colSpan={15} className="p-4">
                    <div className="space-y-3">
                    <h4 className="font-medium text-sm">Imprint Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {group.imprints.map((imprint) => (
                        <div key={imprint.id} className="border rounded-md p-3 bg-white">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="font-medium">Method:</span> {imprint.method || "Not specified"}
                            </div>
                            <div>
                              <span className="font-medium">Location:</span> {imprint.location || "Not specified"}
                            </div>
                            {(imprint.width > 0 || imprint.height > 0) && (
                              <div>
                                <span className="font-medium">Size:</span> {imprint.width}" × {imprint.height}"
                              </div>
                            )}
                            {imprint.colorsOrThreads && (
                              <div>
                                <span className="font-medium">Colors/Threads:</span> {imprint.colorsOrThreads}
                              </div>
                            )}
                          </div>
                          {imprint.notes && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Notes:</span> {imprint.notes}
                            </div>
                          )}
                          
                          {/* Customer Art */}
                          {imprint.customerArt && imprint.customerArt.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Customer Art:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {imprint.customerArt.map((file) => (
                                  <div key={file.id} className="w-16 h-16 border rounded-md overflow-hidden">
                                    {file.type.startsWith('image/') ? (
                                      <img 
                                        src={file.url} 
                                        alt={file.name}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => window.open(file.url, '_blank')}
                                        title={file.name}
                                      />
                                    ) : (
                                      <div 
                                        className="w-full h-full flex flex-col items-center justify-center bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                                        onClick={() => window.open(file.url, '_blank')}
                                        title={file.name}
                                      >
                                        <span className="text-xs">{file.name.split('.').pop()?.toUpperCase()}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Production Files */}
                          {imprint.productionFiles && imprint.productionFiles.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Production Files:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {imprint.productionFiles.map((file) => (
                                  <div key={file.id} className="w-16 h-16 border rounded-md overflow-hidden">
                                    {file.type.startsWith('image/') ? (
                                      <img 
                                        src={file.url} 
                                        alt={file.name}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => window.open(file.url, '_blank')}
                                        title={file.name}
                                      />
                                    ) : (
                                      <div 
                                        className="w-full h-full flex flex-col items-center justify-center bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                                        onClick={() => window.open(file.url, '_blank')}
                                        title={file.name}
                                      >
                                        <span className="text-xs">{file.name.split('.').pop()?.toUpperCase()}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Proof/Mockup */}
                          {imprint.proofMockup && imprint.proofMockup.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Proof/Mockup:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {imprint.proofMockup.map((file) => (
                                  <div key={file.id} className="w-16 h-16 border rounded-md overflow-hidden">
                                    {file.type.startsWith('image/') ? (
                                      <img 
                                        src={file.url} 
                                        alt={file.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-muted">
                                        <span className="text-xs">{file.name.split('.').pop()?.toUpperCase()}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">Quote Items</h3>
      {itemGroups.map((group, groupIndex) => renderItemGroup(group, groupIndex))}
      
      <StockIssueDialog
        open={issueDialogOpen}
        onOpenChange={setIssueDialogOpen}
        onSubmit={handleIssueSubmit}
        maxQuantity={selectedItem ? getTotalQuantity(selectedItem.sizes) : 1}
      />
    </div>
  );
}