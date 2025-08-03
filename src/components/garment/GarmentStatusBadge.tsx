import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GarmentStatus, GARMENT_STATUS_CONFIG } from '@/types/garment';

interface GarmentStatusBadgeProps {
  status: GarmentStatus;
  hasIssues?: boolean;
  className?: string;
}

export function GarmentStatusBadge({ status, hasIssues = false, className = '' }: GarmentStatusBadgeProps) {
  const config = GARMENT_STATUS_CONFIG[status];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant="secondary"
        className={`${config.color} font-medium text-xs`}
      >
        {config.label}
      </Badge>
      {hasIssues && (
        <div className="w-2 h-2 bg-red-500 rounded-full" title="Has issues" />
      )}
    </div>
  );
}