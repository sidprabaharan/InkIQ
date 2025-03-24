
import React from 'react';
import { LeadColumn } from '@/types/lead';
import { useDraggable } from '@dnd-kit/core';
import LeadCard from './LeadCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface LeadColumnProps {
  column: LeadColumn;
}

export default function LeadColumnComponent({ column }: LeadColumnProps) {
  const totalValue = column.leads.reduce((sum, lead) => sum + lead.value, 0);
  
  return (
    <Card className="h-full flex flex-col bg-slate-50">
      <CardHeader className="py-3 px-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm font-medium">
            {column.title} ({column.leads.length})
          </CardTitle>
          <div className="text-sm font-medium text-muted-foreground">
            ${totalValue.toLocaleString()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {column.leads.map(lead => (
            <DraggableLead key={lead.id} lead={lead} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DraggableLead({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1 : undefined,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <LeadCard lead={lead} isDragging={isDragging} />
    </div>
  );
}
