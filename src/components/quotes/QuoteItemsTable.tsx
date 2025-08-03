import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Mockup {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface ImprintItem {
  id: string;
  typeOfWork: string;
  details?: string;
  mockups: Mockup[];
}

interface Imprint {
  id: string;
  imprintItems: ImprintItem[];
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
}

interface ItemGroup {
  id: string;
  items: QuoteItem[];
  imprints: Imprint[];
}

interface QuoteItemsTableProps {
  itemGroups: ItemGroup[];
}

export function QuoteItemsTable({ itemGroups }: QuoteItemsTableProps) {
  const renderItemGroup = (group: ItemGroup, groupIndex: number) => {
    return (
      <div key={group.id} className="mb-8 border rounded-md overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="py-2 text-xs uppercase w-[10%]">Category</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[7.5%]">Item#</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[7.5%]">Color</TableHead>
              <TableHead className="py-2 text-xs uppercase w-[20%]">Description</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">XS</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">S</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">M</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">L</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">XL</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">2XL</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[5%]">3XL</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[6%]">Price</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[6%]">Taxed</TableHead>
              <TableHead className="py-2 text-xs uppercase text-center w-[8%]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group.items.map((item, itemIndex) => {
              return (
                <React.Fragment key={`${group.id}-item-${itemIndex}`}>
                  <TableRow className="border-b hover:bg-gray-50">
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
                  </TableRow>
                  
                  {item.mockups && item.mockups.length > 0 && (
                    <TableRow className="border-b hover:bg-gray-50">
                      <TableCell colSpan={14} className="p-2 bg-gray-50">
                        <div className="flex flex-wrap gap-2 p-2">
                          <span className="text-sm font-medium text-gray-600 mr-2">Mockups:</span>
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
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}

            {group.imprints && group.imprints.length > 0 && group.imprints.map((imprint) => (
              <TableRow key={imprint.id} className="border-b bg-slate-50">
                <TableCell colSpan={14} className="p-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Imprint Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {imprint.imprintItems?.map((item) => (
                        <div key={item.id} className="border rounded-md p-3 bg-white">
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Type of Work:</span> {item.typeOfWork || "Not specified"}
                            </div>
                          </div>
                          {item.details && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">Details:</span> {item.details}
                            </div>
                          )}
                          {item.mockups && item.mockups.length > 0 && (
                            <div className="mt-2">
                              <span className="font-medium text-sm">Mockups:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {item.mockups?.map((mockup) => (
                                  <div key={mockup.id} className="w-16 h-16 border rounded-md overflow-hidden">
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
                        </div>
                      ))}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">Quote Items</h3>
      {itemGroups.map((group, groupIndex) => renderItemGroup(group, groupIndex))}
    </div>
  );
}