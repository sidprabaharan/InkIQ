
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export function SalesByRegionMap() {
  // Since we can't easily implement a real map without additional libraries,
  // we'll create a simplified region representation
  const regions = [
    { name: 'West Coast', revenue: 458750, percentage: 32, growth: '+8.3%' },
    { name: 'East Coast', revenue: 315800, percentage: 22, growth: '+12.5%' },
    { name: 'Midwest', revenue: 258400, percentage: 18, growth: '+5.2%' },
    { name: 'South', revenue: 201300, percentage: 14, growth: '+6.8%' },
    { name: 'Southwest', revenue: 143500, percentage: 10, growth: '+9.7%' },
    { name: 'International', revenue: 57400, percentage: 4, growth: '+22.1%' },
  ];

  return (
    <div className="h-full">
      <div className="text-xs text-muted-foreground mb-2">
        Interactive map will be implemented with a mapping library
      </div>
      <div className="space-y-4">
        {regions.map((region) => (
          <div key={region.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm font-medium">{region.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${region.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium">${region.revenue.toLocaleString()}</span>
              <span className="text-xs text-green-600">{region.growth}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
