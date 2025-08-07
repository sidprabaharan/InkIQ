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