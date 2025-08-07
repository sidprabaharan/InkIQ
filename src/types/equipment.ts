export type GarmentType = 
  | 'tshirt' | 'polo' | 'hoodie' | 'sweatshirt' | 'tank_top'
  | 'long_sleeve' | 'cap' | 'beanie' | 'baseball_hat' | 'snapback'
  | 'tote_bag' | 'apron' | 'jacket' | 'vest' | 'uniform_shirt'
  | 'youth_tshirt' | 'baby_onesie' | 'ladies_fitted';

export type GarmentSize = 
  | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'XXXXL'
  | 'Youth_XS' | 'Youth_S' | 'Youth_M' | 'Youth_L' | 'Youth_XL'
  | 'Infant_6M' | 'Infant_12M' | 'Infant_18M' | 'Infant_24M'
  | 'Toddler_2T' | 'Toddler_3T' | 'Toddler_4T' | 'Toddler_5T';

export type ImprintPlacement = 
  | 'front_center' | 'front_left_chest' | 'front_right_chest'
  | 'back_center' | 'back_upper' | 'back_lower'
  | 'left_sleeve' | 'right_sleeve' | 'both_sleeves'
  | 'front_full' | 'back_full' | 'all_over'
  | 'cap_front' | 'cap_back' | 'cap_side' | 'cap_undervisor'
  | 'pocket' | 'collar' | 'hem' | 'cuff';

export interface EquipmentConstraints {
  // Color/Screen limitations
  maxColors?: number;
  maxScreens?: number;
  unlimitedColors?: boolean;
  
  // Size constraints
  supportedSizes: GarmentSize[];
  maxImprintWidth: number;  // in inches
  maxImprintHeight: number; // in inches
  
  // Garment type constraints
  supportedGarmentTypes: GarmentType[];
  excludedGarmentTypes?: GarmentType[];
  
  // Imprint placement constraints
  supportedPlacements: ImprintPlacement[];
  
  // Material constraints
  supportedMaterials?: string[]; // e.g., "100% Cotton", "Polyester Blend"
  
  // Special capabilities
  supportsMultiColorRegistration?: boolean;
  supportsFourColorProcess?: boolean;
  supportsMetallicInks?: boolean;
  supportsWaterBased?: boolean;
  supportsPVC?: boolean;
  
  // Physical constraints
  maxThickness?: number; // garment thickness in mm
  minQuantityPerRun: number;
  maxQuantityPerRun: number;
  
  // Setup constraints
  requiresSpecialSetup?: boolean;
  setupNotes?: string;
}

export interface StageAssignment {
  decorationMethod: string;
  stageIds: string[];
}

export interface EmbroideryMachine {
  id: string;
  name: string;
  type: "embroidery";
  heads: number;
  maxColors: number;
  minQuantity: number;
  maxQuantity: number;
  capacity: number; // items per day
  currentLoad: number; // current utilization percentage
  status: "available" | "busy" | "maintenance" | "offline";
  setupTime: number; // minutes
  stageAssignments: StageAssignment[];
  constraints: EquipmentConstraints;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScreenPrintingPress {
  id: string;
  name: string;
  type: "screen_printing";
  screens: number;
  isAutomatic: boolean;
  minQuantity: number;
  maxQuantity: number;
  capacity: number; // items per day
  currentLoad: number; // current utilization percentage
  status: "available" | "busy" | "maintenance" | "offline";
  setupTime: number; // minutes
  stageAssignments: StageAssignment[];
  constraints: EquipmentConstraints;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductionEquipment = EmbroideryMachine | ScreenPrintingPress;

export interface ProductionJob {
  id: string;
  quoteId: string;
  quoteName: string;
  itemId: string;
  itemName: string;
  description: string;
  quantity: number;
  decorationMethod: "embroidery" | "screen_printing" | "heat_press" | "vinyl" | "direct_to_garment";
  dueDate: Date;
  priority: "low" | "medium" | "high" | "rush";
  assignedEquipmentId?: string;
  status: "pending" | "scheduled" | "in_progress" | "completed" | "on_hold";
  estimatedDuration: number; // minutes
  scheduledStartTime?: Date;
  scheduledEndTime?: Date;
  artworkCompleted: boolean;
  setupRequired: boolean;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquipmentCapability {
  decorationMethod: string;
  minQuantity: number;
  maxQuantity: number;
  setupTime: number;
  efficiency: number; // items per minute
}

export interface ProductionSchedule {
  equipmentId: string;
  jobs: ScheduledJob[];
  totalCapacity: number;
  utilizationPercentage: number;
}

export interface ScheduledJob {
  jobId: string;
  startTime: Date;
  endTime: Date;
  setupTime: number;
  productionTime: number;
}

export interface JobAnalysis {
  jobId: string;
  recommendedEquipment: ProductionEquipment[];
  conflicts: SchedulingConflict[];
  estimatedCompletion: Date;
  urgencyScore: number;
}

export interface SchedulingConflict {
  type: "capacity_exceeded" | "equipment_unavailable" | "due_date_risk" | "setup_overlap";
  description: string;
  severity: "low" | "medium" | "high";
  suggestedActions: string[];
}