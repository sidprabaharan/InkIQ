
import React from 'react';
import { Separator } from '@/components/ui/separator';

interface PerformanceMetricsProps {
  timeRange: string;
}

export function PerformanceMetrics({ timeRange }: PerformanceMetricsProps) {
  const metrics = [
    { name: 'Closing Rate', value: '68%', change: '+5.2%', description: 'Lead to customer conversion' },
    { name: 'Quote Conversion', value: '81%', change: '+3.8%', description: 'Quote to order conversion' },
    { name: 'Avg Deal Size', value: '$4,850', change: '+12.3%', description: 'Average revenue per order' },
    { name: 'Avg Industry Growth', value: '17.5%', change: '+2.1%', description: 'Top 3 industries growth' },
    { name: 'Customer Retention', value: '92%', change: '+1.5%', description: 'Returning customer rate' },
    { name: 'New Customer Acq. Cost', value: '$215', change: '-8.4%', description: 'Cost to acquire new customer' },
  ];

  return (
    <div className="space-y-3">
      {metrics.map((metric, index) => (
        <React.Fragment key={metric.name}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-medium">{metric.name}</div>
              <div className="text-xs text-muted-foreground">{metric.description}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{metric.value}</div>
              <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </div>
            </div>
          </div>
          {index < metrics.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </div>
  );
}
