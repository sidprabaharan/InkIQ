
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight } from 'lucide-react';

export function TopCustomersTable() {
  // Sample data
  const customers = [
    { name: 'XYZ Corp', revenue: 85400, orders: 24, growth: '+12.5%' },
    { name: 'ABC Industries', revenue: 72500, orders: 18, growth: '+8.3%' },
    { name: 'Golden State Schools', revenue: 64200, orders: 12, growth: '+15.7%' },
    { name: 'Metro Athletics', revenue: 58700, orders: 15, growth: '+6.2%' },
    { name: 'City of Riverside', revenue: 45300, orders: 9, growth: '+11.8%' },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Orders</TableHead>
          <TableHead className="text-right">Growth</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.name}>
            <TableCell className="font-medium">{customer.name}</TableCell>
            <TableCell className="text-right">${customer.revenue.toLocaleString()}</TableCell>
            <TableCell className="text-right">{customer.orders}</TableCell>
            <TableCell className="text-right text-green-600 flex items-center justify-end">
              {customer.growth}
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
