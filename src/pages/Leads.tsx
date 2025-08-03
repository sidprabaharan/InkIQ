import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import LeadBoard from '@/components/leads/LeadBoard';
import LeadCard from '@/components/leads/LeadCard';
import EnhancedLeadDetails from '@/components/leads/EnhancedLeadDetails';
import CreateLeadDialog from '@/components/leads/CreateLeadDialog';
import EditLeadDialog from '@/components/leads/EditLeadDialog';
import { Lead, LeadColumn, LeadStatus } from '@/types/lead';

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    company: 'Acme Corp',
    email: 'john@acmecorp.com',
    phone: '555-123-4567',
    status: 'new_lead',
    value: 5000,
    createdAt: new Date().toISOString(),
    lastContactedAt: new Date().toISOString(),
    notes: 'Customer needs custom t-shirts and hats for their annual music festival scheduled for September 1st. They are expecting approximately 2,500 attendees and want to offer branded merchandise at their vendor booths. • T-shirt requirements: 500 units in various sizes (S-XXL), preferably 100% cotton, with festival logo and date on front, sponsor logos on back • Hat requirements: 300 units, adjustable baseball caps or snapbacks, embroidered festival logo • Timeline is tight - need final designs approved by August 15th for production to meet September 1st deadline • Budget range: $8,000-$12,000 total • Previous experience with local suppliers was disappointing due to quality issues • Looking for a reliable partner who can handle rush orders and maintain consistent quality standards • Interested in potential ongoing partnership for future events',
    customerType: 'new',
    aiEnriched: true,
    dataSource: 'email',
    confidenceScore: 0.85,
    address: {
      street: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/johnsmith',
      instagram: 'https://instagram.com/acmecorp'
    },
    companyInfo: {
      size: '50-200 employees',
      industry: 'Technology, Software',
      estimatedAnnualSpend: 15000,
      website: 'https://acmecorp.com'
    },
    lastEnrichedAt: new Date().toISOString(),
    totalActivities: 3,
    lastActivityType: 'email'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'XYZ Industries',
    email: 'sarah@xyzind.com',
    status: 'in_contact',
    value: 7500,
    createdAt: new Date().toISOString(),
    lastContactedAt: new Date().toISOString(),
    customerType: 'existing',
    existingCustomerId: 'cust-123',
    aiEnriched: true,
    dataSource: 'form',
    confidenceScore: 0.92,
    companyInfo: {
      size: '200-500 employees',
      industry: 'Manufacturing',
      estimatedAnnualSpend: 25000
    },
    totalActivities: 5,
    lastActivityType: 'call'
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Global Solutions',
    email: 'michael@globalsolutions.com',
    status: 'qualified',
    value: 10000,
    createdAt: new Date().toISOString(),
    customerType: 'new',
    aiEnriched: false,
    dataSource: 'manual',
    totalActivities: 1,
    lastActivityType: 'note'
  },
  {
    id: '4',
    name: 'Emily Davis',
    company: 'Tech Innovators',
    email: 'emily@techinnovators.com',
    status: 'quoted',
    value: 15000,
    createdAt: new Date().toISOString(),
    lastContactedAt: new Date().toISOString(),
    customerType: 'new',
    aiEnriched: true,
    dataSource: 'ai',
    confidenceScore: 0.78,
    quoteId: 'quote-001',
    companyInfo: {
      size: '10-50 employees',
      industry: 'Technology, Startups',
      estimatedAnnualSpend: 8000
    },
    totalActivities: 7,
    lastActivityType: 'meeting'
  },
  {
    id: '5',
    name: 'Robert Wilson',
    company: 'Future Enterprises',
    email: 'robert@futureent.com',
    status: 'follow_up',
    value: 25000,
    createdAt: new Date().toISOString(),
    customerType: 'new',
    aiEnriched: true,
    dataSource: 'email',
    confidenceScore: 0.95,
    quoteId: 'quote-002',
    socialProfiles: {
      linkedin: 'https://linkedin.com/in/robertwilson',
      facebook: 'https://facebook.com/futureenterprises'
    },
    companyInfo: {
      size: '500+ employees',
      industry: 'Enterprise, Consulting',
      estimatedAnnualSpend: 50000,
      website: 'https://futureenterprises.com'
    },
    totalActivities: 12,
    lastActivityType: 'email'
  }
];

const columns: LeadColumn[] = [
  { id: 'new_lead', title: 'New Lead', leads: [] },
  { id: 'in_contact', title: 'In Contact', leads: [] },
  { id: 'qualified', title: 'Qualified', leads: [] },
  { id: 'quoted', title: 'Quoted', leads: [] },
  { id: 'follow_up', title: 'Follow Up', leads: [] },
  { id: 'closed_won', title: 'Closed Won', leads: [] },
  { id: 'closed_lost', title: 'Closed Lost', leads: [] },
];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [boardColumns, setBoardColumns] = useState<LeadColumn[]>(() => {
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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

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
    
    const updatedColumns = [...boardColumns];
    const columnIndex = updatedColumns.findIndex(col => col.id === lead.status);
    if (columnIndex !== -1) {
      updatedColumns[columnIndex].leads.push(lead);
      setBoardColumns(updatedColumns);
    }
    
    setShowCreateDialog(false);
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  const handleLeadDetailsClose = (open: boolean) => {
    setShowLeadDetails(open);
    if (!open) {
      setSelectedLead(null);
    }
  };

  const handleEditLead = (lead: Lead) => {
    setLeadToEdit(lead);
    setShowEditDialog(true);
    setShowLeadDetails(false); // Close the details dialog
  };

  const handleSaveEditedLead = (updatedLead: Lead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );

    // Update the board columns
    const updatedColumns = boardColumns.map(column => ({
      ...column,
      leads: column.leads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      )
    }));
    setBoardColumns(updatedColumns);

    // Update selected lead if it's currently displayed
    if (selectedLead?.id === updatedLead.id) {
      setSelectedLead(updatedLead);
    }

    setShowEditDialog(false);
    setLeadToEdit(null);
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
          <LeadBoard columns={boardColumns} onLeadClick={handleLeadClick} />
          <DragOverlay>
            {activeId && activeLead ? (
              <LeadCard 
                lead={activeLead} 
                isDragging 
                onClick={() => {}}
              />
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

      <EnhancedLeadDetails 
        lead={selectedLead}
        open={showLeadDetails}
        onOpenChange={handleLeadDetailsClose}
        onEditLead={handleEditLead}
      />

      <EditLeadDialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        onSave={handleSaveEditedLead}
        lead={leadToEdit}
      />
    </div>
  );
}
