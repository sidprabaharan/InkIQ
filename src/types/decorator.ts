export interface Decorator {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  networks?: string[]; // Network memberships like S&S Activewear, Sanmar PSST
  capabilities: ImprintCapability[];
  pricing: DecoratorPricing;
  capacity: {
    dailyCapacity: number;
    currentLoad: number;
    leadTime: number; // in days
  };
  qualityRating: number; // 1-5
  onTimeRating: number; // 1-5
  verificationStatus: 'pending' | 'verified' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface ImprintCapability {
  method: string; // from IMPRINT_METHODS
  minQuantity: number;
  maxQuantity: number;
  maxColors: number;
  specializations: string[];
  setupFee: number;
  pricePerPiece: number;
  rushAvailable: boolean;
  rushFee?: number;
}

export interface DecoratorPricing {
  basePricing: {
    [method: string]: {
      setupFee: number;
      priceBreaks: {
        quantity: number;
        pricePerPiece: number;
      }[];
    };
  };
  rushMultiplier: number;
  minimumOrder: number;
}

export interface OutsourcingPreferences {
  userId: string;
  outsourcedMethods: string[]; // methods to outsource
  inHouseMethods: string[]; // methods to keep in-house
  autoApprovalLimit: number; // dollar amount for auto-approval
  preferredDecorators: string[]; // decorator IDs
  qualityRequirement: number; // minimum rating 1-5
  maxLeadTime: number; // maximum acceptable lead time in days
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceOrder {
  id: string;
  originalOrderId: string;
  distributorId: string;
  decoratorId: string;
  status: 'pending_quote' | 'quoted' | 'accepted' | 'in_production' | 'completed' | 'cancelled';
  items: MarketplaceOrderItem[];
  imprintRequirements: ImprintRequirement[];
  timeline: {
    quoteDeadline: Date;
    productionDeadline: Date;
    shippingAddress: Address;
  };
  pricing: {
    decorationCost: number;
    setupFees: number;
    rushFees: number;
    totalCost: number;
  };
  communication: OrderCommunication[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceOrderItem {
  id: string;
  sku: string;
  quantity: number;
  decorationMethod: string;
  decorationLocation: string;
  artworkFiles: string[];
  specialInstructions?: string;
}

export interface ImprintRequirement {
  method: string;
  location: string;
  colors: number;
  artworkProvided: boolean;
  rushRequired: boolean;
  specialRequirements: string[];
}

export interface OrderCommunication {
  id: string;
  senderId: string;
  senderType: 'distributor' | 'decorator' | 'system';
  message: string;
  attachments: string[];
  timestamp: Date;
  type: 'message' | 'quote' | 'approval' | 'status_update';
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface QuoteRequest {
  id: string;
  orderId: string;
  decoratorIds: string[];
  requirements: ImprintRequirement[];
  deadline: Date;
  status: 'sent' | 'partial_responses' | 'all_responded' | 'expired';
  responses: QuoteResponse[];
  createdAt: Date;
}

export interface QuoteResponse {
  decoratorId: string;
  pricing: {
    decorationCost: number;
    setupFees: number;
    rushFees: number;
    totalCost: number;
  };
  leadTime: number;
  notes?: string;
  submittedAt: Date;
}