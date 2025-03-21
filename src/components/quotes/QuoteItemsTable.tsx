
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface QuoteItem {
  category: string;
  itemNumber: string;
  color: string;
  description: string;
  xs: string;
  s: string;
  m: string;
  l: string;
  xl: string;
  xxl: string;
  xxxl: string;
  price: string;
  taxed: boolean;
  total: string;
}

interface QuoteItemsTableProps {
  items: QuoteItem[];
}

export function QuoteItemsTable({ items }: QuoteItemsTableProps) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="font-medium mb-4">Quote Items</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Item#</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-center">XS</TableHead>
              <TableHead className="text-center">S</TableHead>
              <TableHead className="text-center">M</TableHead>
              <TableHead className="text-center">L</TableHead>
              <TableHead className="text-center">XL</TableHead>
              <TableHead className="text-center">2XL</TableHead>
              <TableHead className="text-center">3XL</TableHead>
              <TableHead className="text-center">Price</TableHead>
              <TableHead className="text-center">Taxed</TableHead>
              <TableHead className="text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.itemNumber}</TableCell>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-center">{item.xs}</TableCell>
                <TableCell className="text-center">{item.s}</TableCell>
                <TableCell className="text-center">{item.m}</TableCell>
                <TableCell className="text-center">{item.l}</TableCell>
                <TableCell className="text-center">{item.xl}</TableCell>
                <TableCell className="text-center">{item.xxl}</TableCell>
                <TableCell className="text-center">{item.xxxl}</TableCell>
                <TableCell className="text-center">{item.price}</TableCell>
                <TableCell className="text-center">{item.taxed ? '✓' : ''}</TableCell>
                <TableCell className="text-center">{item.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
