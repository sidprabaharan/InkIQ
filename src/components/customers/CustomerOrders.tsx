
import React from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Order {
  id: string;
  date: string;
  total: string;
  status: string;
  items: string;
}

interface CustomerOrdersProps {
  orders: Order[];
}

export function CustomerOrders({ orders }: CustomerOrdersProps) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle>Customer Orders</CardTitle>
          <Button variant="outline" size="sm" className="text-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">{order.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" className="text-blue-600">
            <ShoppingCart className="h-4 w-4 mr-2" />
            View All Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
