
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { LeadColumn } from '@/types/lead';
import LeadColumnComponent from './LeadColumn';

interface LeadBoardProps {
  columns: LeadColumn[];
}

export default function LeadBoard({ columns }: LeadBoardProps) {
  return (
    <div className="flex space-x-4 h-full overflow-x-auto pb-4">
      {columns.map(column => (
        <DroppableColumn key={column.id} column={column} />
      ))}
    </div>
  );
}

function DroppableColumn({ column }: { column: LeadColumn }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className="flex-shrink-0 w-80"
    >
      <LeadColumnComponent column={column} />
    </div>
  );
}
