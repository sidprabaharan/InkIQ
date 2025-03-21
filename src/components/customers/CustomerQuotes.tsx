
import React from "react";
import { Plus, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Quote {
  id: string;
  date: string;
  total: string;
  status: string;
  items: string;
}

interface CustomerQuotesProps {
  quotes: Quote[];
}

export function CustomerQuotes({ quotes }: CustomerQuotesProps) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex justify-between items-center">
          <CardTitle>Customer Quotes</CardTitle>
          <Button variant="outline" size="sm" className="text-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            New Quote
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Quote ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote) => (
              <TableRow key={quote.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">#{quote.id}</TableCell>
                <TableCell>{quote.date}</TableCell>
                <TableCell>{quote.items}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    quote.status === 'Approved' 
                      ? 'bg-green-100 text-green-800'
                      : quote.status === 'Draft'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {quote.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">{quote.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="flex justify-center mt-6">
          <Button variant="outline" className="text-blue-600">
            <FileCheck className="h-4 w-4 mr-2" />
            View All Quotes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
