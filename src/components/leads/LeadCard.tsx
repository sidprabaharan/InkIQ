
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Lead } from '@/types/lead';
import { User, DollarSign } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  isDragging?: boolean;
}

export default function LeadCard({ lead, isDragging = false }: LeadCardProps) {
  const timeAgo = lead.lastContactedAt 
    ? formatDistanceToNow(new Date(lead.lastContactedAt), { addSuffix: true })
    : formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true });

  return (
    <Card className={`
      ${isDragging ? 'opacity-50' : 'opacity-100'}
      bg-white shadow-sm hover:shadow cursor-pointer transition-shadow duration-200
    `}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium line-clamp-1">{lead.name}</h3>
        </div>
        
        <div className="text-xs text-muted-foreground mb-2">
          {lead.company}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <DollarSign className="h-3 w-3 mr-1" />
            <span>${lead.value.toLocaleString()}</span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {timeAgo}
          </div>
        </div>
        
        {lead.notes && (
          <div className="mt-2 text-xs text-muted-foreground line-clamp-2">
            {lead.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
