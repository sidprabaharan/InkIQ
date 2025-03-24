
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import LeadBoard from '@/components/leads/LeadBoard';
import LeadCard from '@/components/leads/LeadCard';
import CreateLeadDialog from '@/components/leads/CreateLeadDialog';
import { Lead, LeadColumn, LeadStatus } from '@/types/lead';

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Acme Corp',
    email: 'john@acmecorp.com',
    phone: '555-123-4567',
    status: 'new',
    value: 5000,
    createdAt: new Date().toISOString(),
    lastContactedAt: new Date().toISOString(),
    notes: 'Interested in our premium package'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'XYZ Industries',
    email: 'sarah@xyzind.com',
    status: 'contacted',
    value: 7500,
    createdAt: new Date().toISOString(),
    lastContactedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Global Solutions',
    email: 'michael@globalsolutions.com',
    status: 'qualified',
    value: 10000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'Tech Innovators',
    email: 'emily@techinnovators.com',
    status: 'proposal',
    value: 15000,
    createdAt: new Date().toISOString(),
    lastContactedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Robert Wilson',
    company: 'Future Enterprises',
    email: 'robert@futureent.com',
    status: 'negotiation',
    value: 25000,
    createdAt: new Date().toISOString(),
  }
];

const columns: LeadColumn[] = [
  { id: 'new', title: 'New Leads', leads: [] },
  { id: 'contacted', title: 'Contacted', leads: [] },
  { id: 'qualified', title: 'Qualified', leads: [] },
  { id: 'proposal', title: 'Proposal', leads: [] },
  { id: 'negotiation', title: 'Negotiation', leads: [] },
  { id: 'won', title: 'Won', leads: [] },
  { id: 'lost', title: 'Lost', leads: [] },
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [boardColumns, setBoardColumns] = useState<LeadColumn[]>(() => {
    // Distribute the leads to their respective columns
    const updatedColumns = [...columns];
    leads.forEach(lead => {
      const columnIndex = updatedColumns.findIndex(col => col.id === lead.status);
      if (columnIndex !== -1) {
        updatedColumns[columnIndex].leads.push(lead);
      }
    });
    return updatedColumns;
  });
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    // Find the lead being dragged
    const lead = leads.find(lead => lead.id === active.id);
    if (lead) {
      setActiveLead(lead);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const leadId = active.id as string;
      const newStatus = over.id as LeadStatus;
      
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: newStatus }
            : lead
        )
      );
      
      // Update columns
      const updatedColumns = boardColumns.map(column => ({
        ...column,
        leads: column.leads.filter(lead => lead.id !== leadId)
      }));
      
      const targetColumnIndex = updatedColumns.findIndex(column => column.id === newStatus);
      const leadToMove = leads.find(lead => lead.id === leadId);
      
      if (targetColumnIndex !== -1 && leadToMove) {
        updatedColumns[targetColumnIndex].leads.push({
          ...leadToMove,
          status: newStatus
        });
      }
      
      setBoardColumns(updatedColumns);
    }
    
    setActiveId(null);
    setActiveLead(null);
  };

  const handleCreateLead = (newLead: Omit<Lead, 'id' | 'createdAt'>) => {
    const lead: Lead = {
      ...newLead,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    setLeads(prev => [...prev, lead]);
    
    // Add to appropriate column
    const updatedColumns = [...boardColumns];
    const columnIndex = updatedColumns.findIndex(col => col.id === lead.status);
    if (columnIndex !== -1) {
      updatedColumns[columnIndex].leads.push(lead);
      setBoardColumns(updatedColumns);
    }
    
    setShowCreateDialog(false);
  };

  return (
    <div className="flex flex-col w-full h-full p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Lead Pipeline</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <LeadBoard columns={boardColumns} />
          <DragOverlay>
            {activeId && activeLead ? (
              <LeadCard lead={activeLead} isDragging />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      
      {showCreateDialog && (
        <CreateLeadDialog 
          open={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onSave={handleCreateLead}
        />
      )}
    </div>
  );
}
