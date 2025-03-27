
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Expenses() {
  return (
    <div className="flex-1 p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Expense Management</CardTitle>
          <CardDescription>Track and manage all your business expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This feature is coming soon. Check back later for expense tracking capabilities.</p>
        </CardContent>
      </Card>
    </div>
  );
}
