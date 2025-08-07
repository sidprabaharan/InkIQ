import { GarmentType, GarmentSize, ImprintPlacement } from './equipment';

export interface PricingTier {
  minQuantity: number;
  maxQuantity: number;
  basePrice: number;
  setupFee: number;
  additionalColorPrice?: number;
  rushSurcharge?: number;
}

export interface SizeCapability {
  maxWidth: number; // inches
  maxHeight: number; // inches
  minWidth: number; // inches
  minHeight: number; // inches
  notes?: string;
}

export interface ColorConstraints {
  maxColors: number;
  unlimitedColors: boolean;
  additionalColorFee: number;
  pantoneMatchingFee?: number;
  metallicSurcharge?: number;
  specialInkSurcharge?: number;
  supportedInkTypes: string[];
}

export interface QuantityConstraints {
  minimumQuantity: number;
  maximumQuantity: number;
  optimalQuantityRange: {
    min: number;
    max: number;
  };
  smallQuantityPenalty?: number;
  largeQuantityDiscount?: number;
}

export interface GarmentCompatibility {
  supportedGarmentTypes: GarmentType[];
  supportedSizes: GarmentSize[];
  supportedPlacements: ImprintPlacement[];
  materialRestrictions?: string[];
  weightRestrictions?: {
    minWeight: number; // oz per sq yard
    maxWeight: number; // oz per sq yard
  };
}

export interface EquipmentMapping {
  primaryEquipmentId?: string;
  secondaryEquipmentIds: string[];
  preferredEquipmentType: string;
  fallbackEquipmentType?: string;
  setupRequirements: string[];
}

export interface QualityStandards {
  artworkRequirements: string[];
  proofingRequired: boolean;
  qualityCheckpoints: string[];
  tolerances: {
    positionTolerance: number; // inches
    sizeTolerance: number; // percentage
    colorTolerance: string; // e.g., "Delta E <2"
  };
}

export interface TurnaroundTimes {
  standardTurnaround: number; // business days
  rushTurnaround: number; // business days
  rushFee: number; // percentage or flat fee
  expeditedOptions: {
    days: number;
    surcharge: number;
  }[];
}

export interface ImprintMethodConfiguration {
  id: string;
  method: string;
  label: string;
  enabled: boolean;
  description: string;
  
  // Pricing configuration
  pricingTiers: PricingTier[];
  
  // Physical constraints
  sizeCapabilities: SizeCapability;
  colorConstraints: ColorConstraints;
  quantityConstraints: QuantityConstraints;
  garmentCompatibility: GarmentCompatibility;
  
  // Equipment and production
  equipmentMapping: EquipmentMapping;
  qualityStandards: QualityStandards;
  turnaroundTimes: TurnaroundTimes;
  
  // File requirements
  customerArtTypes: string[];
  productionFileTypes: string[];
  artworkInstructions: string;
  technicalRequirements: string[];
  
  // Special considerations
  specialOptions: {
    oversizeCapable: boolean;
    oversizeSurcharge?: number;
    difficultPlacementSurcharge?: number;
    multiLocationDiscount?: number;
  };
  
  // AI integration
  aiPricingEnabled: boolean;
  constraintValidationEnabled: boolean;
  autoEquipmentSelection: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ImprintSettingsState {
  configurations: ImprintMethodConfiguration[];
  defaultConfiguration: Partial<ImprintMethodConfiguration>;
  globalSettings: {
    allowCustomPricing: boolean;
    requireApprovalAboveThreshold: number;
    autoCalculateRushFees: boolean;
    defaultTaxRate: number;
  };
}

// Helper functions
export function calculatePrice(
  config: ImprintMethodConfiguration,
  quantity: number,
  colors: number,
  isRush: boolean = false
): number {
  const tier = config.pricingTiers.find(
    t => quantity >= t.minQuantity && quantity <= t.maxQuantity
  );
  
  if (!tier) return 0;
  
  let totalPrice = tier.basePrice * quantity;
  totalPrice += tier.setupFee;
  
  // Additional colors
  if (colors > 1 && tier.additionalColorPrice) {
    totalPrice += tier.additionalColorPrice * (colors - 1) * quantity;
  }
  
  // Rush surcharge
  if (isRush && tier.rushSurcharge) {
    totalPrice += tier.rushSurcharge;
  }
  
  return totalPrice;
}

export function validateConstraints(
  config: ImprintMethodConfiguration,
  requirements: {
    quantity: number;
    colors: number;
    width: number;
    height: number;
    garmentType: GarmentType;
    placement: ImprintPlacement;
  }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Quantity validation
  if (requirements.quantity < config.quantityConstraints.minimumQuantity) {
    errors.push(`Minimum quantity is ${config.quantityConstraints.minimumQuantity}`);
  }
  
  if (requirements.quantity > config.quantityConstraints.maximumQuantity) {
    errors.push(`Maximum quantity is ${config.quantityConstraints.maximumQuantity}`);
  }
  
  // Size validation
  if (requirements.width > config.sizeCapabilities.maxWidth) {
    errors.push(`Maximum width is ${config.sizeCapabilities.maxWidth}"`);
  }
  
  if (requirements.height > config.sizeCapabilities.maxHeight) {
    errors.push(`Maximum height is ${config.sizeCapabilities.maxHeight}"`);
  }
  
  // Color validation
  if (!config.colorConstraints.unlimitedColors && requirements.colors > config.colorConstraints.maxColors) {
    errors.push(`Maximum colors is ${config.colorConstraints.maxColors}`);
  }
  
  // Garment type validation
  if (!config.garmentCompatibility.supportedGarmentTypes.includes(requirements.garmentType)) {
    errors.push(`${requirements.garmentType} is not supported for this imprint method`);
  }
  
  // Placement validation
  if (!config.garmentCompatibility.supportedPlacements.includes(requirements.placement)) {
    errors.push(`${requirements.placement} placement is not supported`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}