import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuoteStatusDropdown } from "./QuoteStatusDropdown";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Calendar,
  Truck
} from "lucide-react";

interface StatusDashboardProps {
  status: string;
  quoteId: string;
  totalAmount: string;
  amountPaid: string;
  amountOutstanding: string;
  dueDate: string;
  onStatusChange: (newStatus: string) => void;
}

export function StatusDashboard({
  status,
  quoteId,
  totalAmount,
  amountPaid,
  amountOutstanding,
  dueDate,
  onStatusChange
}: StatusDashboardProps) {
  // Calculate progress based on status
  const getProgressValue = (currentStatus: string) => {
    const statusMap: { [key: string]: number } = {
      "quote": 10,
      "artwork pending": 25,
      "approved": 40,
      "in production": 60,
      "complete": 80,
      "invoiced": 90,
      "paid": 100,
      "cancelled": 0
    };
    return statusMap[currentStatus.toLowerCase()] || 0;
  };

  const progressValue = getProgressValue(status);
  const isOverdue = new Date(dueDate) < new Date() && status.toLowerCase() !== 'paid';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      {/* Status Progress Card */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Quote Progress</CardTitle>
            <QuoteStatusDropdown 
              currentStatus={status} 
              onStatusChange={onStatusChange} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              {status.toLowerCase() === 'complete' || status.toLowerCase() === 'paid' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Clock className="h-4 w-4 text-blue-600" />
              )}
              <span className="text-muted-foreground">
                {status.toLowerCase() === 'paid' ? 'Order completed and paid' : 
                 status.toLowerCase() === 'complete' ? 'Ready for invoicing' :
                 `Currently in ${status.toLowerCase()} phase`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-medium">{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Paid</span>
              <span className="font-medium text-green-600">{amountPaid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Outstanding</span>
              <span className="font-medium text-orange-600">{amountOutstanding}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Dates */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Due Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {isOverdue ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <Calendar className="h-4 w-4 text-blue-600" />
              )}
              <span className="text-sm">{dueDate}</span>
            </div>
            {isOverdue && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}