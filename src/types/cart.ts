export type Supplier = {
  name: string;
  price: number;
  inventory: number;
};

export type CartItem = {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  supplierName: string;
  image?: string;
  quantities: {
    location: string;
    size: string;
    quantity: number;
  }[];
  totalQuantity: number;
};

export type Cart = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'ready' | 'submitted';
  customerId?: string;
  jobId?: string;
  orderingStrategy: 'separate' | 'combined';
  automationLevel: 'manual' | 'hybrid' | 'autonomous';
  items: CartItem[];
  metadata: {
    notes?: string;
    poNumber?: string;
    priority?: 'low' | 'medium' | 'high';
    estimatedShipDate?: Date;
  };
};

export type CartMetadata = {
  notes?: string;
  poNumber?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedShipDate?: Date;
};

export type UserSettings = {
  automationLevel: 'manual' | 'hybrid' | 'autonomous';
  defaultOrderingStrategy: 'separate' | 'combined';
  cartNamingPreference: 'auto' | 'manual';
  approvalRequired: boolean;
};