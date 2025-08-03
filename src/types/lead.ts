
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
  
  // Contact Details
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  
  // Social Media Profiles
  socialProfiles?: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  
  // Company Intelligence
  companyInfo?: {
    size?: string;
    industry?: string;
    estimatedAnnualSpend?: number;
    website?: string;
  };
  
  // Customer Classification
  customerType: 'new' | 'existing';
  existingCustomerId?: string;
  
  // AI Enrichment Data
  aiEnriched?: boolean;
  dataSource?: 'manual' | 'email' | 'form' | 'ai';
  confidenceScore?: number;
  lastEnrichedAt?: string;
  
  // Activity Data
  totalActivities?: number;
  lastActivityType?: string;
  
  // Quote Information
  quoteId?: string;
}

export type LeadStatus = 'new_lead' | 'in_contact' | 'qualified' | 'quoted' | 'follow_up' | 'closed_won' | 'closed_lost';

export interface LeadColumn {
  id: LeadStatus;
  title: string;
  leads: Lead[];
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'form_submission' | 'quote' | 'logo_upload' | 'product_selection';
  title: string;
  description?: string;
  timestamp: string;
  metadata?: {
    emailThread?: EmailThread;
    callLog?: CallLog;
    quoteId?: string;
    totalAmount?: number;
    products?: string[];
    printMethod?: string;
    fileName?: string;
    fileSize?: string;
    [key: string]: any;
  };
}

export interface EmailThread {
  id: string;
  subject: string;
  participants: string[];
  messages: EmailMessage[];
  lastMessageAt: string;
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

export interface CallLog {
  id: string;
  duration: number;
  direction: 'inbound' | 'outbound';
  outcome: 'answered' | 'voicemail' | 'no_answer' | 'busy';
  notes?: string;
  recordingUrl?: string;
}
