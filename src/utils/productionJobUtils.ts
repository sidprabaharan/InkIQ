import { ProductionJob } from "@/types/equipment";
import { GarmentStatus } from "@/types/garment";

// Helper function to map production job status to garment status
export const mapProductionStatusToGarmentStatus = (productionStatus: ProductionJob['status']): GarmentStatus => {
  const statusMap: Record<ProductionJob['status'], GarmentStatus> = {
    pending: 'pending',
    scheduled: 'scheduled',
    in_progress: 'in_production',
    completed: 'production_complete',
    on_hold: 'pending'
  };
  
  return statusMap[productionStatus];
};

// Helper function to determine decoration method from item properties
export const determineDecorationMethod = (item: any): ProductionJob['decorationMethod'] => {
  // Simple logic to determine decoration method
  if (item.category?.toLowerCase().includes('embroid')) return 'embroidery';
  if (item.description?.toLowerCase().includes('embroid')) return 'embroidery';
  
  // For screen printing, consider quantity thresholds
  const totalQuantity: number = item.sizes ? 
    (Object.values(item.sizes).reduce((sum: number, qty: any): number => {
      const quantity: number = typeof qty === 'number' ? qty : parseInt(String(qty) || "0");
      const validQuantity: number = isNaN(quantity) ? 0 : quantity;
      return sum + validQuantity;
    }, 0) as number) :
    parseInt(String(item.quantity || "0"));
    
  const validQuantity: number = isNaN(totalQuantity) ? 0 : totalQuantity;
    
  if (validQuantity > 50) return 'screen_printing';
  
  // Default to screen printing for most cases
  return 'screen_printing';
};

// Helper function to calculate total quantity from sizes object
export const calculateTotalQuantity = (sizes: Record<string, number>): number => {
  return Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
};

// Helper function to estimate production duration based on quantity and method
export const estimateProductionDuration = (
  quantity: number, 
  decorationMethod: ProductionJob['decorationMethod']
): number => {
  // Base times in minutes per item
  const baseTimePerItem = {
    embroidery: 2, // 2 minutes per item for embroidery
    screen_printing: 0.5, // 30 seconds per item for screen printing
    heat_press: 1, // 1 minute per item for heat press
    vinyl: 1.5, // 1.5 minutes per item for vinyl
    direct_to_garment: 3 // 3 minutes per item for DTG
  };
  
  // Setup times in minutes
  const setupTime = {
    embroidery: 30,
    screen_printing: 45,
    heat_press: 15,
    vinyl: 20,
    direct_to_garment: 10
  };
  
  const productionTime = quantity * baseTimePerItem[decorationMethod];
  const totalTime = setupTime[decorationMethod] + productionTime;
  
  return Math.ceil(totalTime);
};

// Helper function to determine priority based on due date and rush status
export const determinePriority = (dueDate: Date, isRush: boolean = false): ProductionJob['priority'] => {
  if (isRush) return 'rush';
  
  const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue <= 2) return 'high';
  if (daysUntilDue <= 5) return 'medium';
  return 'low';
};