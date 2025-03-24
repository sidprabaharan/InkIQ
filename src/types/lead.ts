
export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  value: number;
  createdAt: string;
  lastContactedAt?: string;
  notes?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface LeadColumn {
  id: LeadStatus;
  title: string;
  leads: Lead[];
}
