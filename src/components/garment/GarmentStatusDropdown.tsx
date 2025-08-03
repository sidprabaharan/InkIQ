import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { GarmentStatus, GARMENT_STATUS_CONFIG, GarmentDetails } from '@/types/garment';
import { GarmentStatusBadge } from './GarmentStatusBadge';

interface GarmentStatusDropdownProps {
  garmentDetails: GarmentDetails;
  onStatusChange: (status: GarmentStatus, notes?: string) => void;
  onReportIssue: () => void;
}

export function GarmentStatusDropdown({ 
  garmentDetails, 
  onStatusChange, 
  onReportIssue 
}: GarmentStatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasIssues = garmentDetails.stockIssues.length > 0;

  const handleStatusChange = (newStatus: GarmentStatus) => {
    onStatusChange(newStatus);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-auto p-1 hover:bg-muted"
        >
          <div className="flex items-center gap-2">
            <GarmentStatusBadge 
              status={garmentDetails.status} 
              hasIssues={hasIssues}
            />
            <ChevronDown className="h-3 w-3" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-background border">
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {Object.entries(GARMENT_STATUS_CONFIG).map(([status, config]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status as GarmentStatus)}
            className={`cursor-pointer ${
              status === garmentDetails.status ? 'bg-muted' : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>{config.label}</span>
              {status === garmentDetails.status && (
                <span className="text-xs text-muted-foreground">Current</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={onReportIssue}
          className="cursor-pointer text-orange-600 hover:text-orange-700"
        >
          Report Issue
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}