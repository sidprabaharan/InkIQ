export interface EmailAccount {
  id: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'other';
  isConnected: boolean;
  status: 'online' | 'offline' | 'syncing';
  unreadCount: number;
  displayName: string;
  avatar?: string;
  lastSynced?: Date;
  syncError?: string;
}

export interface Email {
  id: string;
  accountId: string;
  from: {
    email: string;
    name: string;
    avatar?: string;
  };
  to: Array<{
    email: string;
    name: string;
  }>;
  cc?: Array<{
    email: string;
    name: string;
  }>;
  bcc?: Array<{
    email: string;
    name: string;
  }>;
  subject: string;
  content: string;
  htmlContent?: string;
  date: string;
  read: boolean;
  starred: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'spam' | 'trash';
  labels: string[];
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }>;
  threadId?: string;
  replyTo?: string;
  messageId: string;
  importance?: 'low' | 'normal' | 'high';
}

export interface EmailThread {
  id: string;
  subject: string;
  participants: Array<{
    email: string;
    name: string;
    avatar?: string;
  }>;
  emails: Email[];
  lastActivity: string;
  unreadCount: number;
  accountId: string;
}

export interface EmailComposition {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  content: string;
  signature?: string;
  attachments?: File[];
  replyToId?: string;
  threadId?: string;
}