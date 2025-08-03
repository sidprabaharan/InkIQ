import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { GarmentStatus, GARMENT_STATUS_CONFIG } from '@/types/garment';

interface GarmentStatusBadgeProps {
  status: GarmentStatus;
  hasIssues?: boolean;
  className?: string;
}

const StatusIcons = {
  pending: Clock,
  po_created: Package,
  ordered: Package,
  received: CheckCircle,
  damaged: XCircle,
  stock_issue: AlertTriangle,
  ready: CheckCircle,
} as const;

export function GarmentStatusBadge({ status, hasIssues = false, className = '' }: GarmentStatusBadgeProps) {
  const config = GARMENT_STATUS_CONFIG[status];
  const Icon = StatusIcons[status];
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Badge 
        variant="secondary"
        className={`${config.color} font-medium text-xs flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
      {hasIssues && (
        <AlertCircle className="h-4 w-4 text-red-500" />
      )}
    </div>
  );
}