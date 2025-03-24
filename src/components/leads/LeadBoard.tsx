
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Lead, LeadColumn } from '@/types/lead';
import LeadColumnComponent from './LeadColumn';

interface LeadBoardProps {
  columns: LeadColumn[];
  onLeadClick: (lead: Lead) => void;
}

export default function LeadBoard({ columns, onLeadClick }: LeadBoardProps) {
  return (
    <div className="flex space-x-4 h-full overflow-x-auto pb-4">
      {columns.map(column => (
        <DroppableColumn key={column.id} column={column} onLeadClick={onLeadClick} />
      ))}
    </div>
  );
}

function DroppableColumn({ column, onLeadClick }: { column: LeadColumn; onLeadClick: (lead: Lead) => void }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className="flex-shrink-0 w-80"
    >
      <LeadColumnComponent column={column} onLeadClick={onLeadClick} />
    </div>
  );
}
