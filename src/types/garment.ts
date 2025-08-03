export type GarmentStatus = 
  | 'pending'
  | 'po_created'
  | 'ordered'
  | 'received'
  | 'damaged'
  | 'stock_issue'
  | 'ready';

export type GarmentIssueType = 
  | 'damaged'
  | 'missing'
  | 'quality_issue'
  | 'delayed'
  | 'incorrect_item'
  | 'size_issue';

export interface GarmentIssue {
  id: string;
  type: GarmentIssueType;
  description: string;
  reportedDate: Date;
  resolvedDate?: Date;
  severity: 'low' | 'medium' | 'high';
  affectedQuantity: number;
  notes?: string;
}

export interface GarmentStatusHistory {
  id: string;
  status: GarmentStatus;
  timestamp: Date;
  notes?: string;
  updatedBy?: string;
}

export interface GarmentDetails {
  status: GarmentStatus;
  poReference?: string;
  stockIssues: GarmentIssue[];
  receivedQuantity: number;
  expectedQuantity: number;
  statusHistory: GarmentStatusHistory[];
  notes?: string;
  lastUpdated: Date;
}

export const GARMENT_STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-gray-100 text-gray-800',
    description: 'Waiting to be processed'
  },
  po_created: {
    label: 'PO Created',
    color: 'bg-blue-100 text-blue-800',
    description: 'Purchase order has been created'
  },
  ordered: {
    label: 'Ordered',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Order has been placed with supplier'
  },
  received: {
    label: 'Received',
    color: 'bg-green-100 text-green-800',
    description: 'Items have been received'
  },
  damaged: {
    label: 'Damaged',
    color: 'bg-red-100 text-red-800',
    description: 'Items are damaged and need replacement'
  },
  stock_issue: {
    label: 'Stock Issue',
    color: 'bg-orange-100 text-orange-800',
    description: 'Stock availability issues'
  },
  ready: {
    label: 'Ready',
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Ready for production/delivery'
  }
} as const;